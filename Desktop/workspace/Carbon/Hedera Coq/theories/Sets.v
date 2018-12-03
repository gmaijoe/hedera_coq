(* Copyright Swirlds Inc. 2018 *)
Require Import Coq.Lists.List.
Require Import Coq.Lists.ListSet.
Require Import Coq.Init.Wf.
Require Coq.Arith.Compare_dec.

Require Import Coq.Classes.Morphisms.

Require Import Swirlds.Util.
Require Import Swirlds.FixLib.

Require ExtLib.Data.Member.
Require Import ExtLib.Relations.TransitiveClosure.

Require Import Coq.omega.Omega.

(* TODO: It would be nice to use MSets, but the fact that they are modules
 * means that they have some limitations.
 *)
Section list_set_ops.
  Variable T : Type.

  Definition set_leq (l r : set T) : Prop :=
    forall x, set_In x l -> set_In x r.

  Definition set_eq (l r : set T) : Prop :=
    forall x, set_In x l <-> set_In x r.

  Global Instance Equivalence_set_eq : Equivalence set_eq.
  Proof.
    constructor.
    { do 2 red; tauto. }
    { do 2 red. intros. unfold set_eq in H. symmetry. eapply H. }
    { red. unfold set_eq. intros.
      rewrite H. eauto. }
  Defined.

  Context {EqDec_Node : EqDec T}.

  Global Instance Proper_set_In_eq_iff
  : Proper (@eq T ==> set_eq ==> iff) (@set_In T).
  Proof.
    red; unfold respectful, set_eq. red. intros; subst. firstorder.
  Defined.

  Global Instance Proper_set_In_eq_impl
  : Proper (@eq T ==> set_eq ==> Basics.impl) (@set_In T).
  Proof.
    red; unfold respectful, set_eq. red. intros; subst. firstorder.
  Defined.

  Global Instance Proper_set_In_eq_flip
  : Proper (@eq T ==> set_eq ==> Basics.flip Basics.impl) (@set_In T).
  Proof.
    red; unfold respectful, set_eq. red. intros; subst. firstorder.
  Defined.


  Global Instance Proper_set_union_eq
  : Proper (set_eq ==> set_eq ==> set_eq) (@set_union T eq_dec).
  Proof.
    red; unfold respectful, set_eq; intros.
    repeat rewrite set_union_iff.
    rewrite H. rewrite H0. reflexivity.
  Defined.

  Global Instance Proper_set_unions
  : Proper (Forall2 set_eq ==> set_eq) (@set_unions T EqDec_Node).
  Proof.
    red; unfold respectful; intros.
    induction H; simpl.
    { reflexivity. }
    { rewrite IHForall2. rewrite H. reflexivity. }
  Defined.

  Global Instance Proper_cons_set_eq
  : Proper (eq ==> set_eq ==> set_eq) (@cons T).
  Proof.
    unfold Proper, respectful, set_eq; simpl; intros; subst.
    rewrite H0. reflexivity.
  Defined.

  Global Instance Proper_set_addset_eq
  : Proper (eq ==> set_eq ==> set_eq) (@set_add T eq_dec).
  Proof.
    unfold Proper, respectful, set_eq; simpl; intros; subst.
    repeat rewrite set_add_iff.
    rewrite H0. tauto.
  Defined.

End list_set_ops.

Fixpoint set_max (s : set nat) : nat :=
  match s with
  | nil => 0
  | hd :: tl =>
    if le_gt_dec (set_max tl) hd then hd else set_max tl
  end.

Section set_max.
  Lemma set_max_is_greater : forall n s, set_In n s -> n <= set_max s.
  Proof.
    induction s; simpl; intros; try tauto.
    destruct (Compare_dec.le_gt_dec (set_max s) a).
    { destruct H; subst; eauto. etransitivity. eapply IHs; eauto. assumption. }
    { destruct H; subst; eauto. clear - g. omega. }
  Defined.

  Lemma set_max_is_In : forall s, s = nil \/ set_In (set_max s) s.
  Proof.
    induction s; simpl.
    { tauto. }
    { destruct IHs; subst.
      { right. simpl. tauto. }
      { right. destruct (le_gt_dec (set_max s) a); tauto. } }
  Defined.

  Global Instance Proper_set_max : Proper (@set_eq _ ==> eq) set_max.
  Proof.
    repeat red; unfold set_eq; simpl.
    intros.
    destruct (set_max_is_In x); destruct (set_max_is_In y).
    { subst; reflexivity. }
    { subst. eapply H in H1. inversion H1. }
    { subst. eapply H in H0. inversion H0. }
    { assert (set_max x >= set_max y).
      { eapply set_max_is_greater. eapply H. eassumption. }
      assert (set_max y >= set_max x).
      { eapply set_max_is_greater. eapply H. eassumption. }
      omega. }
  Defined.

End set_max.



Section with_In.
  Context {T : Type} .

  Fixpoint with_In (ls : list T) {struct ls}
  : list { x : T | In x ls } :=
    match ls as ls return list { x : T | In x ls } with
    | nil => nil
    | l :: ls =>
      @exist _ _ l (or_introl Logic.eq_refl) :: map (fun x => @exist _ _ (proj1_sig x) (or_intror (proj2_sig x))) (with_In ls)
    end.

  Lemma In_with_In : forall l ls,
      In l ls ->
      exists pf, In (@exist _ _ l pf) (with_In ls).
  Proof.
    induction ls; simpl.
    { destruct 1. }
    { destruct 1.
      { subst. eexists; left; reflexivity. }
      { eapply IHls in H.
        destruct H.
        exists (or_intror x). right.
        eapply in_map_iff.
        eexists; split; [ | eapply H ].
        reflexivity. } }
  Defined.

  Lemma with_prop_with_In
  : forall (P : T -> Prop) (ls : list T) (H : forall x : T, In x ls -> P x),
      with_prop P ls H =
      map (fun x : { x : T | In x ls } => @exist _ _ (proj1_sig x)
                                              (H _ (proj2_sig x)))
          (with_In ls).
  Proof.
    induction ls; simpl; intros; auto.
    rewrite IHls. rewrite map_map. simpl. reflexivity.
  Defined.

End with_In.

Section filter_map.
  Context {T U : Type}.
  Variable f : T -> option U.

  Fixpoint filter_map (ls : list T) : list U :=
    match ls with
    | nil => nil
    | t :: ts =>
      match f t with
      | None => filter_map ts
      | Some u => u :: filter_map ts
      end
    end.

  Theorem in_filter_map_iff
  : forall u ts, In u (filter_map ts) <-> exists t, f t = Some u /\ In t ts.
  Proof.
    induction ts; simpl; intros.
    { split; [ destruct 1 | ]. destruct 1. tauto. }
    { destruct (f a) eqn:?.
      { simpl. rewrite IHts. clear - Heqo.
        split; intros.
        { destruct H; subst.
          { eexists; split; eauto. }
          { destruct H. exists x. tauto. } }
        { destruct H. destruct H. destruct H0.
          { subst. rewrite Heqo in H. inversion H. tauto. }
          { right. eexists; eauto. } } }
      { rewrite IHts; clear IHts.
        split; firstorder.
        subst. congruence. } }
  Defined.

End filter_map.

Global Instance Proper_filter_map {T U}
: Proper (pointwise_relation _ eq ==> eq ==> eq) (@filter_map T U).
Proof.
  repeat red; intros.
  subst.
  induction y0; simpl; intros; auto.
  rewrite H. rewrite IHy0. reflexivity.
Qed.
