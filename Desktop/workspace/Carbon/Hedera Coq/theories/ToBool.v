(* Copyright Swirlds Inc. 2018 *)
Require Import Coq.Bool.Bool.
Require Import Coq.Logic.Eqdep_dec.

Section to_bool.
  Context {T : Type}.
  Variable dec : forall x y : T, {x = y} + {x <> y}.

  Definition to_bool (x y : T) : bool :=
    if dec x y then true else false.

  Theorem dec_refl : forall x, dec x x = left eq_refl.
  Proof.
    intros. destruct (dec x x); try congruence.
    f_equal. eapply UIP_dec; auto.
  Qed.

  Theorem to_bool_refl : forall x, to_bool x x = true.
  Proof. unfold to_bool. intros. destruct (dec x x); auto. Defined.

  Theorem to_bool_eq : forall x y, to_bool x y = true <-> x = y.
  Proof. unfold to_bool. intros. destruct (dec x y); try tauto.
         split; congruence.
  Defined.

  Theorem reflect_to_bool : forall x y, reflect (x = y) (to_bool x y).
  Proof.
    unfold to_bool; intros.
    destruct (dec x y); constructor; auto.
  Defined.
End to_bool.