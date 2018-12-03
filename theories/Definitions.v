(* Copyright Swirlds Inc 2018 *)
(** * Core Definitions on top of HashGraphs

  This file includes definitions for

  - [ManyCreators]
  - [Ancestor]
  - [selfAncestor]
  - [consistent]
  - [Forked]
  - [Trusts]
  - [Honest]
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

Module Definitions (HG : HashGraph).
  Import HG.GO.
  Import HG.

  Existing Class G.Acyclic.

  (* TODO: Can these be classes?
  Existing Class G.IsNode.
  Existing Class G.IsEdge.
  *)
  Lemma decidable_creator_eq
    : forall a b : Creator, Decidable.decidable (a = b).
  Proof using.
    clear.
    red. intros.
    destruct (Creator_dec a b); auto.
  Qed.


  (** * Critical Points

   An event can guarantee something once it knows it through more than
   2n/3 other creators.

   *)
  Definition one_third : nat := length allCreators / 3.
  Definition two_third : nat := 2 * length allCreators / 3.

  (* This is an addition from the original tech report because
   * it relies on the fact that there is more than 1 creator.
   *)
  Lemma two_third_gt_0 : two_third > 0.
  Proof.
    unfold two_third.
    generalize moreThan1Creator.
    div_cases (length allCreators); try omega.
  Qed.


  Definition hasEnough {T} (ls : list T) : bool :=
    two_third <? (length ls).

  Definition ManyCreators (es : list E) : Prop :=
      Unique (map creator es)
    /\ two_third < length es.

  Definition uniqueCreators : list E -> list E :=
    uniqueBy creator Creator_dec.

  Definition manyCreators (es : list E) : bool :=
    hasEnough (uniqueCreators es).

  Lemma manyCreators_ok : forall xs,
      manyCreators xs = true <->
      exists xs', Unique (map creator xs') /\
             subset xs' xs /\
             two_third < length xs'.
  Proof.
    unfold manyCreators, hasEnough. intros.
    split.
    { exists (uniqueCreators xs).
      split.
      eapply Unique_map_uniqueBy.
      split.
      { eapply uniqueBy_subset. }
      { eapply Nat.ltb_lt. assumption. } }
    { destruct 1.
      shatter H.
      apply Nat.ltb_lt.
      generalize (@squeeze_uniqueBy _ _ creator Creator_dec _ _ H H0).
      unfold uniqueCreators.
      omega. }
  Qed.

  Lemma uniqueBy_length_In : forall xs ys,
      (forall x, In x xs -> In x ys) ->
      length (uniqueCreators xs) <= length (uniqueCreators ys).
  Proof.
    intros.
    eapply squeeze_uniqueBy.
    2: eapply Unique_map_uniqueBy.
    red. intros. eapply H.
    eapply uniqueBy_subset. eapply H0.
  Qed.

  Lemma manyCreators_In : forall xs ys,
      (forall x, In x xs <-> In x ys) ->
      manyCreators xs = manyCreators ys.
  Proof.
    clear.
    unfold manyCreators; intros.
    unfold hasEnough.
    assert (length (uniqueCreators xs) = length (uniqueCreators ys)).
    { assert (length (uniqueCreators xs) <= length (uniqueCreators ys))
        by (apply uniqueBy_length_In; apply H; eauto).
      assert (length (uniqueCreators ys) <= length (uniqueCreators xs))
        by (apply uniqueBy_length_In; apply H; eauto).
      omega. }
    rewrite H0. tauto.
  Qed.


  (** * Consistency

   Two graphs are consistent if any node that is in both graphs has
   the same view of all of its ancestors (and selfParents).

   *)
  Section consisetency.
    (* Two graphs are consistent if they have the same information about
     * overlapping nodes.
     *)
    Definition consistent (l r : G.Graph) : Prop :=
      forall n, G.IsNode l n ->
           G.IsNode r n ->
           (forall n', G.IsEdge l n' n <-> G.IsEdge r n' n) /\
           (selfParent l n = selfParent r n).

    Global Instance Symmetric_consistent : Symmetric consistent.
    Proof. red. unfold consistent. firstorder. Qed.

    (* Suppose that you have a graph `g`. A graph `l` is a "view" of `g`
     * if it is consistent with a subset of `g`.
     *)
    Definition viewOf (g l : G.Graph) : Prop :=
        (forall n, G.IsNode l n -> G.IsNode g n)
      /\ consistent g l.

    Theorem two_views_are_consistent : forall g l r,
        viewOf g l ->
        viewOf g r ->
        consistent l r.
    Proof.
      unfold viewOf, consistent; intros.
      destruct H; destruct H0.
      split.
      { intros.
        edestruct H3; [ | | rewrite <- H5 ]; eauto.
        edestruct H4; [ | | rewrite H7 ]; eauto. reflexivity. }
      { edestruct H3; [ | | rewrite <- H6 ]; eauto.
        eapply H4; eauto. }
    Defined.

    Theorem views_are_acyclic : forall g l,
        viewOf g l ->
        G.Acyclic g -> G.Acyclic l.
    Proof.
      unfold G.Acyclic.
      do 3 intro.
      eapply Proper_well_founded.
      red in H. destruct H.
      red in H0.
      intros.
      eapply H0; eauto with graph.
    Defined.

  End consisetency.

  (* * Consistency of basic definitions *)
  Section consistent_hashgraph.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma IsEdge_consistent : forall x y,
        G.IsNode r y ->
        G.IsEdge l x y -> G.IsEdge r x y.
    Proof.
      intros.
      generalize (G.Edge_on_Nodes _ _ _ H0); intro.
      eapply Hconsistent in H0; eauto; try tauto.
    Qed.

    Lemma consistent_selfParent : forall x,
        G.IsNode l x -> G.IsNode r x ->
        selfParent l x = selfParent r x.
    Proof.
      intros. eapply Hconsistent; eauto.
    Qed.


    Lemma IsNode_consistent_selfParent:
      forall a : E, G.IsNode l a -> G.IsNode r a ->
               forall b : E, Some b = selfParent l a -> G.IsNode r b.
    Proof.
      intros a H b ? H1.
      eapply IsEdge_selfParent in H1.
      eapply IsEdge_consistent in H1; eauto with graph.
    Qed.

    Lemma consistent_selfParent_edge_selfParent : forall x,
        G.IsNode l x -> G.IsNode r x ->
        hRoption IsProj1 (selfParent_edge l x) (selfParent r x).
    Proof.
      unfold selfParent_edge.
      intros.
      generalize (eq_refl (selfParent l x)).
      generalize (@IsEdge_selfParent l x).
      rewrite <- (consistent_selfParent x H H0).
      destruct (selfParent l x); eauto.
      { constructor. constructor. }
      { constructor. }
    Qed.

  End consistent_hashgraph.

  Hint Resolve IsEdge_selfParent IsNode_consistent_selfParent IsEdge_consistent : graph.

  Section viewOf_hashgraph.
    Context g l {gA : G.Acyclic g} {lA : G.Acyclic l}.
    Hypothesis HviewOf : viewOf g l.

    Lemma IsNode_viewOf : forall x,
        G.IsNode l x -> G.IsNode g x.
    Proof using HviewOf. clear - HviewOf.
      intros. eapply HviewOf. assumption.
    Defined.

    Lemma exNode_viewOf : forall P,
        exNode l P = true ->
        exNode g P = true.
    Proof.
      intro.
      do 2 rewrite exNode_ok.
      intros.
      destruct H. exists x.
      destruct H. unfold viewOf in HviewOf. split; auto.
      apply HviewOf. assumption.
    Defined.

    Lemma selfParent_viewOf : forall n n',
        selfParent l n = Some n' ->
        selfParent g n = Some n'.
    Proof using HviewOf.
      intros. destruct HviewOf.
      red in H1.
      destruct (selfParent_is_self _ _ _ H).
      erewrite (proj2 (H1 _ _ _)); eauto.
      Unshelve.
      all: eauto with graph.
    Qed.

  End viewOf_hashgraph.


  (** * Ancestors

   Ancestors capture the events that another event knows about.

   *)
  Section ancestor.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    (* `a` is an Ancestor of `b`
     * if there exists a sequence of edges from `b` to `a`
     *)
    Inductive Ancestor (x : E) : E -> Prop :=
    | Ancestor_refl : Ancestor x x
    | Ancestor_parent : forall z y, G.IsEdge g z x -> Ancestor z y -> Ancestor x y.

    Definition is_Ancestor (a b : E) : bool :=
      @Fix E _ Acyclic_g (fun _ => bool)
           (fun x is_Ancestor =>
              if E_dec x b then true
              else anyb (List.map (fun z => is_Ancestor _ (proj2_sig z))
                                  (G.edgesTo g x))) a.

    Lemma is_Ancestor_sound
    : forall a b,
        is_Ancestor a b = true ->
        Ancestor a b.
    Proof.
      unfold is_Ancestor.
      intros a b.
      wfinduction; clear a.
      { intros x IH ?. destruct (E_dec x b) eqn:?.
        { subst. constructor. }
        { eapply anyb_true_iff in H.
          eapply in_map_iff in H.
          shatter H.
          apply IH in H.
          econstructor. 2: eassumption.
          destruct x0. assumption. } }
      { intros.
        destruct (E_dec x b); auto.
        apply Proper_anyb.
        red. intros.
        repeat rewrite in_map_iff.
        setoid_rewrite H. reflexivity. }
    Defined.

    Lemma is_Ancestor_complete
    : forall a b,
        Ancestor a b ->
        is_Ancestor a b = true.
    Proof.
      induction 1.
      { unfold is_Ancestor.
        rewrite Fix_eq; simpl.
        rewrite dec_refl; auto.
        intros.
        destruct (E_dec x0 x); auto.
        eapply Proper_anyb.
        unfold set_equiv; intros.
        repeat rewrite in_map_iff.
        setoid_rewrite H. reflexivity. }
      { unfold is_Ancestor.
        rewrite Fix_eq; simpl.
        { destruct (E_dec x y); auto.
          eapply anyb_true_iff.
          eapply in_map_iff.
          eapply G.edgesTo_complete in H.
          destruct H.
          eexists (@exist _ _ z x0).
          simpl. split.
          - eapply IHAncestor.
          - eapply H. }
        { intros.
          destruct (E_dec x0 y); auto.
          eapply Proper_anyb.
          red; intros.
          repeat rewrite in_map_iff.
          setoid_rewrite H1. reflexivity. } }
    Defined.

    Theorem is_Ancestor_ok
    : forall a b : E, is_Ancestor a b = true <-> Ancestor a b.
    Proof.
      split; eauto using is_Ancestor_complete, is_Ancestor_sound.
    Defined.

    (* Auxiliary lemmas used for automation *)
    Global Instance Reflexive_Ancestor : Reflexive Ancestor.
    Proof. constructor. Defined.

    Global Instance Transitive_Ancestor : Transitive Ancestor.
    Proof.
      red. induction 1; auto.
      { intros.
        eapply IHAncestor in H1.
        econstructor; eauto. }
    Defined.

    Lemma IsNode_Ancestor
    : forall a b, G.IsNode g a -> Ancestor a b -> G.IsNode g b.
    Proof.
      clear.
      induction 2; eauto with graph.
    Defined.

    Lemma IsNode_Ancestor' : forall n n',
        G.IsNode g n' ->
        Ancestor n n' ->
        G.IsNode g n.
    Proof.
      destruct 2; eauto with graph.
    Defined.

    Lemma IsNode_Ancestor_neq
      : forall a b, a <> b -> Ancestor a b -> G.IsNode g a /\ G.IsNode g b.
    Proof.
      clear.
      induction 2.
      { exfalso; auto. }
      { destruct (E_dec z y).
        { subst. split; eauto with graph. }
        { eapply IHAncestor in n.
          split; eauto with graph. tauto. } }
    Qed.

    Lemma Ancestor_add_Edge : forall x y z,
        G.IsEdge g z y -> Ancestor x y -> Ancestor x z.
    Proof.
      induction 2.
      { econstructor. eassumption. constructor. }
      { econstructor. 2: eapply IHAncestor. eassumption. eassumption. }
    Qed.

  End ancestor.

  Hint Resolve IsNode_Ancestor IsNode_Ancestor' IsNode_Ancestor_neq : graph.

  (* * Consistency of Ancestor *)
  Section consistent_ancestor.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_Ancestor : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        Ancestor l x y -> Ancestor r x y.
    Proof.
      induction 3.
      { constructor. }
      { econstructor; [ | eapply IHAncestor ]; eauto with graph. }
    Qed.

    Lemma IsNode_consistent_Ancestor
    : forall x a : E, G.IsNode l x -> G.IsNode r x ->
                 Ancestor l x a -> G.IsNode r a.
    Proof.
      intros x a H ? H3.
      assert (Ancestor r x a) by (eapply consistent_Ancestor; eauto).
      eauto with graph.
    Qed.

  End consistent_ancestor.

  Hint Resolve consistent_Ancestor : consistent.
  Hint Resolve IsNode_consistent_Ancestor : graph.

  Section viewOf_ancestor.
    Context g l {gA : G.Acyclic g} {lA : G.Acyclic l}.
    Hypothesis HviewOf : viewOf g l.

    Lemma viewOf_Ancestor : forall n n',
        Ancestor l n n' -> Ancestor g n n'.
    Proof.
      unfold viewOf in HviewOf.
      clear - HviewOf.
      induction 1.
      { constructor. }
      { econstructor; eauto.
        destruct HviewOf.
        red in H2.
        eapply (proj1 (H2 _ _ _)); auto.
        Unshelve.
        all: eauto with graph. }
    Defined.

    Lemma viewOf_is_Ancestor : forall n n',
        is_Ancestor l n n' = true ->
        is_Ancestor g n n' = true.
    Proof.
      (* Relies on completeness of `is_Ancestor` *)
      intros. eapply is_Ancestor_complete.
      eapply is_Ancestor_sound in H. eapply viewOf_Ancestor. auto.
    Defined.

    Lemma Ancestor_contra : forall n n',
        G.IsNode l n ->
        Ancestor g n n' ->
        Ancestor l n n'.
    Proof.
      clear - HviewOf.
      intros.
      eapply consistent_Ancestor.
      - eapply HviewOf.
      - eapply HviewOf. assumption.
      - auto.
      - auto.
    Qed.

  End viewOf_ancestor.

  (** * selfAncestors

   Self ancestors follow the selfParent chain meaning that if `a` is a
   selfAnceestor of `b` then `creator a = creator b`.

   *)
  Section self_ancestor.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    Inductive selfAncestor (a : E) : E -> Prop :=
    | selfAncestor_refl : selfAncestor a a
    | selfAncestor_trans : forall b c,
        Some b = selfParent g a ->
        selfAncestor b c ->
        selfAncestor a c.

    Definition is_selfAncestor (a b : E) : bool :=
      @Fix E _ Acyclic_g (fun _ => bool)
           (fun x is_selfAncestor =>
              if E_eqb x b then true
              else match selfParent g x as X return selfParent g x = X -> _ with
                   | None => fun _ => false
                   | Some x' => fun pf =>
                     is_selfAncestor x' (proj2 (selfParent_is_self _ _ _ pf))
                   end eq_refl) a.

    Theorem is_selfAncestor_ok
    : forall a b : E,
        is_selfAncestor a b = true <-> selfAncestor a b.
    Proof.
      intros.
      unfold is_selfAncestor.
      eapply (@Util.Fix_ind E _ Acyclic_g (fun _ => bool)).
      { intros.
        generalize (E_eqb_ok x b); destruct (E_eqb x b).
        { intros. split; eauto.
          intros. apply H0 in H1. subst. constructor. }
        { intros.
          generalize (@eq_refl _ (selfParent g x)).
          destruct (selfParent g x) eqn:?.
          { intros. rewrite H; eauto; clear H.
            split.
            { intros.
              econstructor. symmetry; eassumption. eassumption. }
            { intros. inversion H.
              { exfalso. apply H0 in H1. congruence. }
              { subst. rewrite Heqo in H1. inversion H1; subst. auto. } }
            { eapply selfParent_is_self in Heqo. tauto. } }
          { intros. split; try congruence.
            intros.
            inversion H1; subst.
            { tauto. }
            { congruence. } } } }
      { intros.
        destruct (E_eqb x b); auto.
        generalize (@eq_refl _ (selfParent g x)).
        generalize (selfParent_is_self g x).
        destruct (selfParent g x); intros; auto. }
    Defined.

    (* Lemmas for automation *)
    Lemma IsNode_selfAncestor : forall x y : E,
        G.IsNode g x ->
        selfAncestor x y -> G.IsNode g y.
    Proof.
      clear.
      induction 2; eauto.
      apply IHselfAncestor.
      eauto with graph.
    Qed.

    Lemma IsNode_selfAncestor' : forall x y : E,
        G.IsNode g y ->
        selfAncestor x y -> G.IsNode g x.
    Proof.
      clear.
      destruct 2; eauto with graph.
    Qed.

    Definition Ancestor_selfAncestor
    : forall x y, selfAncestor x y -> Ancestor g x y.
    Proof.
      induction 1; econstructor; eauto with graph.
    Defined.


    Lemma decidable_selfAncestor:
      forall x y : E, Decidable.decidable (selfAncestor x y).
    Proof.
      intros.
      red.
      rewrite <- is_selfAncestor_ok.
      destruct (is_selfAncestor x y); auto.
    Qed.

  End self_ancestor.

  (* Consistency of selfAncestor *)
  Section consistent_selfAncestor.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_selfAncestor : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        selfAncestor l x y -> selfAncestor r x y.
    Proof.
      induction 3.
      { constructor. }
      { econstructor; [ | eapply IHselfAncestor ]; eauto with graph.
        erewrite <- consistent_selfParent; eauto with graph. }
    Qed.

  End consistent_selfAncestor.

  Section viewOf_selfAncestor.
    Context g l {gA : G.Acyclic g} {lA : G.Acyclic l}.
    Hypothesis HviewOf : viewOf g l.

    Lemma viewOf_selfAncestor : forall n n',
        selfAncestor l n n' ->
        selfAncestor g n n'.
    Proof.
      induction 1; econstructor; eauto.
      symmetry. eapply selfParent_viewOf; eauto.
    Defined.

    Lemma viewOf_is_selfAncestor : forall n n',
        is_selfAncestor l n n' = true ->
        is_selfAncestor g n n' = true.
    Proof.
      do 2 intro. do 2 rewrite is_selfAncestor_ok. apply viewOf_selfAncestor.
    Qed.

    Lemma selfAncestor_contra : forall n n',
        G.IsNode l n ->
        selfAncestor g n n' ->
        selfAncestor l n n'.
    Proof.
      clear - HviewOf.
      intros.
      eapply consistent_selfAncestor.
      - eapply HviewOf.
      - eapply HviewOf. assumption.
      - auto.
      - auto.
    Qed.
  End viewOf_selfAncestor.


  (** * Forking

   If a creator constructs two events where neither is a selfAncestor of
   the other, then they create a fork.

   Forks are a way of cheating.
   *)
  Section forking.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    (* If a single creator makes two nodes where neither is a `selfAncestor`
     * of the other, then it has created a fork.
     *)
    Definition Forked (a b : E) : Prop :=
      creator a = creator b /\
      ~(selfAncestor g a b \/ selfAncestor g b a).

    Definition is_Fork (a b : E) : bool :=
         eqb_creator (creator a) (creator b)
      && negb (is_selfAncestor g a b)
      && negb (is_selfAncestor g b a).

    Theorem is_Fork_ok : forall a b,
        is_Fork a b = true <-> Forked a b.
    Proof.
      intros. unfold Forked, is_Fork.
      rewrite <- andb_assoc.
      rewrite andb_true_iff.
      rewrite <- negb_orb.
      rewrite negb_true_iff.
      rewrite orb_true_iff.
      repeat rewrite is_selfAncestor_ok.
      rewrite eqb_creator_sound. reflexivity.
    Defined.

    (* Auxiliary lemmas *)
    Global Instance Symmetric_Forked : Symmetric Forked.
    Proof.
      clear. unfold Forked. red; intros.
      destruct H; split; auto. tauto.
    Defined.

    Lemma not_Forked : forall x y,
        ~Forked x y ->
        creator x <> creator y \/ selfAncestor g x y \/ selfAncestor g y x.
    Proof.
      unfold Forked.
      intros.
      apply Decidable.not_and in H.
      { destruct H; [ left | right ] ; auto.
        eapply Decidable.not_not; auto.
        eapply Decidable.dec_or; eapply decidable_selfAncestor; eauto. }
      { apply decidable_creator_eq. }
    Qed.

  End forking.

  (* * Consistency of forking *)
  Section consistent_forking.
    Variables l r : G.Graph.
    Variable Acyclic_l : G.Acyclic l.
    Variable Acyclic_r : G.Acyclic r.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_Forked : forall x y,
        G.IsNode l x -> G.IsNode r x ->
        G.IsNode l y -> G.IsNode r y ->
        Forked l x y -> Forked r x y.
    Proof.
      unfold Forked. intros.
      destruct H3.
      split; [ auto | ].
      symmetry in Hconsistent.
      intro. apply H4; clear H4.
      destruct H5; [ left | right ].
      { eapply consistent_selfAncestor; eauto with graph. }
      { eapply consistent_selfAncestor; eauto with graph. }
    Qed.

  End consistent_forking.

  Section viewOf_forking.
    Context g l {gA : G.Acyclic g} {lA : G.Acyclic l}.
    Hypothesis HviewOf : viewOf g l.

    Lemma viewOf_Forked : forall n n',
        G.IsNode l n ->
        G.IsNode l n' ->
        Forked g n n' ->
        Forked l n n'.
    Proof.
      clear - HviewOf.
      destruct 3.
      split; eauto.
      intro. apply H2; clear H2.
      destruct H3; [ left | right ].
      { eauto using viewOf_selfAncestor. }
      { eauto using viewOf_selfAncestor. }
    Defined.

    Lemma viewOf_is_Fork : forall n n',
        G.IsNode l n ->
        G.IsNode l n' ->
        is_Fork g n n' = true ->
        is_Fork l n n' = true.
    Proof.
      intros.
      eapply is_Fork_ok.
      eapply is_Fork_ok in H1.
      eauto using viewOf_Forked.
    Defined.

  End viewOf_forking.

  (** * Trust and Honesty

   An event `a` trusts a creator `b` if there is not a by `b` in the ancestors
   of `a`.

   A creator is honest is it never creates a fork.
   *)
  Section trust_and_honesty.
    Variable g : G.Graph.
    Context {Acyclic_g : G.Acyclic g}.

    (* A creator is honest if it never creates a fork.
     *)
    Definition Honest (c : Creator) : Prop :=
      forall a b,
        creator a = c ->
        creator b = c ->
        ~Forked g a b.

    (* This needs to say that more than 2/3 of creators are honest. *)
    Definition MostHonest : Prop :=
      exists cs : list Creator,
        Unique cs /\
        length cs > two_third /\
        forall c, In c cs -> Honest c.

    (* * Trusting *)
    Definition Trusts (x : E) (c : Creator) : Prop :=
      not (exists a, exists b, creator a = c /\ creator b = c
                   /\ Ancestor g x a
                   /\ Ancestor g x b
                   /\ Forked g a b).

    (* `x` trusts `c` (`x` is a node, `c` is a creator) if
     * `x` does not see a fork by `c`.
     *)
    Definition trusts (x : E) (c : Creator) : bool :=
      negb (GO.exNode g (fun a => GO.exNode g (fun b =>
                    to_bool Creator_dec c (creator a)
                 && is_Ancestor g x a
                 && is_Ancestor g x b
                 && is_Fork g a b))).


    Theorem trusts_ok : forall x c,
        trusts x c = true <-> Trusts x c.
    Proof.
      unfold trusts, Trusts.
      intros.
      eapply negb_not.
      rewrite exNode_ok.
      setoid_rewrite exNode_ok.
      eapply ex_iff.
      intros.
      rewrite and_ex_iff.
      eapply ex_iff.
      intros.
      repeat rewrite andb_true_iff.
      repeat rewrite is_Ancestor_ok.
      rewrite is_Fork_ok.
      rewrite to_bool_eq.
      split.
      { intros.
        repeat match goal with
               | H : _ /\ _ |- _ => destruct H
               end.
        split; auto. split; auto.
        subst.
        destruct H2. auto. }
      { intros.
        repeat match goal with
               | H : _ /\ _ |- _ => destruct H
               end.
        assert (G.IsNode g x0 /\ G.IsNode g x1).
        { destruct H3. clear H H0 H3.
          destruct (E_dec x x0).
          { destruct (E_dec x x1).
            { subst. exfalso. apply H4. left; constructor. }
            { subst. eapply IsNode_Ancestor_neq in H2; eauto. } }
          { destruct (E_dec x x1).
            { subst. eapply IsNode_Ancestor_neq in H1; tauto. }
            { eapply IsNode_Ancestor_neq in H1; eapply IsNode_Ancestor_neq in H2; tauto. } } }
        split; try tauto. split; auto. tauto. }
    Qed.

    Lemma Honest_Trusts : forall c,
        Honest c ->
        forall x, Trusts x c.
    Proof. clear.
      unfold Honest, Trusts; intros.
      intro.
      destruct H0 as [ ? [ ? ? ] ].
      specialize (H x0 x1).
      eapply H; tauto.
    Defined.

  End trust_and_honesty.

  Section consistent_trust_and_honesty.
    Variables l r : G.Graph.
    Context {Acyclic_l : G.Acyclic l}.
    Context {Acyclic_r : G.Acyclic r}.
    Hypothesis Hconsistent : consistent l r.

    Lemma consistent_Trusts : forall x c,
        G.IsNode l x -> G.IsNode r x ->
        Trusts l x c -> Trusts r x c.
    Proof.
      unfold Trusts; intros.
      intro; apply H1; clear H1.
      destruct H2 as [ a [ b [ ? [ ? [ ? [ ? ? ] ] ] ] ] ].
      exists a; exists b.
      split; auto.
      split; auto.
      assert (consistent r l) by (symmetry; assumption).
      split; eauto using consistent_Ancestor.
      split; eauto using consistent_Ancestor.
      eapply consistent_Forked; eauto with graph.
    Qed.

  End consistent_trust_and_honesty.

  Section viewOf_trust_and_honesty.
    Context g l {gA : G.Acyclic g} {lA : G.Acyclic l}.
    Hypothesis HviewOf : viewOf g l.


    Lemma viewOf_Trusts : forall n c,
        G.IsNode l n ->
        Trusts l n c -> Trusts g n c.
    Proof.
      clear - HviewOf.
      unfold Trusts; intros.
      intro; apply H0; clear H0.
      destruct H1 as [ a [ b ? ] ].
      exists a; exists b.
      destruct H0 as [ ? [ ? [ ? [ ? ? ] ] ] ].
      split; [ tauto | ].
      split; [ tauto | ].
      split; [ eauto using Ancestor_contra | ].
      split; [ eauto using Ancestor_contra | ].
      eapply viewOf_Forked; eauto.
      eapply Ancestor_contra in H2; eauto. eapply IsNode_Ancestor in H2; eauto.
      eapply Ancestor_contra in H3; eauto. eapply IsNode_Ancestor in H3; eauto.
    Qed.

    Lemma viewOf_trusts : forall n c,
        G.IsNode l n ->
        trusts l n c = true ->
        trusts g n c = true.
    Proof.
      intros.
      eapply trusts_ok.
      eapply viewOf_Trusts; eauto.
      eapply trusts_ok.
      assumption.
    Defined.

  End viewOf_trust_and_honesty.

End Definitions.