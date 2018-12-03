(* Copyright Swirlds Inc. 2018 *)
(** Most of this file is borrowed from coq-ext-lib
 **  https://github.com/coq-ext-lib/coq-ext-lib
 **
 ** Additional definitions should really be constributed back to
 ** that library.
 **)

Require Import Coq.Classes.RelationClasses.
Require Import Coq.Classes.Morphisms.
Require Import Coq.Setoids.Setoid.

Set Implicit Arguments.
Set Strict Implicit.

Fixpoint guard A (R : A -> A -> Prop) (n : nat) (wfR : well_founded R)
  {struct n}: well_founded R :=
  match n with
    | 0 => wfR
    | S n => fun x => Acc_intro x (fun y _ => guard n (guard n wfR) y)
  end.

Section setoid_fix.
  Variables (A : Type) (R : A -> A -> Prop) (Rwf : well_founded R).
  Variables (P : A -> Type)
            (F : forall x : A, (forall y : A, R y x -> P y) -> P x).
  Variable r : forall x : A, P x -> P x -> Prop.
  Hypothesis Hstep : forall (x : A) (f g : forall y : A, R y x -> P y),
                       (forall (y : A) (p : R y x), r (f y p) (g y p)) ->
                       r (@F x f) (@F x g).

  Lemma Fix_F_equiv_inv
  : forall (x : A) (r' s' : Acc R x),
      r (Fix_F _ F r') (Fix_F _ F s').
  Proof.
    intro x; induction (Rwf x); intros.
    rewrite <- (Fix_F_eq _ F r'); rewrite <- (Fix_F_eq _ F s'); intros.
    eapply Hstep.
    eauto.
  Qed.

  Theorem Fix_equiv
  : forall x : A,
      r (Fix Rwf P F x) (@F x (fun (y : A) (_ : R y x) => Fix Rwf P F y)).
  Proof.
    intro x; unfold Fix.
    rewrite <- Fix_F_eq.
    apply Hstep; intros.
    apply Fix_F_equiv_inv.
  Qed.

  Theorem Fix_equiv'
  : forall x : A,
      r (@F x (fun (y : A) (_ : R y x) => Fix Rwf P F y)) (Fix Rwf P F x).
  Proof.
    intro x; unfold Fix.
    rewrite <- Fix_F_eq.
    apply Hstep; intros.
    apply Fix_F_equiv_inv.
  Qed.
End setoid_fix.

Section setoid_ind.
  Context {A : Type} {R : A -> A -> Prop} (Rwf : well_founded R).
  Context {P : A -> Type}
          (F : forall x : A, (forall y : A, R y x -> P y) -> P x).
  Variable r : forall x : A, P x -> P x -> Prop.

  Variable Pr : forall x, P x -> Prop.

  Hypothesis Hstep
  :  forall (f : forall x y : A, R y x -> P y),
      (** NOTE: this allows us to do multiple unfolds without issue *)
      (forall (x y : A) (p : R y x), r (@f _ _ p) (@F _ (@f _))) ->
      forall (x : A),
        (forall (y : A) (p : R y x), @Pr y (f _ _ p)) ->
        @Pr x (@F x (@f x)).

  Hypothesis F_respects
  : forall (x : A) (f g : forall y : A, R y x -> P y),
      (forall (y : A) (p : R y x), r (f y p) (g y p)) ->
      r (@F x f) (@F x g).

  Hypothesis Pr_respectful : forall x, Proper (@r x ==> Basics.impl) (@Pr x).

  Theorem Fix_equiv_ind
  : forall x, @Pr x (@Fix A R Rwf P F x).
  Proof.
    refine (@Fix _ _ Rwf (fun x => @Pr x (@Fix A R Rwf P F x))  _).
    intros. eapply Pr_respectful.
    eapply Fix_equiv' with (r:=r).
    eapply F_respects.
    unfold Fix.
    eapply (@Hstep (fun x y pf => @Fix_F A R P F _ (Rwf _))).
    { intros.
      change (Fix_F P F (Rwf y)) with (@Fix _ _ Rwf _ F y).
      eapply Fix_equiv with (r:=r).
      eapply F_respects. }
    { eapply H. }
  Defined.

End setoid_ind.

Section setoid_ind_eq.
  Context {A : Type} {R : A -> A -> Prop} (Rwf : well_founded R).
  Context {P : A -> Type}
          (F : forall x : A, (forall y : A, R y x -> P y) -> P x).
  Variable r : forall x : A, P x -> P x -> Prop.

  Variable Pr : forall x, P x -> Prop.

  Hypothesis Hstep
  :  forall (f : forall x y : A, R y x -> P y),
      (** NOTE: this allows us to do multiple unfolds without issue *)
      (forall (x y : A) (p : R y x), r (@f _ _ p) (@F _ (@f _))) ->
      (f = fun x y pf => @Fix_F A R P F _ (Rwf _)) ->
      forall (x : A),
        (forall (y : A) (p : R y x), @Pr y (f _ _ p)) ->
        @Pr x (@F x (@f x)).

  Hypothesis F_respects
  : forall (x : A) (f g : forall y : A, R y x -> P y),
      (forall (y : A) (p : R y x), r (f y p) (g y p)) ->
      r (@F x f) (@F x g).

  Hypothesis Pr_respectful : forall x, Proper (@r x ==> Basics.impl) (@Pr x).

  Theorem Fix_equiv_ind_eq
  : forall x, @Pr x (@Fix A R Rwf P F x).
  Proof.
    refine (@Fix _ _ Rwf (fun x => @Pr x (@Fix A R Rwf P F x))  _).
    intros. eapply Pr_respectful.
    eapply Fix_equiv' with (r:=r).
    eapply F_respects.
    unfold Fix.
    eapply (@Hstep (fun x y pf => @Fix_F A R P F _ (Rwf _))).
    { intros.
      change (Fix_F P F (Rwf y)) with (@Fix _ _ Rwf _ F y).
      eapply Fix_equiv with (r:=r).
      eapply F_respects. }
    { reflexivity. }
    { eapply H. }
  Defined.

End setoid_ind_eq.

Section ind_eq.
  Context {A : Type} {R : A -> A -> Prop} (Rwf : well_founded R).
  Context {P : A -> Type}
          (F : forall x : A, (forall y : A, R y x -> P y) -> P x).
  Variable Pr : forall x, P x -> Prop.

  Hypothesis Hstep
  :  forall (f : forall x y : A, R y x -> P y),
      (** NOTE: this allows us to do multiple unfolds without issue *)
      (forall (x y : A) (p : R y x), (@f _ _ p) = (@F _ (@f _))) ->
      (f = fun x y pf => @Fix_F A R P F _ (Rwf _)) ->
      forall (x : A),
        (forall (y : A) (p : R y x), @Pr y (f _ _ p)) ->
        @Pr x (@F x (@f x)).

  Hypothesis F_respects
  : forall (x : A) (f g : forall y : A, R y x -> P y),
      (forall (y : A) (p : R y x), (f y p) = (g y p)) ->
      (@F x f) = (@F x g).

  Theorem Fix_ind_eq
  : forall x, @Pr x (@Fix A R Rwf P F x).
  Proof.
    eapply Fix_equiv_ind_eq with (r:=fun _ => eq); eauto.
    compute.
    intros. subst. auto.
  Defined.

End ind_eq.

(* TODO Move to FixLib, also try to improve this tactic *)
Create HintDb Proper_Fix.

Ltac wfinduction :=
  match goal with
  | |- context [ @Fix ?A ?R ?WF ?P ?F ] =>
    let Frec := fresh "Frec" in
    let Frec_eq := fresh "Frec_eq" in
    let IHeq := fresh "IHeq" in
    eapply (@Fix_ind_eq A R WF P F);
    [ intros Frec IHeq Frec_eq | eauto with Proper_Fix ]
  end.

(* A version of Fix_eq that is useful when the body of the `Fix` is large.
 *)
Lemma Fix_eq_body
  : forall (A : Type) (R : A -> A -> Prop) (Rwf : well_founded R) (P : A -> Type)
      (F : forall x : A, (forall y : A, R y x -> P y) -> P x),
    (forall (x : A) (f g : forall y : A, R y x -> P y),
        (forall (y : A) (p : R y x), f y p = g y p) -> F x f = F x g) ->
    forall x (PR : P x -> Prop),
      (forall Fix_body, Fix_body = Fix Rwf P F -> PR (F x (fun (y : A) (_ : R y x) => Fix_body y))) ->
      PR (Fix Rwf P F x).
Proof.
  intros. rewrite Fix_eq; eauto.
Defined.
