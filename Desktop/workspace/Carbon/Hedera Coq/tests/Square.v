Require Import Coq.Lists.List.
Require Import Swirlds.Graph.

Require Import Swirlds.SimpleGraphImpl.
Module SG := SimpleGraph Has_EqDec_Nat.
Module Import Ops := GraphOpsDep SG Has_EqDec_Nat.

(* Example: Square **********************************************************

  0 ---> 1
  |      |
 \|/    \|/
  2 ---> 3

*)


Definition squareN := 0::1::2::3::nil.
Definition squareE := fun n m => match n , m with
                              | 0 , 1 => true
                              | 0 , 2 => true
                              | 1 , 3 => true
                              | 2 , 3 => true
                              | _ , _ => false
                              end.

Definition square := SG.mkGraph squareN squareE.

Definition Acyclic_square : SG.Acyclic square :=
  get_acyclic square I.

Definition squareAns n := ancestorsOf square Acyclic_square n.
Eval vm_compute in squareAns 0. (* nil *)
Eval vm_compute in squareAns 1. (* 0 :: nil *)
Eval vm_compute in squareAns 2. (* 0 :: nil *)
Eval vm_compute in squareAns 3. (*  0 :: 1 :: 2 :: nil *)

Definition squareGens n := generationOf square Acyclic_square n.
Eval vm_compute in squareGens 0. (* 0 *)
Eval vm_compute in squareGens 1. (* 1 *)
Eval vm_compute in squareGens 2. (* 1 *)
Eval vm_compute in squareGens 3. (* 2 *)

Definition squareRoots n := aRootOf square Acyclic_square n.
Eval vm_compute in squareRoots 0. (* 0 *)
Eval vm_compute in squareRoots 1. (* 0 *)
Eval vm_compute in squareRoots 2. (* 0 *)
Eval vm_compute in squareRoots 3. (* 0 *)
