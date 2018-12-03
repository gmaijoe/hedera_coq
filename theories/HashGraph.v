(* Copyright Swirlds Inc. 2018 *)
Require Import Coq.Lists.List.
Require Import Coq.Bool.Bool.

Require Import ExtLib.Relations.TransitiveClosure.
Require Import ExtLib.Recur.Relation.

Require Import Swirlds.Unique.
Require Import Swirlds.Graph.
Require Import Swirlds.Util.
Require Import Swirlds.Math.
Require Import Swirlds.Lemmas.

Inductive IsProj1 {T} {P : T -> Prop} : { x : T | P x } -> T -> Prop :=
| IsProj1' : forall x pf, @IsProj1 T P (exist _ x pf) x.

Inductive hRoption {T U} (R : T -> U -> Prop) : option T -> option U -> Prop :=
| hRoption_None : hRoption R None None
| hRoption_Some : forall x y, R x y -> hRoption R (Some x) (Some y).


(* TODO: This needs to be factored into the set of definitions and
 * the derived facts about them.
 *)
Module Type HashGraph.
  Declare Module G : Graph.
  Declare Module GO : GraphOps with Module G := G.

  (** The types of values *)
  Parameters Payload Hash Creator Signature : Set.
  Parameter Time : Set.
  Parameter middleBit : Signature -> nat.

  Definition E := G.Node.

  Parameter FrequencyOfCoinRounds : nat.

  Parameter E_eqb : E -> E -> bool.

  Axiom E_eqb_ok : forall a b, E_eqb a b = true <-> a = b.

  Theorem E_dec : forall a b : E, {a = b} + {a <> b}.
  Proof.
    intros. destruct (E_eqb a b) eqn:?.
    left. apply E_eqb_ok. assumption.
    right. intro.
    subst.
    rewrite (proj2 (E_eqb_ok b b)) in Heqb0. congruence. reflexivity.
  Defined.

  Parameter data : E -> Payload.
  Parameter hashes : E -> list Hash.
  Parameter time : E -> Time.
  Parameter creator : E -> Creator.
  Parameter signature : E -> Signature.

  Parameter eqb_creator : Creator -> Creator -> bool.
  Axiom eqb_creator_sound : forall a b, eqb_creator a b = true <-> a = b.

  Lemma eqb_creator_refl : forall a, eqb_creator a a = true.
  Proof. intros.
         rewrite (proj2 (eqb_creator_sound a a) eq_refl).
         reflexivity.
  Defined.

  Definition Creator_dec (a b : Creator) : {a = b} + {a <> b}.
  Proof.
    intros.
    destruct (eqb_creator a b) eqn:?.
    - left. eapply eqb_creator_sound. assumption.
    - right. intro. subst. rewrite eqb_creator_refl in Heqb0. congruence.
  Defined.

  Parameter allCreators : list Creator.
  Axiom Unique_allCreators : Unique allCreators.
  Axiom allCreators_complete : forall x, In x allCreators.

  (* NOTE: This is not stated explicitly in the technical report *)
  Axiom moreThan1Creator : length allCreators > 1.

  Create HintDb graph discriminated.
  Hint Resolve GO.edgeToNode GO.edgeFromNode : graph.
  Hint Resolve GO.IsNode_rightTrans GO.IsNode_rightTrans' : graph.

  Section self_parent.
    Variable g : G.Graph.

    Definition selfParent (n : E) : option E :=
      let ns := G.edgesTo' g n in
      match filter (fun n' => eqb_creator (creator n) (creator n')) ns with
      | x :: nil => Some x
      | _ => None
      end.

    Theorem selfParent_is_self : forall n n',
        selfParent n = Some n' ->
        creator n = creator n' /\ G.IsEdge g n' n.
    Proof.
      unfold selfParent.
      intros.
      destruct (filter (fun n' : E => eqb_creator (creator n) (creator n')) (G.edgesTo' g n)) eqn:?; try congruence.
      inversion H; clear H; subst.
      destruct l; inversion H1; subst.

      assert (In n' (filter (fun n' : E => eqb_creator (creator n) (creator n')) (G.edgesTo' g n))).
      { rewrite Heql. left; reflexivity. }
      clear Heql.
      eapply filter_In in H.
      destruct H.
      split.
      { eapply eqb_creator_sound in H0. assumption. }
      { eapply G.edgesTo'_sound in H. assumption. }
    Defined.

    Lemma IsEdge_selfParent : forall {a b : E},
        Some b = selfParent a -> G.IsEdge g b a.
    Proof.
      intros. symmetry in H.
      eapply selfParent_is_self in H. tauto.
    Defined.

    Definition selfParent_edge (x : E) : option { y : E | G.IsEdge g y x } :=
      match selfParent x as X return X = selfParent x -> _ with
      | None => fun _ => None
      | Some v => fun pf => Some (exist _ v (IsEdge_selfParent pf))
      end eq_refl.

    Theorem selfParent_edge_selfParent : forall x,
        @hRoption _ _ (@IsProj1 _ _) (selfParent_edge x) (selfParent x).
    Proof.
      unfold selfParent_edge. intros.
      generalize dependent (@eq_refl _ (selfParent x)).
      generalize (@IsEdge_selfParent x).
      destruct (selfParent x); simpl; intros; constructor.
      constructor.
    Qed.

  End self_parent.

  Hint Resolve IsEdge_selfParent : graph.

End HashGraph.