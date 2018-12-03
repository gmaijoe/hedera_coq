(* Copyright Swirlds Inc. 2018 *)
(** * Definitions of Seeing and Strongly Seeing

  This file includes definitions for

  - [See]
  - [StronglySee]

  It also contains a proof of the strongly seeing lemma (5.12).
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

Module See (HG : HashGraph).
  Module DEFS := Definitions HG.
  Import HG.G.
  Import HG.GO.
  Import HG.
  Import DEFS.

  Existing Class G.Acyclic.

  (** * Seeing

   An event `a` sees an event `b` if `a` is an ancestor of `b` and `a` trusts
   the creator of `b`.

   Note a node can never see a fork because if the fork is visible, the creator
   of the fork is not trusted. See the definition of `Seeing_double`.
   *)
  Section see.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    (* `x` sees `y` if
     * 1. `y` is an ancestor of `x` (`y` is earlier than `x`)
     * 2. forall a b, not (creator y = creator a = creator b /\
     *                     ancestor x a /\ ancestor x b /\
     *                     not (selfAncestor a b) /\ not (selfAncestor b a))
     * --
     * The intuition is that I do not trust anything that a creator says
     * if I see a fork by that creator.
     *)
   Definition See (x y : E) : Prop :=
      Ancestor g x y /\ Trusts g x (creator y).

    Definition see (x y : E) : bool :=
         is_Ancestor g x y
      && trusts g x (creator y).

    Theorem see_ok : forall x y, see x y = true <-> See x y.
    Proof.
      unfold see, See.
      intros.
      rewrite andb_true_iff. rewrite is_Ancestor_ok.
      rewrite trusts_ok. tauto.
    Defined.

    (* Auxiliary lemmas *)

    Definition See_Ancestor : forall a b, See a b -> Ancestor g a b.
    Proof using. clear. destruct 1; tauto. Defined.

    Coercion See_Ancestor : See >-> Ancestor.


    Lemma IsNode_See : forall x y,
        See x y ->
        G.IsNode g y ->
        G.IsNode g x.
    Proof.
      intros. eapply IsNode_Ancestor'; eauto. apply H.
    Defined.

    Lemma IsNode_See' : forall x y,
        See x y ->
        G.IsNode g x ->
        G.IsNode g y.
    Proof.
      intros. eapply IsNode_Ancestor; eauto. apply H.
    Defined.


    (* A node does not "see" any node created by a creator that the node sees a
     * fork of.
     *)
    Lemma Seeing_double : forall a x y,
        Forked g x y ->
        See a x ->
        Ancestor g a y ->
        False.
    Proof.
      unfold See, Trusts; intros.
      destruct H0.
      apply H2; clear H2.
      exists x. exists y.
      split; auto. split; auto.
      destruct H; auto.
    Defined.

  End see.

  Section consistent_see.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.


    Lemma consistent_See : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        See l x y -> See r x y.
    Proof.
      unfold See. intros.
      destruct H1; split.
      eapply consistent_Ancestor; eauto with graph.
      eapply consistent_Trusts; eauto with graph.
    Qed.
  End consistent_see.


  Section viewOf_see.
    Variable g l : G.Graph.
    Context {Acyclic_g : G.Acyclic g} {Acyclic_l : G.Acyclic l}.
    Hypothesis HviewOf : viewOf g l.

    Lemma viewOf_See : forall n n'
        (isNode: G.IsNode l n),
        See l n n' -> See g n n'.
    Proof.
      clear - HviewOf.
      unfold See; intros.
      destruct H; split; eauto using viewOf_Ancestor.
      eapply viewOf_Trusts; eauto.
    Defined.

    Lemma viewOf_see
    :  forall n n' (isNode: G.IsNode l n),
        see l n n' = true ->
        see g n n' = true.
    Proof.
      intros.
      eapply see_ok.
      eapply viewOf_See; eauto.
      eapply see_ok; auto.
    Defined.
  End viewOf_see.

  (** * Strongly Seeing

   Strongly seeing is the core concept that the algorithm uses to deriving
   something. It relies on the fact that most creators are honest.

   If an event sees more than 2n/3 creators that each see the same event, then
   the original event strongly sees the other event.
   *)
  Section strongly_seeing.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    Definition StronglySee (x y : E) : Prop :=
      See g x y
      /\ exists s, ManyCreators s
          /\ Forall (fun z => G.IsNode g z /\ See g x z /\ See g z y) s.

    Definition stronglySee (x y : E) : bool :=
      see g x y && manyCreators (nodeSubset g (fun z => see g x z && see g z y)).


    Theorem stronglySee_ok : forall x y,
        stronglySee x y = true <-> StronglySee x y.
    Proof.
      unfold stronglySee, StronglySee. intros.
      rewrite andb_true_iff.
      rewrite see_ok.
      eapply and_iff_compat_l.
      rewrite manyCreators_ok.
      eapply ex_iff; intros.
      unfold ManyCreators, manyCreators.
      rewrite and_assoc.
      apply and_iff_compat_l.
      rewrite and_comm.
      apply and_iff_compat_l.
      rewrite Forall_forall.
      unfold subset.
      setoid_rewrite nodeSubset_subset_iff.
      setoid_rewrite andb_true_iff.
      repeat setoid_rewrite see_ok.
      reflexivity.
    Qed.

    (* Auxiliary definitions *)


    Lemma Ancestor_rightTrans_refl : forall x y,
        Ancestor g x y ->
        (x = y \/ rightTrans (G.IsEdge g) y x).
    Proof.
      induction 1; auto.
      right. destruct IHAncestor.
      { subst. constructor; auto. }
      { econstructor 2. 2: apply H. assumption. }
    Qed.

    Lemma Ancestor_sym_eq : forall x y, Ancestor g x y -> Ancestor g y x -> x = y.
    Proof.
      intros.
      eapply Ancestor_rightTrans_refl in H.
      eapply Ancestor_rightTrans_refl in H0.
      destruct H; auto.
      destruct H0; auto.
      generalize (wf_anti_sym _ _ (wf_rightTrans Acyclic_g)).
      intro.
      red in H1. red in H1. red in H1.
      exfalso.
      eapply H1.
      apply makeTrans_rightTrans. etransitivity; eapply makeTrans_rightTrans; eauto.
    Qed.

    Theorem StronglySee_not_refl : forall x y, StronglySee x y -> x <> y.
    Proof.
      unfold StronglySee. intros.
      intro. subst.
      destruct H.
      destruct H0. destruct H0. destruct H0.
      assert (Forall (fun z => z = y) x).
      { revert H1; eapply Forall_impl.
        intros. destruct H1 as [ ? [ ? ? ] ].
        destruct H3. destruct H4.
        eauto using Ancestor_sym_eq. }
      clear - H3 H2 H0.
      destruct H3.
      { simpl in *. omega. }
      subst.
      destruct H3.
      { simpl in *.
        generalize two_third_gt_0. omega. }
      { subst. clear - H0.
        simpl in *.
        inversion H0; subst.
        apply H2. left; auto. }
    Qed.

    Lemma StronglySee_PAncestor : forall x y,
        StronglySee x y ->
        rightTrans (G.IsEdge g) y x.
    Proof.
      intros.
      generalize (StronglySee_not_refl _ _ H); intro.
      destruct H. destruct H.
      apply Ancestor_rightTrans_refl in H. destruct H; auto.
      exfalso; tauto.
    Qed.

    Lemma IsNode_StronglySee
    : forall x y, StronglySee x y ->
             G.IsNode g x.
    Proof.
      intros.
      generalize (StronglySee_not_refl _ _ H).
      intros.
      destruct H. destruct H.
      eapply IsNode_Ancestor_neq in H; tauto.
    Qed.

    Lemma IsNode_StronglySee'
    : forall x y, StronglySee x y ->
             G.IsNode g y.
    Proof.
      intros.
      generalize (StronglySee_not_refl _ _ H).
      intros.
      destruct H. destruct H.
      eapply IsNode_Ancestor_neq in H; tauto.
    Qed.


    Definition stronglySee_with_proof (x y : E)
    : option (rightTrans (G.IsEdge g) y x).
      destruct (stronglySee x y) eqn:?.
      { apply stronglySee_ok in Heqb. apply Some.
        apply StronglySee_PAncestor; auto. }
      { exact None. }
    Defined.

    Theorem stronglySee_with_proof_ok : forall x y pf,
        stronglySee_with_proof x y = Some pf ->
        StronglySee x y.
    Proof.
      unfold stronglySee_with_proof. do 3 intro.
      generalize (@eq_refl _ (stronglySee x y)).
      generalize (stronglySee_ok x y).
      generalize (StronglySee_PAncestor x y).
      destruct (stronglySee x y); intros; try congruence.
      eapply i. tauto.
    Qed.

    Definition stronglySee_nodes
               (x : E) (f : forall y, rightTrans (G.IsEdge g) y x -> bool)
    : list E :=
      filter (fun y => match stronglySee_with_proof x y with
                    | None => false
                    | Some pf => f _ pf
                    end) (G.nodes' g).

    Lemma stronglySee_nodes_ext : forall x (p q : forall y, _ -> bool),
        (forall y pf, p y pf = q y pf) ->
        stronglySee_nodes x p = stronglySee_nodes x q.
    Proof.
      unfold stronglySee_nodes. intros.
      induction (G.nodes' g); simpl; auto.
      { rewrite IHs; clear IHs.
        destruct (stronglySee_with_proof x a); auto.
        rewrite H. reflexivity. }
    Qed.

    Lemma stronglySee_nodes_In : forall x y p,
        In y (stronglySee_nodes x p) ->
        exists pf, StronglySee x y /\
              p y pf = true.
    Proof.
      unfold stronglySee_nodes; simpl; intros.
      eapply filter_In in H.
      destruct H.
      destruct (stronglySee_with_proof x y) eqn:?; try congruence.
      eexists; split; eauto.
      eauto using stronglySee_with_proof_ok.
    Qed.

    Lemma stronglySee_nodes_nodeSubset:
      forall (x : E) p q,
        (forall z, q z = true -> StronglySee x z) ->
        (forall z pf, StronglySee x z -> p z pf = q z) ->
        stronglySee_nodes x p =
        nodeSubset g q.
    Proof.
      unfold stronglySee_nodes, nodeSubset.
      intros.
      induction (G.nodes' g); simpl; auto.
      { rewrite IHs; clear IHs.
        unfold stronglySee_with_proof.
        generalize (eq_refl (stronglySee x a)).
        generalize (stronglySee_ok x a).
        generalize (StronglySee_PAncestor x a).
        destruct (stronglySee x a).
        { intros.
          rewrite H0; eauto. tauto. }
        { intros.
          specialize (H a).
          destruct (q a); auto.
          assert (false = true). apply i. apply H. tauto.
          congruence. } }
    Qed.

  End strongly_seeing.

  Hint Resolve IsNode_See IsNode_See' IsNode_StronglySee IsNode_StronglySee' : graph.

  Section consistent_strongly_see.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_StronglySee : forall x y,
        G.IsNode r x ->
        StronglySee l x y -> StronglySee r x y.
    Proof.
      unfold StronglySee.
      intros.
      assert (G.IsNode l x) by eauto with graph.
      destruct H0.
      split; [ eapply consistent_See; eauto | ].
      shatter H2.
      exists x0.
      split; eauto.
      revert H4; eapply Forall_impl; intros.
      shatter H3.
      assert (G.IsNode r a).
      { eapply IsNode_Ancestor.
        2: eapply consistent_Ancestor. 2: eassumption.
        4: eapply (proj1 H3).
        all: eauto. }
      split; eauto.
      split; eapply consistent_See; eauto.
    Qed.
  End consistent_strongly_see.

  Section consistent_strongly_see'.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_stronglySee : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        stronglySee l x y = stronglySee r x y.
    Proof.
      intros.
      eapply by_soundness.
      eapply stronglySee_ok.
      rewrite stronglySee_ok.
      split; eapply consistent_StronglySee; eauto.
      symmetry; eauto.
    Qed.

    Lemma consistent_stronglySee_with_proof
      : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        hRoption (fun _ _ => True)
                 (stronglySee_with_proof l x y)
                 (stronglySee_with_proof r x y).
    Proof.
      intros.
      unfold stronglySee_with_proof.
      generalize (eq_refl (stronglySee l x y)).
      generalize (eq_refl (stronglySee r x y)).
      generalize (stronglySee_ok l x y).
      generalize (stronglySee_ok r x y).
      generalize (StronglySee_PAncestor l x y).
      generalize (StronglySee_PAncestor r x y).
      rewrite (@consistent_stronglySee _ _ H H0).
      destruct (stronglySee r x y).
      { constructor. tauto. }
      { constructor. }
    Qed.

  End consistent_strongly_see'.


  (** * The Strongly Seeing Lemma

    This is Lemma 5.12.

   *)
  Section strongly_seeing_lemma.

    (* The global graph *)
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.
    Hypothesis Hhonest : MostHonest g.

    (* Lemma 5.12 (Strongly Seeing Lemma). If the pair of events (x, y) is a fork, and
        x is strongly seen by event z in hashgraph A, then y will not be strongly seen by
        any event in any hashgraph B that is consistent with A.
     *)
    Lemma Strongly_Seeing
    : forall (x y : E),
        Forked g x y ->
        forall l {Node_l : G.IsNode l x},
          viewOf g l ->
          (exists z, StronglySee l z x) ->
          forall r {Node_l : G.IsNode r y},
            viewOf g r ->
            ~exists z, StronglySee r z y.
    Proof.
      intros.
      destruct H1 as [ z ? ].
      intro.
      destruct H3 as [ w ? ].

      (* There must be witness sets for `stronglySee`ing *)
      destruct H1 as [ Hsee_z_x [ z_pf [ Hmany_z Hsee_z ] ] ].
      destruct H3 as [ Hsee_w_y [ w_pf [ Hmany_w Hsee_w ] ] ].

      (* w sees 2/3 nodes
       * z sees 2/3 nodes
       * 2/3 nodes are honest
       *)

      (* Since both witness sets are large, they must overlap in creators.
       * This follows from the pigeon-hole principle.
       *)
      assert (exists both : list Creator,
                 Unique both /\
                 subset both (map creator w_pf) /\
                 subset both (map creator z_pf) /\
                 length both > one_third).
      { destruct Hmany_w; destruct Hmany_z.
        destruct (@strong_pigeon Creator Creator_dec
                                 (map creator w_pf)
                                 (map creator z_pf)
                                 allCreators);
          try solve [ tauto
                    | eauto using Unique_allCreators
                    | red; intros; apply allCreators_complete ].
        { unfold two_third in *.
          repeat rewrite map_length.
          div_cases (length allCreators); omega. }
        { exists x0.
          split; [ tauto | ].
          split; [ tauto | ].
          split; [ tauto | ].
          destruct H6 as [ ? [ Hx ? ] ] ; clear - Hx H5 H3.
          unfold two_third, one_third in *.
          repeat rewrite map_length in *.
          div_cases (length allCreators); omega. }
      }

      destruct Hmany_z as [ _ Hmany_z ].
      destruct Hmany_w as [ _ Hmany_w ].

      (* Therefore, there must be an honest creator in `both`
       * This follows from the pigeon-hole principle and `honesty`.
       *)
      assert (exists honest_overlap : Creator,
                 Honest g honest_overlap /\
                 (exists w, In w w_pf /\ creator w = honest_overlap) /\
                 (exists z, In z z_pf /\ creator z = honest_overlap)).
      { destruct Hhonest as [ honest most ].
        destruct H1 as [ both ? ].
        destruct (@weak_pigeon _ Creator_dec
                                 honest both
                                 allCreators);
          try solve [ tauto
                    | exact Unique_allCreators
                    | red; intros; apply allCreators_complete ].
        { unfold one_third, two_third in *.
          div_cases (length allCreators); omega. }
        { exists x0.
          split.
          { eapply most. tauto. }
          destruct H3 as [ ? [ Hx ? ] ].
          assert (In x0 (map creator w_pf) /\ In x0 (map creator z_pf)).
          { clear - H1 Hx. firstorder. }
          clear - H5.
          repeat rewrite in_map_iff in H5.
          firstorder. } }

      clear H1.

      destruct H3 as [ m ? ].

      (* We know that `m` created a node in both, since it created two
       * nodes and it is honest, they can not be a fork. Therefore, one
       * must be an ancestor of the other.
       *)
      destruct H1 as [ Honest_m [ [ w_overlap ? ] [ z_overlap ? ] ] ].
      assert (  selfAncestor g w_overlap z_overlap
              \/ selfAncestor g z_overlap w_overlap).
      { (* What is the reasoning here? *)
        specialize (Honest_m w_overlap z_overlap ltac:(tauto) ltac:(tauto)).
        red in Honest_m.
        unfold Forked in Honest_m.
        assert (creator w_overlap = creator z_overlap).
        { destruct H1; destruct H3. subst. firstorder. }
        assert (not (not (selfAncestor g w_overlap z_overlap \/ selfAncestor g z_overlap w_overlap))).
        { intro. apply Honest_m. split; auto. }
        apply Decidable.not_not; auto.
        apply Decidable.dec_or.
        eapply decidable_by_bool. apply is_selfAncestor_ok.
        eapply decidable_by_bool. apply is_selfAncestor_ok. }

      assert (See g z_overlap x).
      { eapply Forall_forall with (x:=z_overlap) in Hsee_z; [ | tauto ].
        eapply viewOf_See. 3: instantiate (1:=l); tauto.
        tauto.
        eapply IsNode_See; eauto. tauto. }
      assert (See g w_overlap y).
      { eapply Forall_forall with (x:=w_overlap) in Hsee_w; [ | tauto ].
        eapply viewOf_See. 3: instantiate (1:=r); tauto.
        tauto.
        eapply IsNode_See; eauto. tauto. }

      (* Suppose (wlog) `w_overlap` is an ancestor of `z_overlap`, then
       * `z` also sees `y`. But this is a contradiction because you can not
       * see any node created by `c` if you can see a fork by `c`.
       *)
      destruct H4.
      { symmetry in H.
        eapply Seeing_double; try eassumption.
        transitivity z_overlap.
        { eapply Ancestor_selfAncestor. eassumption. }
        { destruct H5; auto. } }
      { eapply Seeing_double; try eassumption.
        transitivity w_overlap.
        { eapply Ancestor_selfAncestor. eassumption. }
        { destruct H6; auto. } }
    Qed.


    (* Lemma 5.12 (Strongly Seeing Lemma). If the pair of events (x, y) is a fork, and
        x is strongly seen by event z in hashgraph A, then y will not be strongly seen by
        any event in any hashgraph B that is consistent with A.
     *)
    Lemma strongly_seeing
    : forall (x y : E),
        Forked g x y ->
        forall l (Acyclic_l : G.Acyclic l) {Node_l : G.IsNode l x},
          viewOf g l ->
          (exists z, stronglySee l z x = true) ->
          forall r (Acyclic_r : G.Acyclic r) {Node_l : G.IsNode r y},
            viewOf g r ->
            ~exists z, stronglySee r z y = true.
    Proof.
      intros.
      setoid_rewrite stronglySee_ok in H1.
      setoid_rewrite stronglySee_ok.
      eapply Strongly_Seeing; eauto.
    Qed.

  End strongly_seeing_lemma.

End See.