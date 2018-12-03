(* Copyright Swirlds Inc. 2018 *)
(**
 ** This file defines a simple implementation of graphs.
 **)
Require Import Coq.Lists.List.
Require Import Coq.Lists.ListSet.
Require Import Coq.Logic.Eqdep_dec.

Require ExtLib.Data.Member.
Require Import ExtLib.Relations.TransitiveClosure.

Require Import Swirlds.Unique.
Require Import Swirlds.Graph.
Require Import Swirlds.Sets.
Require Import Swirlds.Util.
Require Import Swirlds.FixLib.

Lemma exists_flip : forall T U (F : T -> U -> Prop),
    (exists x, exists y, F x y) <-> (exists y, exists x, F x y).
Proof. firstorder. Defined.

Lemma exists_sig : forall T (P : T -> Prop) (Q : { x : T | P x } -> Prop),
    (exists x y, Q (@exist _ _ x y)) -> (exists y, Q y).
Proof.
  intros.
  destruct H. destruct H. eexists; eassumption.
Defined.

Lemma exists_and : forall (P Q : Prop) (Z : P /\ Q -> Prop),
    (exists x y, Z (conj x y)) -> (exists y, Z y).
Proof.
  intros.
  destruct H. destruct H. eexists; eassumption.
Defined.

Global Instance EqDec_bool : EqDec bool.
Proof. constructor. decide equality. Defined.


(** Move above *)


Module SimpleGraph (DT : Has_EqDec)
  <: Graph with Definition Node := DT.T.

  Definition Node : Type := DT.T.

  Definition Node_eq_dec : forall a b : Node, {a = b} + {a <> b} :=
    eq_dec.

  Record Graph' := mkGraph
  { _nodes : set Node
  ; _edges : Node -> Node -> bool
  }.

  Definition Graph : Type := Graph'.

  (* * The Propositional interface
   * This is useful for stating properties.
   *)
  Definition IsNode (g : Graph) (n : Node) : Prop := set_In n g.(_nodes).
  Definition IsEdge (g : Graph) (from to : Node) : Prop :=
    IsNode g from /\ IsNode g to /\ g.(_edges) from to = true.

  Theorem Edge_on_Nodes : forall g from to, IsEdge g from to -> IsNode g from /\ IsNode g to.
  Proof.
    unfold IsEdge; intros; tauto.
  Defined.

  Definition Acyclic (G : Graph) : Prop := well_founded (IsEdge G).

  Definition Ancestor (G : Graph) : Node -> Node -> Prop :=
    makeTrans (IsEdge G).

  (* * The dependent interface
   * These definitions expose core operations computationally and
   * combine parts of their specification with their type.
   *)
  Definition nodes (g : Graph) : set { n : Node | IsNode g n } :=
    with_prop (IsNode g) g.(_nodes) (fun _ pf => pf).

  Theorem nodes_complete
  : forall (G : Graph) n,
      IsNode G n -> exists pf : IsNode G n, set_In (@exist _ _ n pf) (nodes G).
  Proof.
    destruct G; unfold IsNode, set_In, nodes, IsNode, set_In; simpl.
    intros.
    rewrite with_prop_with_In.
    setoid_rewrite in_map_iff.
    eapply In_with_In in H.
    destruct H.
    do 2 eexists; split; [ | eassumption ].
    reflexivity.
  Defined.

  Definition edges (g : Graph)
  : set { nn : Node * Node | IsEdge g (fst nn) (snd nn) } :=
    let ns := nodes g in
    filter_map (fun '(l,r) =>
                  match g.(_edges) (proj1_sig l) (proj1_sig r) as Z
                        return g.(_edges) (proj1_sig l) (proj1_sig r) = Z -> _
                  with
                  | true => fun pf => Some (@exist _ _ (proj1_sig l, proj1_sig r) (conj (proj2_sig l) (conj (proj2_sig r) pf)))
                  | false => fun _ => None
                  end eq_refl) (set_prod ns ns).

  Definition edgesTo (g : Graph) (n : Node) : set { n' : Node | IsEdge g n' n } :=
    match in_dec eq_dec n g.(_nodes) with
    | left pf_IsNode =>
      filter_map (fun from =>
                    match g.(_edges) (proj1_sig from) n as Z
                         return g.(_edges) (proj1_sig from) n = Z ->
                                option { n' : Node | IsEdge g n' n }
                   with
                   | true => fun pf => Some (@exist _ _ (proj1_sig from) (conj (proj2_sig from) (conj pf_IsNode pf)))
                   | false => fun _ => None
                   end eq_refl) (nodes g)
    | right _ => nil
    end.


  (* NOTE: This proof is much more painful than one would like.
   * Perhaps there is a better way to approach it? Or perhaps this indicates
   * that the non-dependent representation is cleaner?
   *)
  Theorem edgesTo_complete : forall g n n',
      IsEdge g n n' ->
      exists pf, set_In (@exist _ _ n pf) (edgesTo g n').
  Proof.
    unfold IsEdge.
    unfold edgesTo.
    intros.
    destruct (in_dec eq_dec n' (_nodes g)); [ | exfalso; tauto ].
    { unfold set_In. setoid_rewrite in_filter_map_iff.
      rewrite exists_flip.
      eapply exists_sig.
      exists n. simpl.
      generalize (@eq_refl bool (_edges g n n')).
      destruct H. destruct H0.
      unfold IsEdge.
      eapply nodes_complete in H.
      destruct H. exists x.
      eapply exists_and.
      exists x.
      eapply exists_and.
      exists i.
      clear - H1 H.
      exists H1.
      split; [ | assumption ].
      revert e. revert H1.
      change (
          (let F := (fun z => _edges g z n') in
           forall (H1 : F n = true) (e : F n = _edges g n n'),
             (if _edges g n n' as Z
                 return
                 (F n = Z ->
                  option {n'0 : Node | IsNode g n'0 /\ IsNode g n' /\ F n'0 = true})
              then
                fun pf : F n = true =>
                  Some
                    (exist (fun n'0 : Node => IsNode g n'0 /\ IsNode g n' /\ F n'0 = true) n
                           (conj x (conj i pf)))
              else fun _ : F n = false => None) e =
             Some
               (exist (fun n'0 : Node => IsNode g n'0 /\ IsNode g n' /\ F n'0 = true) n
                      (conj x (conj i H1))))).
      intro F.
      clearbody F.
      destruct (_edges g n n').
      { intros.
        repeat f_equal.
        eapply Eqdep_dec.UIP_dec.
        decide equality. }
      { intros. congruence. } }
  Defined.


  (* * Non-dependent interface
   * TODO: Explore whether this is easier to use in practice.
   * Note that dependent types break a lot of nice simple abstractions.
   *)

  Definition nodes' (g : Graph) : set Node :=
    uniqueBy (fun x => x) eq_dec (map (@proj1_sig _ _) (nodes g)).

  Theorem nodes'_ok : forall g n, set_In n (nodes' g) <-> IsNode g n.
  Proof.
    intros.
    unfold set_In, nodes'.
    split.
    { intros. eapply uniqueBy_subset in H.
      eapply in_map_iff in H.
      destruct H. destruct x. destruct H. simpl in *. subst; auto. }
    { intros. red in H.
      unfold nodes.
      rewrite with_prop_with_In.
      rewrite map_map. simpl.
      rewrite <- uniqueBy_id.
      rewrite in_map_iff.
      eapply exists_sig.
      exists n. simpl.
      destruct (@In_with_In _ _ _ H).
      eexists. split; [ reflexivity | ].
      eassumption. }
  Defined.

  Theorem nodes'_Unique : forall g, Unique (nodes' g).
  Proof.
    intros. eapply Unique_uniqueBy.
  Qed.

  Definition edges' (g : Graph) : set (Node * Node) :=
    map (@proj1_sig _ _) (edges g).


  Theorem edges'_ok : forall g n, set_In n (edges' g) <-> IsEdge g (fst n) (snd n).
  Proof.
    split.
    { unfold set_In, edges'.
      intros.
      eapply in_map_iff in H. destruct H as [ ? [ ? ? ] ].
      subst. destruct x. apply i. }
    { intros.
      eapply in_map_iff.
      unfold edges.
      setoid_rewrite in_filter_map_iff.
      unfold set_prod.
      eapply exists_sig. exists n.
      simpl.
      destruct H as [ ? [ ? ? ] ].
      eapply nodes_complete in H. destruct H as [ pff ? ].
      eapply nodes_complete in H0. destruct H0 as [ pfs ? ].
      unfold IsEdge.
      eexists (conj pff (conj pfs H1)).
      split; [ reflexivity | ].
      exists (@exist _ _ _ pff, @exist _ _ _ pfs); simpl.
      split.
      { unfold IsEdge.
        generalize (@eq_refl _ (_edges g (fst n) (snd n))).
        revert H1.
        destruct n; simpl in *.
        generalize (exist
       (fun x : Node * Node =>
        IsNode g (fst x) /\ IsNode g (snd x) /\ _edges g (fst x) (snd x) = true)
       (n, n0)); simpl.
        destruct (_edges g n n0).
        { intros. repeat f_equal.
          eapply UIP_dec.
          eapply eq_dec. }
        { congruence. } }
      { eapply in_prod_iff. tauto. } }
  Defined.

  Definition edgesTo' (g : Graph) (n : Node) : set Node :=
    map (@proj1_sig _ _) (edgesTo g n).

  Theorem edgesTo'_sound : forall g n n', set_In n' (edgesTo' g n) -> IsEdge g n' n.
  Proof.
    unfold edgesTo'.
    intros.
    rewrite in_map_iff in H. destruct H. destruct x.
    destruct H; subst. eauto.
  Defined.

  Theorem edgesTo'_complete : forall g n n', IsEdge g n' n -> set_In n' (edgesTo' g n).
  Proof.
    intros.
    eapply edgesTo_complete in H. destruct H.
    unfold edgesTo', set_In.
    rewrite in_map_iff. eexists; split; [ | eassumption ].
    reflexivity.
  Defined.

(*
  Parameter edgesFrom' : Graph -> Node -> list Node.

  Axiom edgesFrom_sound : forall g n n', set_In n' (edgesFrom' g n) -> IsEdge g n n'.
  Axiom edgesFrom_complete : forall g n n', IsEdge g n n' -> set_In n' (edgesFrom' g n).
*)

End SimpleGraph.
