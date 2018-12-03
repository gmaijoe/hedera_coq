(* Copyright Swirlds Inc 2018 *)
Require Import Coq.Lists.List.
Require Import Coq.Bool.Bool.
Require Import Coq.Classes.Morphisms.
Require Import Coq.omega.Omega.

Require Import ExtLib.Relations.TransitiveClosure.
Require Import ExtLib.Recur.Relation.
Require Import ExtLib.Recur.GenRec.
Require Import ExtLib.Recur.Facts.
Require Import ExtLib.Recur.Measure.

Require Import Swirlds.Unique.
Require Import Swirlds.Pigeon.
Require Import Swirlds.Util.
Require Import Swirlds.Math.

Lemma negb_true_iff : forall a,
    negb a = true <-> ~a = true.
Proof. clear.
       destruct a; simpl; split; congruence.
Defined.

Lemma decidable_by_bool
  : forall f P, (f = true <-> P) -> Decidable.decidable P.
Proof.
  destruct f; simpl; intros.
  left. tauto.
  right. intro. apply H in H0. congruence.
Defined.

Lemma negb_not : forall p P,
    (p = true <-> P) ->
    negb p = true <-> not P.
Proof.
  intros. destruct p; simpl.
  { split.
    { intros; intro. congruence. }
    { intros. exfalso. apply H0. tauto. } }
  { split; auto.
    intro X; clear X.
    intro. apply H in H0. congruence. }
Defined.

Lemma ex_iff : forall {T} (P Q : T -> Prop),
    (forall x, P x <-> Q x) -> (exists x, P x) <-> (exists x, Q x).
Proof.
  intros.
  split. firstorder. firstorder.
Defined.

Lemma and_ex_iff : forall {T} P (Q : T -> Prop),
    (P /\ exists x, Q x) <-> (exists x, P /\ Q x).
Proof. intros; split; firstorder. Defined.


(* TODO: This should be in ExtLib. *)
Arguments RTFin {_ _ _ _} _.

Lemma if_equal : forall {T} (a : bool) (b c : T) a' b' c',
    a = a' ->
    b = b' ->
    c = c' ->
    (if a then b else c) = (if a' then b' else c').
Proof.
  clear; intros; subst; reflexivity.
Qed.

Lemma split_with : forall (P Q : Prop),
    P ->
    (P -> Q) ->
    P /\ Q.
Proof. intros. tauto. Qed.

Global Instance Proper_eqb : Proper (eq ==> eq ==> eq) eqb.
Proof. compute. intros. subst. reflexivity. Qed.


(* TODO Move up *)
Lemma all_iff : forall {T} (P Q : T -> Prop),
    (forall x, P x <-> Q x) ->
    (forall x, P x) <-> (forall x, Q x).
Proof. clear. firstorder. Qed.

Fixpoint maximum (ls : list nat) : nat :=
  match ls with
  | nil => 0
  | l :: ls => max l (maximum ls)
  end.

Global Instance Proper_max_leq : Proper (le ==> le ==> le) max.
Proof.
  clear.
  red. red. red. intros.
  rewrite Nat.max_le_compat_l; eauto.
  rewrite Nat.max_le_compat_r; eauto.
Qed.

Lemma maximum_In_le : forall x xs,
    In x xs -> x <= maximum xs.
Proof.
  clear.
  induction xs; simpl; try tauto.
  intros. destruct H.
  subst.
  eapply Nat.le_max_l.
  rewrite <- Nat.le_max_r. eauto.
Qed.

Lemma maximum_In : forall xs ys,
    (forall x, In x xs -> In x ys) ->
    maximum xs <= maximum ys.
Proof.
  induction xs; simpl; intros.
  { omega. }
  { rewrite IHxs with (ys := ys).
    - rewrite Max.max_r. reflexivity.
      eapply maximum_In_le. eapply H. tauto.
    - firstorder. }
Qed.

Lemma maximum_In_iff : forall xs ys,
    (forall x, In x xs <-> In x ys) ->
    maximum xs = maximum ys.
Proof.
  clear. intros.
  assert (maximum xs <= maximum ys) by (apply maximum_In; firstorder).
  assert (maximum ys <= maximum xs) by (apply maximum_In; firstorder).
  omega.
Qed.


Lemma maximum_gt_0 : forall xs, maximum xs > 0 -> In (maximum xs) xs.
Proof.
  induction xs.
  { simpl. omega. }
  { simpl.
    intros.
    destruct (Max.max_spec a (maximum xs)).
    { destruct H0. rewrite H1 in *. auto. }
    { destruct H0. rewrite H1. auto. } }
Qed.

Lemma by_soundness : forall a b P,
    (a = true <-> P) ->
    (b = true <-> P) ->
    a = b.
Proof.
  clear. intros.
  destruct a; destruct b; auto.
  { symmetry. apply H0. tauto. }
  { apply H. tauto. }
Qed.

Global Instance Transitive_le : Transitive le.
Proof. compute. intros. omega. Qed.

Lemma maximum_non_empty : forall xs, xs <> nil -> In (maximum xs) xs.
Proof.
  induction xs.
  { simpl. congruence. }
  { destruct xs.
    { simpl. left.
      symmetry; eapply Nat.max_0_r. }
    { intros. clear H.
      simpl in *.
      destruct (Max.max_spec a ((Init.Nat.max n (maximum xs)))).
      { destruct H. rewrite H0. right.
        eapply IHxs. congruence. }
      { left. destruct H; congruence. } } }
Qed.

Lemma implb_impl : forall a b,
    implb a b = true <-> (a = true -> b = true).
Proof. clear. unfold implb. destruct a; destruct b; simpl; firstorder. Qed.

Lemma orb_with : forall (P Q : bool),
    P || Q = true ->
    (P = true \/ (P = false /\ Q = true)).
Proof. destruct P; destruct Q; tauto. Qed.

Global Instance EqDec_nat : EqDec nat.
Proof. constructor. decide equality. Defined.
