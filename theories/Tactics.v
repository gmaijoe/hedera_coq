(* Copyright Swirlds Inc. 2018 *)
Require Import Coq.Bool.Bool.

Ltac cutAt H :=
  match type of H with
  | ?P -> ?Q =>
    let H' := fresh in
    cut P; [ intro H' ; specialize (H H') | clear H ]
  end.
Ltac assertAt H :=
  match type of H with
  | ?P -> ?Q =>
    let H' := fresh in
    assert P as H'; [ clear H | specialize (H H') ]
  end.

Ltac shatter H :=
  try lazymatch type of H with
      | exists x, _=> let H' := fresh in
                destruct H as [ ? H' ]; shatter H'
      | _ /\ _ => let H' := fresh in
                let H'' := fresh in
                destruct H as [ H' H'' ]; shatter H' ; shatter H''
      end.

Ltac to_prop :=
  repeat match goal with
         | H : context [ _ && _ = true ] |- _ =>
           setoid_rewrite andb_true_iff in H
         | H : context [ _ && _ = false ] |- _ =>
           setoid_rewrite andb_false_iff in H
         | H : context [ negb _ = true ] |- _ =>
           setoid_rewrite negb_true_iff in H
         | H : context [ negb _ = false ] |- _ =>
           setoid_rewrite negb_false_iff in H
         end.
