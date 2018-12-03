(* Copyright Swirlds Inc 2018 *)
(** * Definitions of Voting

  This file includes definitions for

  - [votes]
  - [fractTrue]
  - [decide]
  - [copyVote]
  - [vote]
  - [Famous]
  - [uniqueFamous]
  - [roundsDecided]

  Events vote on whether or not witnesses are famous. Famous events are
  important because they are the canonical source of information.
 *)
Require Import Coq.Lists.List.
Require Import Coq.Bool.Bool.
Require Import Coq.Classes.Morphisms.
Require Import Coq.omega.Omega.
Require Import Coq.Sorting.Permutation.
Require Coq.QArith.QArith.
Require Import Coq.Logic.Eqdep_dec.
Require Import Psatz.

Require Import ExtLib.Relations.TransitiveClosure.
Require Import ExtLib.Recur.Relation.
Require Import ExtLib.Recur.GenRec.
Require Import ExtLib.Recur.Facts.
Require Import ExtLib.Recur.Measure.

Require Import Swirlds.ToBool.
Require Import Swirlds.FixLib.
Require Import Swirlds.Pigeon.
Require Import Swirlds.Graph.
Require Import Swirlds.Util.
Require Import Swirlds.Math.
Require Import Swirlds.Lemmas.
Require Import Swirlds.HashGraph.
Require Import Swirlds.Sets.
Require Import Swirlds.Unique.
Require Import Swirlds.Tactics.
Require Import Swirlds.Definitions.
Require Import Swirlds.Round.
Require Import Swirlds.See.


Module Voting (HG : HashGraph).
  Import HG.GO.
  Import HG.
  Module ROUND := Rounds HG.
  Import ROUND.SEE.DEFS.
  Import ROUND.SEE.
  Import ROUND.

  Existing Class G.Acyclic.

  (** * Voting *)
  Section voting.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    Definition diff (x y : E) : nat :=
      round g x - round g y.

    Definition is_CoinRound (x y : E) : bool :=
      Nat.eqb ((diff x y) mod FrequencyOfCoinRounds) 0.

    Import QArith.

    Record Voting : Type :=
    { _votes : bool -> nat
    ; _fractTrue : Q
    ; _decide : bool
    ; _copyVote : bool
    ; _vote : bool
    }.

    Definition RVoting (a b : Voting) : Prop :=
      (forall x, _votes a x = _votes b x) /\
      _fractTrue a = _fractTrue b /\
      _decide a = _decide b /\
      _copyVote a = _copyVote b /\
      _vote a = _vote b.

    Definition UNREACHABLE : bool. exact true. Qed.

    Definition div_with_zero (n d : nat) : Q :=
      match N.of_nat d with
      | Npos p => Z.of_nat n # p
      | N0 => 0
      end.

    Notation "n =? m" := (Nat.eqb n m).

    Definition ambiguousFrac (q : Q) : bool :=
      Qle_bool (1 # 3) q && Qle_bool q(2 # 3).

    Definition voting_body (y x : E) (rec : forall y, rightTrans (G.IsEdge g) y x -> Voting) : Voting :=
      let votes v :=
          length (stronglySee_nodes g x (fun z pf => Nat.eqb (diff x z) 1
                                               && witness g z
                                               && bool_eq (_vote (rec z pf)) v))
      in
      let fractTrue := div_with_zero (votes true) (votes true + votes false) in
      let decide :=
          match selfParent_edge g x with
          | None => false
          | Some (exist _ _ pf) => _decide (rec _ (@RTFin _ _ _ _ pf))
          end ||
          (witness g x && witness g y && Nat.ltb 1 (diff x y) && negb (is_CoinRound x y) && (Nat.ltb two_third (votes true) || Nat.ltb two_third (votes false)))
      in
      let copyVote := negb (witness g x) || (match selfParent_edge g x with
                                          | None => false
                                          | Some (exist _ _ pf) =>
                                            _decide (rec _ (@RTFin _ _ _ _ pf))
                                          end) in
      let vote :=
          if copyVote
          then match selfParent_edge g x with
               | None => UNREACHABLE
               | Some (exist _ _ pf) => _vote (rec _ (@RTFin _ _ _ _ pf))
               end
          else if negb copyVote && is_CoinRound x y && ambiguousFrac fractTrue
               then Nat.eqb 1 (middleBit (signature x))
               else Qle_bool (1 # 2) fractTrue
      in
      {| _votes := votes
       ; _fractTrue := fractTrue
       ; _decide := decide
       ; _copyVote := copyVote
       ; _vote := vote
       |}.

    Definition voting (x y : E) : Voting :=
      Fix (wf_rightTrans Acyclic_g) (fun _ => Voting)
          (voting_body y) x.

    Definition votes (x y : E) (v : bool) : nat := _votes (voting x y) v.
    Definition fractTrue (x y : E) : Q := _fractTrue (voting x y).
    Definition decide (x y : E) : bool := _decide (voting x y).
    Definition copyVote (x y : E) : bool := _copyVote (voting x y).
    Definition vote (x y : E) : bool := _vote (voting x y).

    Lemma Proper_voting_body:
      forall (y : E) (x0 : G.Node)
        (f g0 : forall y0 : G.Node, rightTrans (G.IsEdge g) y0 x0 -> Voting),
        (forall (y0 : G.Node) (p : rightTrans (G.IsEdge g) y0 x0), RVoting (f y0 p) (g0 y0 p)) ->
        RVoting (voting_body y x0 f) (voting_body y x0 g0).
    Proof.
      intros y x0 f g0 H.
      unfold RVoting. simpl; intros.
      eapply split_with; [ | intro ].
      { intros. f_equal.
        eapply stronglySee_nodes_ext.
        intros.
        red in H.
        f_equal. f_equal. apply H. }
      eapply split_with; [ | intro ].
      { do 2 rewrite H0. reflexivity. }
      eapply split_with; [ | intro ].
      { f_equal.
        { destruct (selfParent_edge g x0); auto.
          destruct s. eapply H. }
        { f_equal. repeat rewrite H0. reflexivity. } }
      eapply split_with; [ | intro ].
      { f_equal.
        destruct (selfParent_edge g x0); auto.
        destruct s. apply H. }
      progress repeat rewrite H3; clear H3.
      progress repeat rewrite H1; clear H1.
      destruct (witness g x0); simpl.
      { destruct (selfParent_edge g x0); simpl.
        { destruct s; simpl.
          match goal with
          | |- context [ if ?X then _ else _ ] => destruct X
          end; auto.
          apply H. }
        { match goal with
          | |- context [ if ?X then _ else _ ] => destruct X
          end; auto. } }
      { match goal with
        | |- context [ match ?X with _ => _ end ] => destruct X
        end; auto.
        destruct s. apply H. }
    Qed.

    Opaque Nat.eqb.

    Definition Voting_spec (x y : E) : Voting :=
      {| _votes v :=
           length (nodeSubset g (fun z => (diff x z =? 1)
                                         && witness g z
                                         && stronglySee g x z
                                         && bool_eq (vote z y) v))
       ; _fractTrue :=
           div_with_zero (votes x y true) (votes x y true + votes x y false)
       ; _decide :=
           match selfParent g x with
           | None => false
           | Some z => decide z y
           end || (witness g x && witness g y && Nat.ltb 1 (diff x y) && Nat.ltb 0 (diff x y mod FrequencyOfCoinRounds) && (Nat.ltb two_third (votes x y true) || Nat.ltb two_third (votes x y false)))
       ; _copyVote :=
           negb (witness g x) || match selfParent g x with
                              | None => false
                              | Some z => decide z y
                              end
       ; _vote :=
           if copyVote x y
           then match selfParent g x with
                | None => UNREACHABLE
                | Some z => vote z y
                end
           else if negb (copyVote x y) && ((diff x y) mod FrequencyOfCoinRounds =? 0)%nat && (Qle_bool (1 # 3) (fractTrue x y) && Qle_bool (fractTrue x y) (2 # 3))
                then 1 =? middleBit (signature x)
                else Qle_bool (1 # 2) (fractTrue x y)
      |}.

    Theorem voting_sound : forall x y,
        (forall v, votes x y v =
              length (nodeSubset g (fun z => (diff x z =? 1)
                                        && witness g z
                                        && stronglySee g x z
                                        && bool_eq (vote z y) v)))%nat
        /\ (fractTrue x y =
             div_with_zero (votes x y true) (votes x y true + votes x y false))
        /\ (decide x y =
           match selfParent g x with
           | None => false
           | Some z => decide z y
           end || (witness g x && witness g y && Nat.ltb 1 (diff x y) && negb (is_CoinRound x y) && (Nat.ltb two_third (votes x y true) || Nat.ltb two_third (votes x y false))))
        /\ (copyVote x y = negb (witness g x) || match selfParent g x with
                                              | None => false
                                              | Some z => decide z y
                                              end)
        /\ (vote x y = if copyVote x y
                      then match selfParent g x with
                           | None => UNREACHABLE
                           | Some z => vote z y
                           end
                      else if negb (copyVote x y) && is_CoinRound x y && ambiguousFrac (fractTrue x y)
                           then 1 =? middleBit (signature x)
                           else Qle_bool (1 # 2) (fractTrue x y)).
    Proof.
      unfold votes, fractTrue, decide, copyVote, vote, voting.
      intros x y.
      lazymatch goal with
      | |- context [ @Fix ?A ?R ?WF ?P ?F ] =>
        eapply (@Fix_equiv_ind_eq A R WF P F) with (r := fun _ => RVoting)
      end; intros.
      { split.
        { simpl. intros.
          f_equal. eapply stronglySee_nodes_nodeSubset.
          { intros.
            repeat rewrite andb_true_iff in H2.
            eapply stronglySee_ok. tauto.  }
          { intros.
            repeat rewrite <- andb_assoc.
            f_equal; auto.
            f_equal.
            rewrite (proj2 (stronglySee_ok _ _ _) H2). simpl.
            unfold Fix.
            subst. reflexivity. } }
        split; [ reflexivity | ].
        split.
        { simpl.
          f_equal.
          { destruct (selfParent_edge_selfParent g x0); auto.
            destruct H2. subst f. reflexivity. } }
        eapply split_with; [ | intro ].
        { simpl. f_equal.
          destruct (selfParent_edge_selfParent g x0); auto.
          destruct H2. subst. reflexivity. }
        { simpl.
          destruct (witness g x0); destruct (selfParent_edge_selfParent g x0); simpl.
          { match goal with
            | |- context [ if ?X then _ else _ ] => destruct X
            end; eauto. }
          { match goal with
            | |- context [ if ?X then _ else _ ] => destruct X
            end; eauto.
            inversion H3. subst. reflexivity. }
          { reflexivity. }
          { inversion H3. subst. reflexivity. } } }
      { eapply Proper_voting_body; auto. }
      { do 3 red. intros.
        split.
        { intros.
          etransitivity; [ symmetry; eapply H | eapply H0 ]. }
        split.
        { etransitivity; [ symmetry; eapply H | ].
          etransitivity. eapply H0.
          f_equal. eapply H. f_equal; eapply H. }
        split.
        { etransitivity; [ symmetry; eapply H | ].
          etransitivity; [ eapply H0 | ].
          destruct (selfParent g x0); simpl.
          { f_equal. f_equal. f_equal; f_equal; eapply H. }
          { f_equal. f_equal; f_equal; eapply H. } }
        split.
        { etransitivity; [ symmetry; eapply H | ].
          etransitivity; [ eapply H0 | ].
          reflexivity. }
        { etransitivity; [ symmetry; eapply H | ].
          etransitivity; [ eapply H0 | ].
          cutrewrite (_copyVote x1 = _copyVote y0).
          { destruct (_copyVote y0).
            { destruct (selfParent g x0); auto. }
            { simpl.
              match goal with
              | |- (if ?X then _ else _) = (if ?Y then _ else _) =>
                cutrewrite (X = Y); [ destruct Y | ]; eauto
              end.
              { f_equal. eapply H. }
              { f_equal. f_equal; eapply H. } } }
          { eapply H. } } }
    Qed.

    Lemma votes_spec : forall x y v, votes x y v =
              length (nodeSubset g (fun z => (diff x z =? 1)
                                        && witness g z
                                        && stronglySee g x z
                                        && bool_eq (vote z y) v))%nat.
    Proof. apply voting_sound. Qed.

    Lemma fractTrue_spec : forall x y,
        fractTrue x y =
        div_with_zero (votes x y true) (votes x y true + votes x y false).
    Proof. apply voting_sound. Qed.

    Lemma decide_spec : forall x y,
        decide x y =
        match selfParent g x with
        | None => false
        | Some z => decide z y
        end || (witness g x && witness g y
              && Nat.ltb 1 (diff x y) && negb (is_CoinRound x y)
              && (Nat.ltb two_third (votes x y true) || Nat.ltb two_third (votes x y false))).
    Proof. apply voting_sound. Qed.

    Lemma copyVote_spec : forall x y,
        copyVote x y = negb (witness g x) || match selfParent g x with
                                            | None => false
                                            | Some z => decide z y
                                            end.
    Proof. apply voting_sound. Qed.

    Lemma vote_spec : forall x y,
        vote x y = if copyVote x y
                   then match selfParent g x with
                        | None => UNREACHABLE
                        | Some z => vote z y
                        end
                   else if negb (copyVote x y) && is_CoinRound x y && ambiguousFrac (fractTrue x y)
                        then 1 =? middleBit (signature x)
                        else Qle_bool (1 # 2) (fractTrue x y).
    Proof. apply voting_sound. Qed.

    Global Instance Symmetric_RVoting : Symmetric RVoting.
    Proof.
      red. unfold RVoting.
      intros.
      split; intros.
      { symmetry. apply H. }
      split; [ symmetry; tauto | ].
      split; [ symmetry; tauto | ].
      split; [ symmetry; tauto | ].
      symmetry; tauto.
    Qed.

    Global Instance Transitive_RVoting : Transitive RVoting.
    Proof.
      red. unfold RVoting.
      intros.
      firstorder; etransitivity; eauto.
    Qed.

    Lemma votes_unroll:
      forall (x y : E) v,
        votes x y v =
        length (stronglySee_nodes g x
                   (fun (z : GO.G.Node) (_ : rightTrans (GO.G.IsEdge g) z x) =>
                      (diff x z =? 1) && witness g z &&
                                      Ring.bool_eq (_vote (Fix_F (fun _ : G.Node => Voting) (voting_body y) (wf_rightTrans Acyclic_g z))) v)).
    Proof.
      intros.
      unfold votes, voting.
      etransitivity.
      match goal with
      | |- context [ Fix ?WF ?P ?F ] =>
        eapply (Fix_equiv WF P F (fun _ => RVoting))
      end.
      eapply Proper_voting_body.
      reflexivity.
    Qed.

  End voting.

  Section consistent_voting.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_stronglySee_nodes
      : forall x p q, G.IsNode l x -> G.IsNode r x ->
                 consistent l r ->
                 (forall z pf pf', p z pf = q z pf') ->
                 forall y, In y (stronglySee_nodes l x p) <-> In y (stronglySee_nodes r x q).
    Proof.
      unfold stronglySee_nodes; intros.
      do 2 rewrite filter_In.
      destruct (consistent_stronglySee_with_proof _ _ Hconsistent x y); auto.
      { split; destruct 1; congruence. }
      { erewrite H2 with (pf':= y0).
        do 2 rewrite G.nodes'_ok.
        split; eauto; firstorder;
        eauto using IsNode_rightTrans'. }
    Qed.

    Lemma length_sets {T} (T_dec : forall a b : T, {a = b} + {a <> b}) : forall xs ys : list T,
        Unique xs -> Unique ys ->
        (forall x, In x xs <-> In x ys) ->
        length xs = length ys.
    Proof.
      intros.
      assert (length xs <= length ys).
      { eapply Unique_subset; eauto. red. firstorder. }
      assert (length ys <= length xs).
      { eapply Unique_subset; eauto. red. firstorder. }
      omega.
      Unshelve. all: assumption.
    Qed.
    Lemma Unique_filter {T} (T_dec : forall a b : T, {a = b} + {a <> b}) f : forall (xs : list T),
        Unique xs -> Unique (filter f xs).
    Proof.
      induction 1; simpl; auto.
      { constructor. }
      { destruct (f l0); auto. constructor; auto.
        intro. eapply filter_In in H1. tauto. }
    Qed.

    Lemma consistent_stronglySee_nodes'
    : forall x p q,
        G.IsNode l x -> G.IsNode r x ->
        consistent l r ->
        (forall z pf pf', p z pf = q z pf') ->
        length (stronglySee_nodes l x p) = length (stronglySee_nodes r x q).
    Proof.
      intros.
      unfold stronglySee_nodes.
      eapply length_sets. eapply E_dec.
      eapply Unique_filter; eauto using E_dec, G.nodes'_Unique.
      eapply Unique_filter; eauto using E_dec, G.nodes'_Unique.
      intros.
      do 2 rewrite filter_In.
      destruct (consistent_stronglySee_with_proof _ _ Hconsistent x x0); eauto.
      { firstorder; congruence. }
      { split; destruct 1; split; eauto with graph.
        eapply G.nodes'_ok; eauto with graph.
        eapply G.nodes'_ok; eauto with graph. }
    Qed.

    Lemma consistent_selfParent_edge : forall x,
        G.IsNode l x -> G.IsNode r x ->
        (exists y pfl pfr, selfParent_edge l x = Some (exist _ y pfl) /\
                      selfParent_edge r x = Some (exist _ y pfr)) \/
        (selfParent_edge l x = None /\ selfParent_edge r x = None).
    Proof.
      unfold selfParent_edge; intros.
      generalize (@IsEdge_selfParent l x).
      generalize (@IsEdge_selfParent r x).
      destruct (selfParent l x) eqn:?; destruct (selfParent r x) eqn:?; simpl; eauto.
      { left.
        rewrite (proj2 (Hconsistent x H H0)) in Heqo.
        rewrite Heqo in Heqo0.
        inversion Heqo0. subst. eauto. }
      { rewrite (proj2 (Hconsistent x H H0)) in Heqo.
        congruence. }
      { rewrite (proj2 (Hconsistent x H H0)) in Heqo.
        congruence. }
    Qed.

    Lemma consistent_diff : forall x y,
        G.IsNode l x -> G.IsNode l y ->
        G.IsNode r x -> G.IsNode r y ->
        diff l x y = diff r x y.
    Proof.
      unfold diff.
      intros.
      f_equal; apply consistent_round; eauto.
    Qed.

    Lemma consistent_voting
    : forall (y : E), G.IsNode l y -> G.IsNode r y ->
        forall x : E, G.IsNode l x -> G.IsNode r x ->
                 RVoting (voting l x y) (voting r x y).
    Proof.
      unfold voting.
      intros y Hyl Hyr x.
      lazymatch goal with
      | |- context [ @Fix ?A ?R ?WF ?P ?F ] =>
        eapply (@Fix_equiv_ind_eq A R WF P F) with (r := fun _ => RVoting);
          eauto using Proper_voting_body
      end; intros.
      { red.
        lazymatch goal with
        | |- context [ @Fix ?A ?R ?WF ?P ?F ] =>
          generalize (@Fix_equiv A R WF P F (fun _ => RVoting))
        end; intros.
        assertAt H4; [ eauto using Proper_voting_body | ].
        clear H5.
        eapply split_with; [ | intro ].
        { simpl; intros.
          etransitivity; [ clear H4 | symmetry ; eapply H4 ]; simpl.
          eapply consistent_stronglySee_nodes'; eauto with graph.
          intros.
          unfold diff.
          repeat rewrite (consistent_round l r) by eauto with graph.
          f_equal. f_equal. eapply consistent_witness; eauto with graph.
          f_equal.
          etransitivity; [ eapply H1; eauto with graph | ].
          reflexivity. }
        eapply split_with; [ | intro ].
        { simpl. simpl in H5.
          repeat rewrite H5. clear H5.
          generalize fractTrue_spec.
          unfold fractTrue, voting.
          intro X. rewrite X. reflexivity. }
        eapply split_with; [ | intro ].
        { generalize decide_spec; unfold decide, voting.
          intro X; rewrite X; clear X.
          unfold votes, voting.
          repeat rewrite <- H5.
          simpl.
          destruct (consistent_selfParent_edge_selfParent _ _ Hconsistent x0); eauto.
          simpl.
          f_equal. f_equal. f_equal. f_equal; eapply consistent_witness; auto.
          f_equal. eapply consistent_diff; eauto.
          f_equal. unfold is_CoinRound. f_equal; f_equal. eapply consistent_diff; eauto.
          destruct H7.
          f_equal.
          { eapply H1; eauto with graph. }
          f_equal. f_equal. f_equal. f_equal.
          eapply consistent_witness; eauto.
          eapply consistent_witness; eauto.
          f_equal. eapply consistent_diff; eauto.
          f_equal; unfold is_CoinRound; f_equal; f_equal; eapply consistent_diff; eauto. }
        eapply split_with; [ | intro ].
        { simpl.
          etransitivity; [ clear H4 | symmetry ; eapply H4 ]; simpl.
          erewrite consistent_witness by (eauto with graph).
          f_equal.
          destruct (consistent_selfParent_edge x0); try eassumption.
          { destruct H4 as [ ? [ ? [ ? [ ? ? ] ] ] ].
            rewrite H4; rewrite H8; clear H4 H8.
            eapply H1; eauto with graph. }
          { destruct H4.
            rewrite H4; rewrite H8; auto. } }
        { generalize vote_spec; unfold vote, voting.
          intro X. rewrite X; clear X.
          unfold copyVote, fractTrue, voting.
          rewrite <- H8; clear H8.
          rewrite <- H6; clear H6.
          eapply if_equal; eauto.
          2: eapply if_equal; eauto.
          { destruct (consistent_selfParent_edge x0); try eassumption.
            { destruct H6 as [ ? [ ? [ ? [ ? ? ] ] ] ].
              rewrite H6; clear H6.
              destruct (selfParent_edge_selfParent r x0); try congruence.
              destruct H6. inversion H8; subst.
              eapply H1; eauto with graph. constructor; eauto. }
            { destruct H6.
              rewrite H6.
              destruct (selfParent_edge_selfParent r x0); try congruence. } }
          { f_equal. f_equal.
            unfold is_CoinRound; f_equal; f_equal.
            rewrite consistent_diff; eauto. } } }
      { do 3 red; intros.
        symmetry. etransitivity; eauto.
        symmetry; eauto. }
    Qed.

    Lemma consistent_votes : forall x y v,
        G.IsNode l x -> G.IsNode r x ->
        G.IsNode l y -> G.IsNode r y ->
        votes l x y v = votes r x y v.
    Proof. intros. eapply consistent_voting; eauto. Qed.

    Lemma consistent_fractTrue : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        G.IsNode l y -> G.IsNode r y ->
        fractTrue l x y = fractTrue r x y.
    Proof. intros. eapply consistent_voting; eauto. Qed.

    Lemma consistent_decides : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        G.IsNode l y -> G.IsNode r y ->
        decide l x y = decide r x y.
    Proof. intros. eapply consistent_voting; eauto. Qed.

    Lemma consistent_vote : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        G.IsNode l y -> G.IsNode r y ->
        vote l x y = vote r x y.
    Proof. intros. eapply consistent_voting; eauto. Qed.

  End consistent_voting.


  (** * Famous, uniqueFamous, and roundsDecided *)
  Section famous.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    Definition Famous (x : E) : Prop :=
      exists y, G.IsNode g y /\ decide g y x = true /\ vote g y x = true.

    Definition is_famous (x : E) : bool :=
      exNode g (fun y => decide g y x && vote g y x).

    Theorem is_famous_ok : forall x,
        Famous x <-> is_famous x = true.
    Proof.
      unfold Famous, is_famous.
      intros.
      rewrite exNode_ok.
      eapply ex_iff.
      intros. rewrite andb_true_iff. reflexivity.
    Qed.

    Definition is_unique_node (p : E -> bool) : bool :=
      Nat.eqb 1 (length (nodeSubset g p)).

    Definition UniqueFamous (x : E) : Prop :=
        Famous x
      /\ (forall y, G.IsNode g y ->
              Famous y ->
              round g x = round g y ->
              creator x = creator y ->
              x = y).


    Definition is_uniqueFamous (x : E) : bool :=
         is_famous x
      && allNode g (fun y =>
                      implb (is_famous y)
                            (implb (Nat.eqb (round g x) (round g y))
                                   (implb (eqb_creator (creator x) (creator y))
                                          (if E_dec x y then true else false)))).


    Theorem is_uniqueFamous_ok : forall x,
        UniqueFamous x <-> is_uniqueFamous x = true.
    Proof.
      unfold UniqueFamous, is_uniqueFamous.
      intros.
      rewrite andb_true_iff.
      rewrite <- is_famous_ok.
      rewrite allNode_ok.
      apply and_iff_compat_l.
      eapply all_iff; intros.
      repeat rewrite implb_impl.
      rewrite <- is_famous_ok.
      rewrite eqb_creator_sound.
      rewrite Nat.eqb_eq.
      destruct (E_dec x x0); simpl; split; try tauto.
      intros.
      assert (false = true); [ | congruence ].
      apply H; eauto.
    Qed.

    Definition RoundsDecided (r : nat) : Prop :=
      forall x, G.IsNode g x -> round g x <= r -> Witness g x ->
           exists y, G.IsNode g y /\ decide g y x = true.

    Definition roundsDecided (r : nat) : bool :=
      allNode g (fun x =>
                   implb (Nat.leb (round g x) r && witness g x)
                         (exNode g (fun y => decide g y x))).

    Theorem roundsDecided_ok : forall r,
        RoundsDecided r <-> roundsDecided r = true.
    Proof.
      unfold RoundsDecided, roundsDecided. intros.
      rewrite allNode_ok.
      apply all_iff; intro.
      repeat rewrite implb_impl.
      rewrite andb_true_iff.
      rewrite witness_ok.
      rewrite Nat.leb_le.
      rewrite exNode_ok.
      tauto.
    Qed.

  End famous.

  Section round_properties.
    Variables A B : G.Graph.
    Context {Acyclic_A : G.Acyclic A}.
    Context {Acyclic_B : G.Acyclic B}.
    Hypothesis Hconsistent : consistent A B.

    Lemma round_monotonic_IsEdge
    : forall x y,
        G.IsEdge A x y ->
        round A x <= round A y.
    Proof using A Acyclic_A.
      clear.
      intros.
      rewrite round_spec with (x:=y).
      generalize (IsEdge_parentRound _ _ _ H).
      omega.
    Qed.

    Lemma round_monotonic_selfParent
    : forall x y,
        Some y = selfParent A x ->
        round A y <= round A x.
    Proof using A Acyclic_A.
      clear. intros.
      eapply round_monotonic_IsEdge; eauto with graph.
    Qed.

    Lemma round_monotonic
    : forall x y,
        Ancestor A x y ->
        round A y <= round A x.
    Proof.
      induction 1.
      { omega. }
      { etransitivity; eauto using round_monotonic_IsEdge. }
    Qed.

    Lemma single_source_of_vote
    : forall a b,
        round A a = round A b ->
        selfAncestor A a b ->
        forall x, vote A a x = vote A b x.
    Proof.
      induction 2.
      { auto. }
      { intros.
        assertAt IHselfAncestor.
        { eapply round_monotonic_selfParent in H0.
          eapply Ancestor_selfAncestor in H1.
          eapply round_monotonic in H1.
          omega. }
        rewrite <- IHselfAncestor; clear IHselfAncestor.
        rewrite vote_spec.
        cutrewrite (copyVote A a x = true).
        { destruct H0; reflexivity. }
        rewrite copyVote_spec.
        apply orb_true_iff. left.
        unfold witness. destruct H0.
        destruct (Nat.ltb_spec (round A b) (round A a)); auto.
        omega. }
    Qed.

    Lemma decidable_selfAncestor:
      forall x y : E, Decidable.decidable (selfAncestor A x y).
    Proof using Acyclic_A.
      clear - Acyclic_A.
      intros x y.
      red.
      rewrite <- is_selfAncestor_ok.
      destruct (is_selfAncestor A x y); auto.
      Unshelve. auto.
    Qed.
    Lemma decidable_creator_eq
      : forall a b : Creator, Decidable.decidable (a = b).
    Proof using.
      clear.
      red. intros.
      destruct (Creator_dec a b); auto.
    Qed.
    Lemma not_Forked : forall x y,
        ~Forked A x y ->
        creator x <> creator y \/ selfAncestor A x y \/ selfAncestor A y x.
    Proof using A Acyclic_A.
      clear - Acyclic_A.
      unfold Forked.
      intros.
      apply Decidable.not_and in H.
      { destruct H; [ left | right ] ; auto.
        eapply Decidable.not_not; auto.
        eapply Decidable.dec_or; eapply decidable_selfAncestor. }
      { apply decidable_creator_eq. }
    Qed.

  End round_properties.

  Section decides_by.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    Hint Resolve Proper_voting_body : Proper_Fix.

    Lemma selfParent_edge_selfParent_then
      : forall x y, selfParent_edge g x = Some y ->
               selfParent g x = Some (proj1_sig y).
    Proof. intros.
           destruct (selfParent_edge_selfParent g x); try congruence.
           destruct H0. inversion H. subst. reflexivity.
    Qed.

  End decides_by.

End Voting.
