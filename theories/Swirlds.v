(* Copyright Swirlds Inc. 2018 *)
(** * The Swirlds Hashgraph Consensus Algorithm

---

  To read the formalism, you should read the files in the following
  order.

  - [Swirlds.HashGraph]
  - [Swirlds.Definitions]
  - [Swirlds.See]
  - [Swirlds.Round]
  - [Swirlds.Voting]
  - [Swirlds.Swirlds]
 *)
Require Import Coq.Lists.List.
Require Import Coq.Bool.Bool.
Require Import Coq.Classes.Morphisms.
Require Import Coq.omega.Omega.
Require Import Coq.Sorting.Permutation.
Require Coq.QArith.QArith.
Require Import Coq.Logic.Eqdep_dec.
Require Import Psatz.

Require Import ExtLib.Relations.TransitiveClosure.
Require Import ExtLib.Recur.Relation.
Require Import ExtLib.Recur.GenRec.
Require Import ExtLib.Recur.Facts.
Require Import ExtLib.Recur.Measure.

Require Import Swirlds.ToBool.
Require Import Swirlds.FixLib.
Require Import Swirlds.Pigeon.
Require Import Swirlds.Graph.
Require Import Swirlds.Util.
Require Import Swirlds.Math.
Require Import Swirlds.Lemmas.
Require Import Swirlds.HashGraph.
Require Import Swirlds.Sets.
Require Import Swirlds.Unique.
Require Import Swirlds.Tactics.
Require Import Swirlds.Definitions.
Require Import Swirlds.Voting.

Module Swirlds (HG : HashGraph).
  Import HG.GO.
  Import HG.
  Module VOTE := Voting HG.
  Import VOTE.ROUND.SEE.DEFS.
  Import VOTE.ROUND.SEE.
  Import VOTE.ROUND.
  Import VOTE.

  Existing Class G.Acyclic.

  Hint Resolve IsEdge_selfParent IsNode_selfAncestor IsNode_selfAncestor' IsNode_consistent_selfParent IsNode_Ancestor IsNode_Ancestor' : graph.
  Hint Resolve IsNode_rightTrans IsNode_rightTrans' : graph.

  Existing Instance views_are_acyclic.

  Existing Class viewOf.

  Section theorems.
    Variables AB A B : G.Graph.
    Context {Acyclic_AB : G.Acyclic AB}.
    Hypothesis HviewA : viewOf AB A.
    Hypothesis HviewB : viewOf AB B.

    (*
     * Event x in round r sends a vote v about y to event z in round r+1 if and only if
     * x votes v about y and z strongly sees x.
     *)
    Definition sendVote (g : G.Graph) {Acyclic_g : G.Acyclic g} (x z y : E) (v : bool) : Prop :=
      vote g x y = v /\ StronglySee g z x.

    Variable Hhonest : MostHonest AB.

    Lemma consistent_viewOf : forall a b, viewOf a b -> consistent b a.
    Proof. symmetry. apply H. Qed.


    (* Lemma 5.14. If hashgraphs A and B are consistent, and the algorithm running
     * on A shows that a round r event by member m0 sends a vote vA to member m1 in
     * round r + 1, and the algorithm running on B shows that a round r event by member
     * m0 sends a vote vB to an event by member m1 in round r + 1, then vA = vB .
     *)

    (* Lemma 5.14 (revised). If hashgraphs A and B are consistent, and the
     * algorithm running on A shows that a round r witness by member m0 sends a
     * vote vA to a witness by member m1 in round r + 1, and the algorithm
     * running on B shows that a round r witness by member m0 sends a vote vB to
     * n witness by member m1 in round r + 1, then vA = vB.
     *)
    Theorem Consistent_Voting
    : forall r m0 vA vB z
        (NAz : G.IsNode A z) (NBz : G.IsNode B z),
        (exists a b : E,
            G.IsNode A a /\ G.IsNode A b /\
            (* Witness A a /\ *) round A a = r /\ m0 = creator a /\
            (* Witness A b /\ round A b = r + 1 /\ m1 = creator b /\ *)
            sendVote A a b z vA) ->
        (exists a b : E,
            G.IsNode B a /\ G.IsNode B b /\
            (* Witness B a /\ *) round B a = r /\ m0 = creator a /\
            (* Witness B b /\ round B b = r + 1 /\ m1 = creator b /\ *)
            sendVote B a b z vB) ->
        vA = vB.
    Proof.
      intros.
      destruct H as [ Aa [ Ab [ NAa [ NAb ? ] ] ] ].
      destruct H0 as [ Ba [ Bb [ NBa [ NBb ? ] ] ] ].
      shatter H.
      shatter H0.
      subst.

      destruct H3 as [ ? HAsee ].
      destruct H5 as [ ? HBsee ].
      subst.

      assert (~Forked AB Ba Aa) as HForked.
      { (* by the strongly seeing lemma *)
        intro.
        eapply Strongly_Seeing in H.
        6: eexists; eassumption.
        eapply H. eexists; eassumption.
        all: eauto using IsNode_StronglySee' with typeclass_instances. }
      eapply not_Forked in HForked; eauto.
      destruct HForked; try congruence.
      intros.
      erewrite consistent_vote with (l:=A) (r:=AB);
        eauto using consistent_viewOf, IsNode_viewOf, IsNode_StronglySee, IsNode_StronglySee'.
      erewrite consistent_vote with (l:=B) (r:=AB);
        eauto using consistent_viewOf, IsNode_viewOf, IsNode_StronglySee, IsNode_StronglySee'.
      destruct H.
      { symmetry; eapply single_source_of_vote; eauto.
        erewrite consistent_round with (l:=AB)(r:=B);
          eauto using consistent_viewOf, IsNode_viewOf, IsNode_StronglySee, IsNode_StronglySee'.
        erewrite consistent_round with (l:=AB)(r:=A);
          eauto using consistent_viewOf, IsNode_viewOf, IsNode_StronglySee, IsNode_StronglySee'.
        eapply HviewA. eapply HviewB. }
      { eapply single_source_of_vote; eauto.
        erewrite consistent_round with (l:=AB)(r:=A);
          eauto using consistent_viewOf, IsNode_viewOf, IsNode_StronglySee, IsNode_StronglySee'.
        erewrite consistent_round with (l:=AB)(r:=B);
          eauto using consistent_viewOf, IsNode_viewOf, IsNode_StronglySee, IsNode_StronglySee'.
        eapply HviewB. eapply HviewA. }
    Qed.




    (* Lemma 5.15. If hashgraphs A and B are consistent, and A decides a
     * Byzantine agreement election with result v in round r and B has not
     * decided prior to r, then B will decide v in round r + 2 or before.
     *)
    Theorem thm515
    : forall r x y v,
        round A x = r ->
        decide A x y = true -> vote A x y = v ->
        (exists z, G.IsNode B z /\ round B z = r + 2) ->
        exists w, round B w <= r + 2 /\ decide B w y = true /\ vote B w y = v.
    Proof.
    Abort. (* TODO *)

    (* Theorem 5.16. For any single YES/NO question, consensus is achieved
     * eventually with probability 1.
     *)
    Theorem thm516 :  True.
    Proof.
      (* NOTE: This is a placeholder for this theorem since we don't have
       * proabability formalized appropriately yet.
       *)
    Abort. (* Place holder *)

    (* Lemma 5.17. For any round number r, for any hashgraph that has at least
     * one event in round r +3, there will be at least one witness in round r
     * that will be decided to be famous by the consensus algorithm, and this
     * decision will be made by every witness in round r + 3, or earlier.
     *)
    Theorem thm517
    : forall r, r > 0 ->
        (exists x, round A x = r + 3) ->
        exists x, Witness A x
           /\ round A x = r
           /\ Famous A x
           /\ (forall y,
                 Witness A y ->
                 round A y = r + 3 ->
                 decide A x y = true /\ vote A x y = true).
    Proof.
    Abort. (* TODO *)

    (* A has exactly one more node than B *)
    Definition ExtendsByOne (A B : G.Graph) (x : E) : Prop :=
      G.IsNode A x /\ ~G.IsNode B x /\
      forall y, G.IsNode A y -> ~G.IsNode B y -> x = y.

    (* Lemma 5.18. If hashgraph A does not contain event x, but does contain all
     * the parents of x, and hashgraph B is the result of adding x to A, and x
     * is a witness created in round r, and A has at least one witness in round
     * r whose fame has been decided (as either famous or as not famous), then x
     * will be decided as “not famous” in B.
     *)
    Theorem thm518
    : forall x r,
        ExtendsByOne B A x ->
        Witness B x ->
        round B x = r ->
        (exists y, Witness A y /\ round A y = r /\ exists z, decide A z y = true) ->
        exists y, decide B x y = true /\ ~Famous B x.
    Proof.
    Abort. (* TODO *)

    (* Theorem 5.19 (Byzantine Fault Tolerance Theorem). Each event x created by
     * an honest member will eventually be assigned a consensus position in the
     * total order of events, with probability 1.
     *)
    Theorem thm519 : True.
    Proof.
      (* NOTE: This is a placeholder for this theorem since we don't have
       * proabability formalized appropriately yet.
       *)
    Abort. (* Placeholder *)

  End theorems.

End Swirlds.
