(* Copyright Swirlds Inc 2018 *)
(** * Definitions of Rounds

  This file includes definitions for

  - [round]

  It also contains a proof that the algorithm assigns the same round number to
  any event shared by two consistent hashgraphs.
 *)
Require Import Coq.Arith.Arith.
Require Import Coq.Lists.List.
Require Import Coq.Bool.Bool.
Require Import Coq.omega.Omega.
Require Import Coq.Classes.Morphisms.

Require Import ExtLib.Relations.TransitiveClosure.
Require Import ExtLib.Recur.Relation.
Require Import ExtLib.Recur.Facts.

Require Import Swirlds.Unique.
Require Import Swirlds.Tactics.
Require Import Swirlds.FixLib.
Require Import Swirlds.ToBool.
Require Import Swirlds.Pigeon.
Require Import Swirlds.Graph.
Require Import Swirlds.Util.
Require Import Swirlds.Math.
Require Import Swirlds.Lemmas.
Require Import Swirlds.HashGraph.
Require Import Swirlds.Definitions.
Require Import Swirlds.See.

Module Rounds (HG : HashGraph).
  Import HG.GO.
  Import HG.
  Module SEE := See HG.
  Import SEE.DEFS.
  Import SEE.

  Existing Class G.Acyclic.

(** * Definitions of Rounds

  A round captures a temporal segment of the hashgraph. An event gets a higher
  round once it can strongly see an event from at least 2n/3 creators in the
  previous round.

  In the definition in the technical report, an event also bumps its round when
  it has a parent with a higher round number.
 *)
  Section round.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    (* Describing rounds is a little bit more complex because the definition
     * is defined by *well-founded* induction on the parent relation in the
     * hashgraph.
     *
     * Coq's `Fix` definition allows us to perform well-founded induction,
     * but it is a bit more verbose than "simple" definitions.
     *
     * We follow a three part technique for writing the definitions.
     * 1. We define `_body` functions that accept the recursive `round` function
     * 2. We build the fixpoint using `Fix`
     * 3. We define "unfolding" proofs which state that the recursive
     *    function is equal to its 1-step unfolding.
     *)
    Definition parentRound_body (x : E) (round : _) : nat :=
      maximum (1 :: @map {n' : E | G.IsEdge g n' x} _
                 (fun '(exist _ y pf) => round y (RTFin pf))
                 (G.edgesTo g x)).

    Lemma Proper_parentRound_body
    : forall (x : E) (f f' : forall y : E, rightTrans (G.IsEdge g) y x -> nat),
        (forall (y : E) (p : rightTrans (G.IsEdge g) y x), f y p = f' y p) ->
        parentRound_body x f = parentRound_body x f'.
    Proof.
      unfold parentRound_body.
      intros. f_equal. f_equal.
      eapply map_ext. destruct a. auto.
    Qed.

    Hint Resolve Proper_parentRound_body : Proper_Fix.

    Definition roundInc_body (pR : nat) (x : E) (round : _) : bool :=
      manyCreators
        (stronglySee_nodes g x
                           (fun z pf =>
                              to_bool Nat.eq_dec pR (round z pf))).

    Lemma Proper_roundInc_body
    : forall r r',
        r = r' ->
        forall (x : E) (f f' : forall y : E, rightTrans (G.IsEdge g) y x -> nat),
        (forall (y : E) (p : rightTrans (G.IsEdge g) y x), f y p = f' y p) ->
        roundInc_body r x f = roundInc_body r' x f'.
    Proof.
      unfold roundInc_body.
      intros; f_equal.
      eapply stronglySee_nodes_ext.
      intros.
      f_equal; eauto.
    Qed.

    Hint Resolve Proper_roundInc_body : Proper_Fix.

    Definition round_body (x : E) (round : forall y, rightTrans (G.IsEdge g) y x -> nat) : nat :=
      let pR := parentRound_body x round in
      pR + if roundInc_body pR x round
           then 1
           else 0.

    Lemma Proper_round_body
    : forall (x : E) (f f' : forall y : E, rightTrans (G.IsEdge g) y x -> nat),
        (forall (y : E) (p : rightTrans (G.IsEdge g) y x), f y p = f' y p) ->
        round_body x f = round_body x f'.
    Proof.
      unfold round_body.
      intros.
      f_equal; eauto using Proper_roundInc_body, if_equal, Proper_parentRound_body.
    Qed.

    Hint Resolve Proper_round_body : Proper_Fix.

    Definition round : E -> nat :=
      @Fix E _ (wf_rightTrans Acyclic_g) (fun _ => nat) round_body.

    Definition parentRound (x : E) : nat :=
      Eval unfold parentRound_body in parentRound_body x (fun y _ => round y).

    Definition roundInc (x : E) : bool :=
      Eval unfold roundInc_body in roundInc_body (parentRound x) x (fun y _ => round y).

    Theorem round_spec
    : forall x, round x = parentRound x + if roundInc x then 1 else 0.
    Proof.
      intros. unfold round at 1.
      rewrite Fix_eq; eauto using Proper_round_body.
    Qed.

    (* Auxiliary lemmas *)


    Hint Resolve Proper_round_body : Proper_Fix.

    Lemma round_gt_0 : forall x, round x > 0.
    Proof.
      unfold round. intros.
      wfinduction; intros.
      unfold round_body, parentRound_body.
      match goal with
      | |- ?X + _ > _ => assert (X > 0); [ | omega ]
      end.
      simpl.
      match goal with
      | |- context [ match ?X with _ => _ end ] => destruct X
      end; omega.
    Qed.

    Lemma parentRound_get : forall x,
          (parentRound x = 1 /\ G.edgesTo' g x = nil)
        \/ exists y, G.IsEdge g y x /\ parentRound x = round y.
    Proof.
      unfold parentRound.
      simpl.
      intros.
      destruct (G.edgesTo g x) eqn:?.
      { left. simpl. split; auto.
        destruct (G.edgesTo' g x) eqn:?; auto.
        exfalso.
        assert (G.IsEdge g n x).
        { eapply G.edgesTo'_sound. rewrite Heqs0. simpl; firstorder. }
        { eapply G.edgesTo_complete in H.
          destruct H. rewrite Heqs in H.
          apply H. } }
      { right.
        generalize (maximum_non_empty (map (fun '(exist _ y0 _) => round y0) (s :: s0))).
        intros.
        assertAt H; [ simpl; congruence | ].
        rewrite in_map_iff in H.
        shatter H.
        destruct x0.
        generalize dependent (s :: s0); intros.
        exists x0. split; auto.
        rewrite H.
        generalize (round_gt_0 x0).
        match goal with
        | |- _ -> match ?X with _ => _ end = ?Y =>
          change Y with X in *; destruct X
        end; auto.
        intros. exfalso. omega. }
    Qed.

    (** MOVE TO Definitions.v *)
    Lemma manyCreators_exists : forall xs,
        manyCreators xs = true ->
        exists x, In x xs.
    Proof.
      unfold manyCreators, hasEnough.
      intros.
      apply Nat.ltb_lt in H.
      unfold uniqueCreators in *.
      generalize (uniqueBy_subset creator Creator_dec xs).
      destruct (uniqueBy creator Creator_dec xs).
      { simpl in *. exfalso. omega. }
      { intros. exists e. apply H0. firstorder. }
    Qed.


    Lemma round_ind
    : forall (P : E -> nat -> Prop)
        (Hroot : forall x, G.edgesTo' g x = nil -> selfParent g x = None -> P x 1)
        (Hstep : forall x y,
            roundInc x = true -> G.IsEdge g y x -> P y (parentRound x) -> P x (S (parentRound x)))
        (Hcopy : forall x y,
            roundInc x = false -> G.IsEdge g y x -> P y (parentRound x) -> P x (parentRound x)),
        forall x, P x (round x).
    Proof.
      unfold round.
      intros.
      wfinduction. clear x.
      intros.
      unfold round_body.
      destruct (roundInc_body (parentRound_body x (Frec x)) x (Frec x)) eqn:?.
      { subst.
        match goal with
        | |- P _ (?X + _) => change X with (parentRound x) in *
        end.
        destruct (parentRound_get x).
        { exfalso.
          clear - H0 Heqb.
          unfold roundInc_body in Heqb.
          eapply manyCreators_exists in Heqb. destruct Heqb.
          eapply stronglySee_nodes_In in H.
          shatter H.
          destruct H0.
          clear - x1 H1.
          destruct x1.
          { eapply G.edgesTo'_complete in H.
            rewrite H1 in H. apply H. }
          { eapply G.edgesTo'_complete in H.
            rewrite H1 in H. apply H. } }
        { shatter H0.
          rewrite plus_comm.
          eapply Hstep; eauto.
          specialize (H _ (RTFin H0)).
          rewrite H2. apply H. } }
      { subst.
        match goal with
        | |- P _ (?X + _) => change X with (parentRound x) in *
        end.
        destruct (parentRound_get x).
        { destruct H0.
          rewrite H0. simpl.
          eapply Hroot; eauto.
          destruct (selfParent g x) eqn:?; try congruence.
          symmetry in Heqo.
          eapply IsEdge_selfParent in Heqo.
          eapply G.edgesTo'_complete in Heqo.
          rewrite H1 in Heqo. exfalso. apply Heqo. }
        { destruct H0. rewrite plus_comm.
          simpl.
          destruct H0. rewrite H1.
          rewrite <- H1.
          eapply Hcopy.
          3: rewrite H1; eapply (H _ (RTFin H0)).
          apply Heqb. eassumption. } }
    Qed.

    Lemma roundInc_root : forall x,
        G.edgesTo g x = nil ->
        roundInc x = false.
    Proof.
      unfold roundInc. intros.
      unfold manyCreators. unfold hasEnough.
      destruct (stronglySee_nodes g x
           (fun (z : G.Node) (_ : rightTrans (G.IsEdge g) z x) =>
            to_bool Nat.eq_dec (parentRound x) (round z))) eqn:?.
      { simpl.
        destruct (Nat.ltb_spec two_third 0); auto.
        generalize two_third_gt_0. omega. }
      { assert (In e (stronglySee_nodes g x
           (fun (z : G.Node) (_ : rightTrans (G.IsEdge g) z x) =>
            to_bool Nat.eq_dec (parentRound x) (round z)))).
        { rewrite Heql. left; auto. }
        { eapply stronglySee_nodes_In in H0.
          destruct H0.
          exfalso; clear - x0 H.
          eapply GO.edgesTo_nil in H.
          assert (exists y, In y (G.edgesTo' g x)).
          { destruct x0; eexists; eapply G.edgesTo'_complete; eauto. }
          rewrite H in H0. destruct H0. apply H0. } }
    Qed.


    Lemma IsEdge_parentRound : forall (x y : E),
        G.IsEdge g y x ->
        round y <= parentRound x.
    Proof.
      intros.
      unfold parentRound.
      eapply maximum_In_le.
      right.
      apply in_map_iff.
      eapply G.edgesTo_complete in H.
      destruct H.
      exists (exist _ y x0).
      split; auto.
    Qed.

    Lemma round_monotonic_IsEdge
    : forall x y,
        G.IsEdge g x y ->
        round x <= round y.
    Proof.
      intros.
      rewrite round_spec with (x:=y).
      generalize (IsEdge_parentRound _ _ H).
      omega.
    Qed.

    Lemma round_monotonic_selfParent
    : forall x y,
        Some y = selfParent g x ->
        round y <= round x.
    Proof.
      intros.
      eapply round_monotonic_IsEdge; eauto with graph.
    Qed.

    Lemma round_monotonic
    : forall x y,
        Ancestor g x y ->
        round y <= round x.
    Proof.
      induction 1.
      { omega. }
      { etransitivity; eauto using round_monotonic_IsEdge. }
    Qed.

  End round.

  Section consistent_round.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_parentRound_body
    : forall x f f',
        (forall y pfl pfr, G.IsNode l y -> G.IsNode r y -> f y pfl = f' y pfr) ->
        G.IsNode l x -> G.IsNode r x ->
        parentRound_body l x f = parentRound_body r x f'.
    Proof.
      unfold parentRound_body; intros.
      eapply maximum_In_iff.
      intros.
      simpl.
      eapply or_iff_compat_l.
      do 2 rewrite in_map_iff.
      split; destruct 1 as [ [ Z ? ] H2 ]; shatter H2.
      { destruct (G.edgesTo_complete _ _ _ (IsEdge_consistent _ _ Hconsistent _ _ H1 i)).
        exists (exist _ Z x1).
        split; auto. subst.
        symmetry. eapply H; eauto with graph. }
      { symmetry in Hconsistent.
        destruct (G.edgesTo_complete _ _ _ (IsEdge_consistent _ _ Hconsistent _ _ H0 i)).
        exists (exist _ Z x1).
        split; auto. subst.
        eapply H; eauto with graph. }
    Qed.


    Lemma consistent_roundInc_body
    : forall x f f',
        (forall y pfl pfr, G.IsNode l y -> G.IsNode r y -> f y pfl = f' y pfr) ->
        forall n m, n = m ->
        G.IsNode l x -> G.IsNode r x ->
        roundInc_body l n x f = roundInc_body r m x f'.
    Proof.
      unfold roundInc_body; intros.
      subst.
      eapply manyCreators_In; intros.
      unfold stronglySee_nodes.
      do 2 rewrite filter_In.
      destruct (consistent_stronglySee_with_proof _ _ Hconsistent x x0); eauto.
      firstorder.
      cutrewrite (to_bool Nat.eq_dec m (f x0 x1) = to_bool Nat.eq_dec m (f' x0 y)).
      { eapply and_iff_compat_r.
        do 2 rewrite G.nodes'_ok.
        split; intros; eauto using IsNode_rightTrans', IsNode_rightTrans. }
      { f_equal. eapply H; eauto using IsNode_rightTrans', IsNode_rightTrans. }
    Qed.

    Lemma consistent_round_body
    : forall x f f',
        (forall y pfl pfr, G.IsNode l y -> G.IsNode r y -> f y pfl = f' y pfr) ->
        G.IsNode l x -> G.IsNode r x ->
        round_body l x f = round_body r x f'.
    Proof.
      unfold round_body. intros.
      f_equal;
      eauto using if_equal, consistent_parentRound_body, consistent_roundInc_body.
    Qed.

    (* Lemma 5.13. If hashgraphs A and B are consistent and both contain event x,
     * then both will assign the same round created number to x.
     *)
    Lemma consistent_round
    : forall x : E,
        G.IsNode l x ->
        G.IsNode r x ->
        round l x = round r x.
    Proof.
      unfold round.
      intro x.
      lazymatch goal with
      | |- context [ @Fix ?A ?R ?WF ?P ?F ] =>
        eapply (@Util.Fix_ind A R WF P F)
      end; [ | eauto using Proper_round_body ].
      intros.
      eapply Fix_eq_body; intros; eauto using Proper_round_body.
      unfold round_body.
      subst.
      f_equal.
      { eapply consistent_parentRound_body; eauto. }
      eapply if_equal; auto.
      eapply consistent_roundInc_body; eauto.
      eapply consistent_parentRound_body; eauto.
    Qed.

  End consistent_round.

  (** * Witnesses

   An event "witnesses the start of a round" if its round is greater than the
   round of its self parent.
   *)
  Section witness.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    Definition Witness (x : E) : Prop :=
      match selfParent g x with
      | None => True
      | Some parent => round g x > round g parent
      end.

    Definition witness (x : E) : bool :=
      match selfParent g x with
      | None => true
      | Some parent => Nat.ltb (round g parent) (round g x)
      end.

    Theorem witness_ok : forall x,
        witness x = true <-> Witness x.
    Proof.
      unfold witness, Witness; intros.
      destruct (selfParent g x); try tauto.
      rewrite Nat.ltb_lt. tauto.
    Qed.

  End witness.

  Hint Resolve Proper_parentRound_body : Proper_Fix.
  Hint Resolve Proper_roundInc_body : Proper_Fix.

  (* Consistent Witness *)
  Section consistent_witness.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_Witness : forall x,
        G.IsNode l x -> G.IsNode r x ->
        Witness l x <-> Witness r x.
    Proof.
      unfold Witness; intros.
      generalize (@IsEdge_selfParent l x).
      generalize (@IsEdge_selfParent r x).
      erewrite (consistent_selfParent l r); eauto.
      destruct (selfParent r x); try tauto.
      intros.
      specialize (H1 _ eq_refl).
      specialize (H2 _ eq_refl).
      erewrite (consistent_round l r) by eauto.
      erewrite (consistent_round l r) by eauto with graph.
      reflexivity.
    Qed.

    Lemma consistent_witness : forall x,
        G.IsNode l x -> G.IsNode r x ->
        witness l x = witness r x.
    Proof.
      intros.
      eapply by_soundness.
      eapply witness_ok.
      rewrite witness_ok.
      symmetry. eapply consistent_Witness; eauto.
    Qed.
  End consistent_witness.

  (* * Lemmas about rounds and witnesses *)
  Section round_and_witness_lemmas.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    Existing Instance Acyclic_g.

    Lemma round_ancestor_Witness : forall x,
        G.IsNode g x ->
        exists y, round g y = round g x /\
             Ancestor g x y /\
             Witness g y.
    Proof.
      refine (@round_ind g _
                (fun x r => G.IsNode g x -> exists y : E, round g y = r /\ Ancestor g x y /\ Witness g y) _ _ _).
      { intros. exists x.
        split; [ | split; [ constructor | ] ].
        2: unfold Witness; rewrite H0; auto.
        rewrite round_spec. unfold parentRound.
        erewrite (proj1 (edgesTo_nil g x)); auto.
        rewrite roundInc_root. 2: eapply edgesTo_nil; auto.
        reflexivity. }
      { intros.
        destruct H1; eauto with graph.
        shatter H1. subst.
        exists x.
        apply split_with.
        { rewrite round_spec. rewrite H.
          omega. }
        split; [ solve [ constructor ] | ].
        red.
        rewrite H4.
        destruct (selfParent g x) eqn:?; auto.
        symmetry in Heqo. eapply IsEdge_selfParent in Heqo.
        eapply IsEdge_parentRound with (Acyclic_g :=Acyclic_g) in Heqo.
        omega. }
      { intros.
        destruct H1; eauto with graph.
        exists x0. shatter H1.
        split; auto. split; auto.
        econstructor. eassumption. eauto. }
    Qed.

  End round_and_witness_lemmas.

End Rounds.
