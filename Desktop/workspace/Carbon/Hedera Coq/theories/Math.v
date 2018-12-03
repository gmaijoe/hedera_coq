(* Copyright Swirlds Inc. 2018 *)
Require Import Coq.omega.Omega.

(** Math proofs **)
Opaque Nat.div Nat.modulo.

Lemma mod_div_0 : forall a b, b <> 0 -> a mod b / b = 0.
Proof using. clear.
             intros.
             apply Nat.div_small.
             apply Nat.mod_upper_bound. assumption.
Defined.


Lemma n_div_m : forall n m, m <> 0 ->
                       n = (n / m) * m + n mod m.
Proof using. clear.
             intros.
             generalize (Nat.div_mod n m H). intros.
             rewrite Nat.mul_comm. omega.
Defined.

Lemma div_add_strong : forall a b c : nat,
    c <> 0 ->
    (a + b) / c = a / c + b / c + (a mod c + b mod c) / c.
Proof.
  intros.
  rewrite (n_div_m a c ltac:(assumption)).
  generalize (a / c); intros.
  cutrewrite (n * c + a mod c + b = (a mod c + b) + n * c); [ | omega ].
  rewrite Nat.div_add by assumption.
  cutrewrite (n * c + a mod c = a mod c + n * c); [ | omega ].
  rewrite Nat.div_add by assumption.
  repeat rewrite mod_div_0 by assumption.
  cutrewrite ((a mod c + n * c) mod c = a mod c);
    [ |
      rewrite Nat.mod_add by assumption;
      rewrite Nat.mod_mod by assumption; reflexivity ].
  simpl.
  rewrite (n_div_m b c ltac:(assumption)) at 1 2.
  cutrewrite (a mod c + (b / c * c + b mod c) = (a mod c + b mod c) + b / c * c); [ | omega ].
  rewrite Nat.div_add by assumption.
  rewrite Nat.div_add_l by assumption.
  repeat rewrite mod_div_0 by assumption. omega.
Defined.


Lemma n_div_3 : forall n, exists m,
      (n / 3 = m /\ 2 * n / 3 = m + m /\ n = m + m + m) \/
      (n / 3 = m /\ 2 * n / 3 = m + m /\ n = m + m + m + 1) \/
      (n / 3 = m /\ 2 * n / 3 = 1 + m + m /\ n = m + m + m + 2).
Proof.
  intros.
  generalize (Nat.div_mod n 3 ltac:(omega)); intros.
  generalize (Nat.mod_upper_bound n 3 ltac:(omega)); intros.
  exists (n / 3).
  simpl.
  cutrewrite (n + 0 = n) ; [ | omega ].
  destruct (n mod 3) eqn:?.
  { left.
    split; [ reflexivity | ].
    simpl in *.
    split; [ | omega ].
    rewrite div_add_strong by omega.
    rewrite Heqn0.
    simpl.
    rewrite Nat.div_0_l by omega. omega. }
  destruct n0.
  { right. left.
    split; [ reflexivity | ].
    rewrite div_add_strong by omega.
    rewrite Heqn0. simpl.
    cutrewrite (2 / 3 = 0); [ | reflexivity ].
    split; omega. }
  { assert (n0 = 0). omega.
    subst. clear H0.
    right; right.
    rewrite div_add_strong by omega.
    rewrite Heqn0.
    cutrewrite ((2 + 2) / 3 = 1) ; [ | reflexivity ].
    split; omega. }
Defined.

Ltac div_cases n :=
  let H := fresh in
  destruct (n_div_3 n) as [ ? [ H | [ H | H ] ] ];
  let H1 := fresh in
  let H2 := fresh in
  let H0 := fresh in
  destruct H as [ H0 [ H1 H2 ] ];
  repeat rewrite H0 in *; repeat rewrite H1 in *; repeat rewrite H2 in *;
  clear H0 H1 H2.
