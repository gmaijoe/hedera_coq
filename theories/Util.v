(* Copyright Swirlds Inc 2018 *)
Require Import Coq.Lists.List.
Require Import Coq.Bool.Bool.
Require Import Coq.Classes.Morphisms.
Require Import Coq.Classes.Equivalence.
Require Import Coq.Classes.EquivDec.


Section with_prop.
  Context {T : Type} (P : T -> Prop) .

  Fixpoint with_prop (ls : list T) {struct ls}
  : (forall x, In x ls -> P x) -> list { x : T | P x } :=
    match ls as ls return (forall x, In x ls -> P x) -> list { x : T | P x } with
    | nil => fun _ => nil
    | l :: ls => fun pf =>
      @exist _ _ l (pf _ (or_introl Logic.eq_refl)) :: with_prop ls (fun x z => pf _ (or_intror z))
    end.
End with_prop.


(** TODO: This should live somewhere already *)
Class Equiv (T : Type) : Type :=
{ equiv : T -> T -> Prop
; Equivalence_equiv :> Equivalence equiv }.


(** TODO: This should live somewhere already *)
Class EqDec (T : Type) : Type :=
{ eq_dec : forall a b : T, {a = b} + {a <> b} }.

Require Import ListSet.

(** TODO: Use MSets. *)
Section set_ops.
  Context {T : Type}.
  Context {Eq_dec : EqDec T}.

  Fixpoint set_unions (ls : list (set T)) : set T :=
    match ls with
    | nil => nil
    | l :: ls => set_union eq_dec l (set_unions ls)
    end.

  Theorem set_unions_In : forall x (xss : list (set T)),
      (exists xs, In xs xss /\ In x xs) <-> In x (set_unions xss).
  Proof.
    induction xss; simpl; intros.
    { split; try tauto. destruct 1. tauto. }
    { rewrite set_union_iff. rewrite <- IHxss; clear IHxss.
      split.
      { destruct 1. destruct H. destruct H; eauto.
        subst; tauto. }
      { destruct 1.
        { exists a. tauto. }
        { destruct H. exists x0. tauto. } } }
  Defined.

End set_ops.

(** NOTE: This simplifies a lot of definitions! *)
Section Fix_ind.
  Context {A} {R : A -> A -> Prop} (wf : well_founded R)
          (Ret : A -> Type) (rec : forall x : A, (forall y : A, R y x -> Ret y) -> Ret x) (P : forall x, Ret x -> Prop).

  Hypothesis Hrec : forall x f, (forall y, R y x -> P y (f y)) -> P x (rec x (fun y _ => f y)).

  Hypothesis Proper_rec : forall x f g, (forall y z, f y z = g y z) -> rec x f = rec x g.

  Theorem Fix_ind : forall x, P x (@Fix A R wf Ret rec x).
  Proof.
    refine (@Fix A R wf (fun x => P x (Fix wf Ret rec x)) _).
    intros.
    rewrite Init.Wf.Fix_eq.
    { eapply Hrec. assumption. }
    { exact Proper_rec. }
  Defined.
End Fix_ind.

Definition anyb : list bool -> bool :=
  List.fold_right orb false.

Lemma negb_true_not : forall b, negb b = true -> (b = true -> False).
Proof. destruct b; simpl. congruence. congruence. Defined.

Lemma negb_true_iff : forall a, negb a = true <-> not (a = true).
Proof. destruct a; simpl; split; congruence. Defined.


Lemma anyb_false_map : forall xs, anyb xs = false ->
                             forallb negb xs = true.
Proof.
  induction xs; simpl; intros; auto.
  eapply orb_false_iff in H. destruct H.
  subst; simpl; eauto.
Defined.


Ltac bdestruct H :=
    first [ apply andb_true_iff in H ; destruct H ].

Theorem anyb_true_iff : forall l, anyb l = true <-> In true l.
Proof.
  induction l; simpl.
  { intuition. }
  { rewrite orb_true_iff. rewrite IHl. reflexivity. }
Defined.

Theorem anyb_false_iff : forall l, anyb l = false <-> ~In true l.
Proof.
  induction l; simpl.
  { tauto. }
  { rewrite orb_false_iff. rewrite IHl; clear IHl.
    intuition.
    - subst. discriminate.
    - destruct a; tauto. }
Defined.

Section wf.
  Variable T : Type.
  Variable R1 R2 : T -> T -> Prop.

  Hypothesis R1_R2 : forall a b, R1 a b -> R2 a b.

  Lemma Proper_well_founded : well_founded R2 -> well_founded R1.
  Proof.
    intro.
    unfold well_founded.
    refine (@Fix T _ H _ _); clear H.
    intros. constructor.
    intros. eapply H. eauto.
  Defined.
End wf.

Definition set_equiv {T : Type} (xs ys : list T) : Prop :=
  forall x, In x xs <-> In x ys.

Lemma anyb_In : forall xs, In true xs <-> anyb xs = true.
Proof.
  induction xs.
  { simpl. split; intros. destruct H. inversion H. }
  { simpl. rewrite orb_true_iff. rewrite IHxs. tauto. }
Defined.

Lemma Proper_anyb : Proper (set_equiv ==> eq) anyb.
Proof.
  red. red. intros.
  destruct (anyb x) eqn:?.
  { rewrite <- anyb_In in Heqb.
    symmetry.
    apply anyb_In. apply H. assumption. }
  { destruct (anyb y) eqn:?; auto.
    rewrite <- anyb_In in Heqb0.
    apply H in Heqb0.
    rewrite anyb_In in Heqb0. congruence. }
Defined.
