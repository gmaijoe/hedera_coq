(* Copyright Swirlds Inc. 2018 *)
Require Import Coq.Bool.Bool.
Require Import Coq.Lists.List.
Require Import Coq.Lists.ListSet.
Require Import Coq.Init.Wf.
Require Coq.Arith.Compare_dec.
Require Import Coq.Classes.Morphisms.
Require Import Coq.omega.Omega.

Require Import Swirlds.Unique.
Require Import Swirlds.Util.
Require Import Swirlds.FixLib.
Require Import Swirlds.Sets.

Require ExtLib.Data.Member.
Require Import ExtLib.Relations.TransitiveClosure.

(* "Axiomatic" Representation of Graphs
 *
 * This interface is implemented in `SimpleGraphImpl.v`.
 *)
Module Type Graph.
  Parameter Node : Type.

  Parameter Graph : Type.

  (* * The Propositional interface
   * This is useful for stating properties.
   *)
  Parameter IsNode : Graph -> Node -> Prop.
  Parameter IsEdge : Graph -> Node -> Node -> Prop.

  Axiom Edge_on_Nodes
  : forall g from to, IsEdge g from to -> IsNode g from /\ IsNode g to.

  Definition Acyclic (G : Graph) : Prop := well_founded (IsEdge G).

  Definition Ancestor (G : Graph) : Node -> Node -> Prop :=
    makeTrans (IsEdge G).

  (* * The dependent interface
   * These definitions expose core operations computationally and
   * combine parts of their specification with their type.
   *)
  Parameter nodes : forall G : Graph, set { n : Node | IsNode G n }.

  Axiom nodes_complete : forall (G : Graph) n,
      IsNode G n -> exists pf : IsNode G n, set_In (@exist _ _ n pf) (nodes G).

  Parameter edges
  : forall G : Graph, set { nn : Node * Node | IsEdge G (fst nn) (snd nn) }.

  Parameter edgesTo
  : forall (g : Graph) (n : Node), set { n' : Node | IsEdge g n' n }.

  Axiom edgesTo_complete : forall g n n',
      IsEdge g n n' ->
      exists pf, set_In (@exist _ _ n pf) (edgesTo g n').

  (* * Non-dependent interface
   * TODO: Explore whether this is easier to use in practice.
   * Note that dependent types break a lot of nice simple abstractions.
   *)

  Parameter nodes' : Graph -> set Node.

  Axiom nodes'_ok : forall g n, set_In n (nodes' g) <-> IsNode g n.

  Axiom nodes'_Unique : forall g, Unique (nodes' g).

  Parameter edges' : Graph -> set (Node * Node).

  Axiom edges'_ok : forall g n, set_In n (edges' g) <-> IsEdge g (fst n) (snd n).

  Parameter edgesTo' : Graph -> Node -> set Node.

  Axiom edgesTo'_sound : forall g n n', set_In n' (edgesTo' g n) -> IsEdge g n' n.
  Axiom edgesTo'_complete : forall g n n', IsEdge g n' n -> set_In n' (edgesTo' g n).

  Parameter Node_eq_dec : forall a b : Node, {a = b} + {a <> b}.

End Graph.


Module Type GraphOps.
  Declare Module G : Graph.
  Import G.

  (** Check whether a graph is acyclic. *)
  Parameter check_acyclic : forall g, option (Acyclic g).

  (** Compute the ancestors of a given node. *)
  Parameter ancestorsOf : forall g : Graph, Acyclic g -> Node -> set Node.

  Axiom ancestorsOf_sound : forall g (acyclic : Acyclic g) n n',
      In n' (ancestorsOf g acyclic n) ->
      Ancestor g n' n.

  Parameter aRootOf : forall g : Graph, Acyclic g -> Node -> Node.

  Axiom aRootOf_no_parents : forall g (acyclic : Acyclic g) n,
      edgesTo g (aRootOf g acyclic n) = nil.

  Axiom generationOf : forall g : Graph, Acyclic g -> Node -> nat.

  Definition isRoot (g : Graph) (n : Node) : Prop :=
    forall n', ~ IsEdge g n' n.

  Axiom generationOf_root : forall g (acyclic : Acyclic g) n,
      isRoot g n -> generationOf g acyclic n = 0.

  Axiom generationOf_edgeTo : forall g (acyclic : Acyclic g) n n',
      IsEdge g n n' ->
      generationOf g acyclic n <= generationOf g acyclic n'.

  (* These definitions are useful for hints *)
  Axiom edgeFromNode : forall g from to, G.IsEdge g from to -> G.IsNode g from.

  Axiom edgeToNode : forall g from to, G.IsEdge g from to -> G.IsNode g to.

  Axiom IsNode_dec : forall g a, {G.IsNode g a} + {~G.IsNode g a}.

  Axiom IsEdge_dec : forall g a b, {G.IsEdge g a b} + {~G.IsEdge g a b}.

  Section quantification.
    Variable g : Graph.

    (* Decidable universal quantification over nodes *)
    Definition allNode (P : Node -> bool) : bool :=
      forallb P (G.nodes' g).

    Axiom allNode_ok : forall p,
        allNode p = true <-> (forall x, G.IsNode g x -> p x = true).

    (* Decidable existential quantification over nodes *)
    Definition exNode (P : Node -> bool) : bool :=
      anyb (List.map P (G.nodes' g)).

    Axiom exNode_ok : forall P b,
        exNode P = b <->
        match b with
        | true => exists n, G.IsNode g n /\ P n = true
        | false => forall n, G.IsNode g n -> P n = false
        end.

    Definition nodeSubset (P : Node -> bool) : list Node :=
      List.filter P (G.nodes' g).

    Global Instance Proper_nodeSubset
    : Proper ((pointwise_relation Node eq) ==> eq) nodeSubset.
    Proof.
      red. red. intros. subst.
      unfold nodeSubset.
      induction (G.nodes' g); simpl; auto.
      rewrite IHs.
      rewrite H. reflexivity.
    Qed.

    Axiom nodeSubset_subset : forall b,
        forall x, In x (nodeSubset b) ->
             G.IsNode g x /\ b x = true.

    Axiom nodeSubset_subset_iff:
      forall (b : Node -> bool) (x : Node),
        In x (nodeSubset b) <-> G.IsNode g x /\ b x = true.

    Axiom exNode_allNode : forall P,
        negb (exNode P) = allNode (fun x => negb (P x)).
  End quantification.

  Axiom IsNode_rightTrans : forall g x y,
      rightTrans (G.IsEdge g) x y ->
      G.IsNode g y.

  Axiom IsNode_rightTrans' : forall g x y,
      rightTrans (G.IsEdge g) y x ->
      G.IsNode g y.

  Axiom edgesTo_nil : forall g x,
      G.edgesTo' g x = nil <->
      G.edgesTo g x = nil.

  Axiom pick_edge : forall g x y (P : _ -> Prop),
      G.IsEdge g x y ->
      (forall pf, P (exist _ x pf)) ->
      exists z, P z /\ In z (G.edgesTo g y).


End GraphOps.

(* TODO: Use EqDec in more places *)
Module Type Has_EqDec.
  Parameter T : Type.
  Parameter EqDec : EqDec T.
End Has_EqDec.


(** Using depenent types *)
Module GraphOpsDep (G : Graph) (ED : Has_EqDec with Definition T := G.Node)
  <: GraphOps with Module G := G.
  Module Import G := G.

  Import ED.

  Lemma In_edgesTo_IsEdge
    : forall g y x, set_In x (edgesTo g y) -> IsEdge g (proj1_sig x) y.
  Proof.
    destruct x; intros; simpl; assumption.
  Defined.

  Section with_acyclic_graph.
    Variable g : Graph.
    Variable Acyclic_g : Acyclic g.

    (* Even though this does recursion on a proof, because of Coq's "singleton elimination" the
       extracted ML/Haskell code is still proof irrelevent. *)
    Definition ancestorsOf : Node -> set Node :=
      @Fix _ _ Acyclic_g (fun _ => set Node)
           (fun n rec => set_unions
                        (map (fun n' : { n' : Node | IsEdge g n' n } =>
                                set_add eq_dec (proj1_sig n') (rec (proj1_sig n') (proj2_sig n'))) (edgesTo g n))).

    Theorem ancestorsOf_sound : forall n n',
        In n' (ancestorsOf n) ->
        Ancestor g n' n.
    Proof.
      unfold ancestorsOf.
      intros n n'.

      (** NOTE: Might want to make a non-dependent version of this. *)
      lazymatch goal with
      | |- context [ @Fix ?A ?R ?WF ?P ?F ] =>
        eapply (@Fix_equiv_ind A R WF P F) with (r := fun _ : Node => @set_eq Node)
      end.
      { unfold Ancestor. intros.
        eapply set_unions_In in H1.
        destruct H1.
        rewrite in_map_iff in H1.
        destruct H1 as [ [ ? [ ? ? ] ] ? ]; subst.
        rewrite set_add_iff in H3.
        destruct H3; subst.
        { left. destruct x1; simpl in *. assumption. }
        { eright.
          2: left; eapply In_edgesTo_IsEdge; eassumption.
          eapply H0; auto.
          eauto using In_edgesTo_IsEdge. } }
      { intros.
        eapply Proper_set_unions.
        (** TODO: this can be made much more generic *)
        induction (edgesTo g x).
        { constructor. }
        { constructor; eauto.
          rewrite H. reflexivity. } }
      { red. red. red. intros.
        eapply H0. eapply H. assumption. }
    Defined.

    Definition aRootOf : Node -> Node :=
      @Fix _ _ Acyclic_g (fun _ => Node)
           (fun n rec =>
              match edgesTo g n with
              | nil => n
              | n' :: _ => rec (proj1_sig n') (proj2_sig n')
              end).

    Theorem aRootOf_no_parents : forall n,
        edgesTo g (aRootOf n) = nil.
    Proof.
      unfold aRootOf.
      intros.
      eapply Fix_ind.
      { intros.
        destruct (edgesTo g x) eqn:?; auto.
        eapply H.
        eapply In_edgesTo_IsEdge. rewrite Heqs. left. tauto. }
      { intros. destruct (edgesTo g x); auto. }
    Defined.

    Definition generationOf : Node -> nat :=
      @Fix _ _ Acyclic_g (fun _ => nat)
           (fun n rec =>
              set_max (map (fun npf => S (rec (proj1_sig npf) (proj2_sig npf))) (edgesTo g n))).

    Definition isRoot (n : Node) : Prop :=
      forall n', ~ IsEdge g n' n.

    Lemma isRoot_edgesTo_nil : forall n, isRoot n -> edgesTo g n = nil.
    Proof.
      intros.
      destruct (edgesTo g n) eqn:?; auto.
      { exfalso. eapply H. eapply (proj2_sig s). }
    Defined.

    Global Instance Proper_map {T U} : Proper (pointwise_relation T eq ==> eq ==> eq) (@map T U).
    Proof.
      unfold Proper, respectful, set_eq, pointwise_relation; simpl; intros.
      subst. eapply map_ext. eauto.
    Defined.

    Global Instance Proper_map' {T U}
    : Proper (pointwise_relation T eq ==> @set_eq T ==> @set_eq U) (@map T U).
    Proof.
      unfold Proper, respectful, set_eq, pointwise_relation; simpl; intros.
      unfold set_In.
      repeat rewrite in_map_iff.
      setoid_rewrite H0. setoid_rewrite H. reflexivity.
    Defined.

    Global Instance Proper_set_eq {T}
    : Proper (set_eq T ==> set_eq T ==> iff) (set_eq T).
    Proof.
      unfold set_eq, Proper, respectful; intros.
      setoid_rewrite H. setoid_rewrite H0. reflexivity.
    Defined.

    Global Instance Proper_S : Proper (eq ==> eq) S.
    Proof.
      compute. destruct 1; reflexivity.
    Defined.

    Theorem generationOf_root : forall n,
        isRoot n -> generationOf n = 0.
    Proof.
      unfold generationOf; intro.
      lazymatch goal with
      | |- context [ @Fix ?A ?R ?WF ?P ?F ] =>
        eapply (@Fix_ind A R WF P F)
      end.
      { intros. rewrite isRoot_edgesTo_nil; eauto. }
      { intros.
        eapply Proper_set_max.
        setoid_rewrite H. reflexivity. }
    Defined.



    Theorem generationOf_edgeTo : forall n n',
        IsEdge g n n' ->
        generationOf n <= generationOf n'.
    Proof.
      unfold generationOf.
      intros.
      rewrite Fix_eq with (x := n').
      { lazymatch goal with
        | |- context [ Fix ?A ?B ?C ] =>
          generalize (Fix A B C)
        end; intro generationOf_.
        destruct (edgesTo_complete _ _ _ H).
        rewrite <- set_max_is_greater.
        Focus 2.
        unfold set_In.
        eapply in_map_iff.
        eexists. split; [ | eassumption ].
        reflexivity. simpl. omega. }
      { intros.
        setoid_rewrite H0. reflexivity. }
    Defined.

  End with_acyclic_graph.


  Section check_Dag.
    Variable g : Graph.

    Section build_Acc.
      Import Member.


      Context {T} {R : T -> T -> Prop} .
      Variable acc : forall t : T, option (Acc R t).

    Fixpoint build_Acc (ls : list T)
    : option (forall x, member x ls -> Acc R x) :=
      match ls as ls return option (forall x, member x ls -> Acc R x) with
      | nil => Some (fun _ pf => match pf in member _ nil with
                               end)
      | l :: ls =>
        match acc l with
        | None => None
        | Some pf =>
          match build_Acc ls with
          | None => None
          | Some pfr => Some (fun x (k : member x (l :: ls)) =>
                               match k in member _ (L :: LS)
                                     return Acc R L -> (forall x, member x LS -> Acc R x) -> Acc R x
                               with
                               | MZ _ _ => fun z _ => z
                               | MN _ m => fun _ z => z _ m
                               end pf pfr)
          end
        end
      end.
    End build_Acc.

    Fixpoint getAcc (n : Node) (ls : list { n : Node | Acc (IsEdge g) n })
    : option (Acc (IsEdge g) n) :=
      match ls with
      | nil => None
      | l :: ls =>
        match eq_dec (proj1_sig l) n with
        | left pf => Some (match pf in _ = X return Acc (IsEdge g) _ -> Acc (IsEdge g) X with
                          | eq_refl => fun x => x
                          end (proj2_sig l))
        | right _ => getAcc n ls
        end
      end.

    Fixpoint IsEdge_to_member (y : Node) (ls : list Node) {struct ls}
      : set_In y ls -> Member.member y ls.
      refine
        match ls as ls return set_In y ls -> Member.member y ls with
        | nil => fun pf => match pf with end
        | l :: ls => fun pf =>
                      match eq_dec y l with
                      | left pf => match pf with
                                  | eq_refl => Member.MZ _ _
                                  end
                      | right _ => Member.MN _ (IsEdge_to_member y ls _)
                      end
        end.
      destruct pf. exfalso. apply n. symmetry; assumption.
      assumption.
    Defined.

    (** NOTE: I should report whether or not I added anything *)
    Fixpoint build_Accs (accs : list { n : Node | Acc (IsEdge g) n })
             (ls : list Node)
    : list { n : Node | Acc (IsEdge g) n }.
    refine
      match ls with
      | nil => accs
      | n :: ls =>
        match getAcc n accs with
        | None =>
          match build_Acc (fun n => getAcc n accs) (edgesTo' g n) with
          | None => build_Accs accs ls
          | Some pf => build_Accs (@exist _ _ n _ :: accs) ls
          end
        | Some _ => build_Accs accs ls
        end
      end.
    { constructor.
      intros.
      eapply pf.
      eapply IsEdge_to_member.
      eapply edgesTo'_complete; assumption. }
    Defined.

    Fixpoint on_nodes (ls : list Node) (accs : list {n : Node | Acc (IsEdge g) n})
    : list {n : Node | Acc (IsEdge g) n} :=
      match ls with
      | nil => accs
      | _ :: ls =>
        on_nodes ls (build_Accs accs (nodes' g))
      end.

    Lemma well_founded_IsEdge_only_Nodes
      : (forall n, IsNode g n -> Acc (IsEdge g) n) -> well_founded (IsEdge g).
    Proof.
      intros. constructor.
      intros.
      destruct (Edge_on_Nodes _ _ _ H0).
      eapply H. assumption.
    Defined.

    Fixpoint get_wf (accs : list { n : Node | Acc (IsEdge g) n }) (ls : set Node)
    : option (forall n, set_In n ls -> Acc (IsEdge g) n).
      refine
        match ls as ls return option (forall n, set_In n ls -> Acc (IsEdge g) n) with
        | nil => Some (fun _ (pf : set_In _ nil) => match pf with end)
        | l :: ls =>
          match getAcc l accs , get_wf accs ls with
          | Some pf , Some pf' => Some (fun x (z  :set_In _ (l :: ls))  =>
                                         match z return Acc (IsEdge g) x with
                                         | or_introl z => match z with
                                                         | eq_refl => fun x => x
                                                         end pf
                                         | or_intror z => pf' _ z
                                         end)
          | _ , _ => None
          end
        end.
    Defined.

    Definition check_acyclic : option (Acyclic g) :=
      match get_wf (on_nodes (nodes' g) nil) (nodes' g) with
      | None => None
      | Some pf =>
        Some (well_founded_IsEdge_only_Nodes (fun n pf' => pf n ltac:(apply nodes'_ok; exact pf')))
      end.

    Definition get_acyclic
    : match check_acyclic with
      | Some _ => True
      | None => False
      end -> Acyclic g.
    Proof.
      intro.
      apply (guard (length (nodes g))).
      abstract (destruct check_acyclic; [ assumption | destruct H ]).
    Defined.

  End check_Dag.

  (* These definitions are useful for hints *)
  Lemma edgeFromNode : forall g from to, G.IsEdge g from to -> G.IsNode g from.
  Proof. intros. eapply G.Edge_on_Nodes in H; tauto. Defined.
  Lemma edgeToNode : forall g from to, G.IsEdge g from to -> G.IsNode g to.
  Proof. intros. eapply G.Edge_on_Nodes in H; tauto. Defined.

  Definition IsNode_dec : forall g a, {G.IsNode g a} + {~G.IsNode g a}.
  Proof.
    intros.
    destruct (In_dec Node_eq_dec  a (G.nodes' g)).
    { left. eapply G.nodes'_ok. apply i. }
    { right. rewrite <- G.nodes'_ok. apply n. }
  Defined.

  Definition Edge_dec : forall a b : Node * Node, {a = b} + {a <> b}.
  Proof.
    generalize Node_eq_dec.
    decide equality.
  Defined.

  Definition IsEdge_dec : forall g a b, {G.IsEdge g a b} + {~G.IsEdge g a b}.
  Proof.
    intros.
    destruct (In_dec Edge_dec (a,b) (G.edges' g)).
    { left. eapply (@edges'_ok g (a,b)). exact i. }
    { right. intro. apply n. eapply (@edges'_ok g (a,b)). exact H. }
  Defined.

  Lemma edgesTo_nil : forall g x,
      G.edgesTo' g x = nil <->
      G.edgesTo g x = nil.
  Proof.
    intros.
    destruct (G.edgesTo' g x) eqn:?; split; try congruence.
    { intros.
      destruct (G.edgesTo g x); auto.
      exfalso.
      destruct s. eapply G.edgesTo'_complete in i.
      rewrite Heqs in i.
      apply i. }
    { intros. exfalso.
      assert (In n (G.edgesTo' g x)).
      { rewrite Heqs; firstorder. }
      eapply G.edgesTo'_sound in H0.
      eapply G.edgesTo_complete in H0.
      rewrite H in H0.
      destruct H0. apply H0. }
  Qed.

  Lemma pick_edge : forall g x y (P : _ -> Prop),
      G.IsEdge g x y ->
      (forall pf, P (exist _ x pf)) ->
      exists z, P z /\ In z (G.edgesTo g y).
  Proof.
    intros.
    eapply G.edgesTo_complete in H.
    destruct H.
    exists (exist _ x x0).
    split; eauto.
  Qed.

  Create HintDb graph discriminated.
  Hint Resolve edgeToNode edgeFromNode : graph.

  Lemma IsNode_rightTrans : forall g x y,
      rightTrans (G.IsEdge g) x y ->
      G.IsNode g y.
  Proof.
    induction 1; eauto with graph.
  Qed.

  Lemma IsNode_rightTrans' : forall g x y,
      rightTrans (G.IsEdge g) y x ->
      G.IsNode g y.
  Proof.
    induction 1; eauto with graph.
  Qed.

  Hint Resolve IsNode_rightTrans IsNode_rightTrans' : graph.

  Section quantification.
    Variable g : Graph.

    (* Decidable universal quantification over nodes *)
    Definition allNode (P : Node -> bool) : bool :=
      forallb P (G.nodes' g).

    Lemma allNode_ok : forall p,
        allNode p = true <-> (forall x, G.IsNode g x -> p x = true).
    Proof.
      clear. intros.
      unfold allNode.
      rewrite forallb_forall.
      setoid_rewrite <- G.nodes'_ok. reflexivity.
    Qed.

    (* Decidable existential quantification over nodes *)
    Definition exNode (P : Node -> bool) : bool :=
      anyb (List.map P (G.nodes' g)).

    Lemma exNode_ok : forall P b,
        exNode P = b <->
        match b with
        | true => exists n, G.IsNode g n /\ P n = true
        | false => forall n, G.IsNode g n -> P n = false
        end.
    Proof.
      unfold exNode; intros.
      destruct b; simpl.
      { intros.
        rewrite anyb_true_iff.
        rewrite in_map_iff.
        eapply Morphisms_Prop.ex_iff_morphism. red. intros.
        rewrite G.nodes'_ok. tauto. }
      { rewrite anyb_false_iff.
        setoid_rewrite in_map_iff.
        setoid_rewrite G.nodes'_ok.
        split; intros.
        - destruct (P n) eqn:?; auto.
          exfalso. apply H. eexists; split; eauto.
        - intro. destruct H0 as [ ? [ ? ? ] ].
          apply H in H1. congruence. }
    Defined.

    Definition nodeSubset (P : Node -> bool) : list Node :=
      List.filter P (G.nodes' g).

    Global Instance Proper_nodeSubset
    : Proper ((pointwise_relation Node eq) ==> eq) nodeSubset.
    Proof.
      red. red. intros. subst.
      unfold nodeSubset.
      induction (G.nodes' g); simpl; auto.
      rewrite IHs.
      rewrite H. reflexivity.
    Qed.

    Lemma nodeSubset_subset : forall b,
        forall x, In x (nodeSubset b) ->
             G.IsNode g x /\ b x = true.
    Proof.
      unfold nodeSubset. intros.
      eapply filter_In in H.
      rewrite G.nodes'_ok in H. assumption.
    Defined.

    Lemma nodeSubset_subset_iff:
      forall (b : Node -> bool) (x : Node),
        In x (nodeSubset b) <-> G.IsNode g x /\ b x = true.
    Proof.
      unfold nodeSubset. intros.
      rewrite filter_In.
      rewrite G.nodes'_ok. reflexivity.
    Qed.

    Theorem exNode_allNode : forall P,
        negb (exNode P) = allNode (fun x => negb (P x)).
    Proof.
      intros.
      unfold exNode, allNode.
      induction (G.nodes' g); simpl; auto.
      rewrite negb_orb. rewrite IHs. reflexivity.
    Defined.

  End quantification.

End GraphOpsDep.

Module Has_EqDec_Nat.
  Definition T : Type := nat.

  Definition EqDec : EqDec T.
    constructor. decide equality.
  Defined.

  Definition T_dec : forall a b : nat, {a = b} + {a <> b}.
    decide equality.
  Defined.
End Has_EqDec_Nat.
