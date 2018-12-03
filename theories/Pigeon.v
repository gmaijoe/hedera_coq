(* Copyright Swirlds Inc. 2018 *)
(** Formalization of the pigeon-hole principle *)
Require Import Coq.Bool.Bool.
Require Import Coq.Lists.List.
Require Import Coq.Classes.Morphisms.
Require Import Coq.omega.Omega.

Require Import Swirlds.Unique.

Lemma weak_pigeon : forall {T} {T_dec : forall a b : T, {a = b} + {a <> b}}
                      (a b c : list T),
    Unique a -> Unique b -> Unique c ->
    subset a c ->
    subset b c ->
    length a + length b > length c ->
    exists x, In x a /\ In x b /\ In x c.
Proof.
  induction a.
  { simpl; intros.
    clear H2 H.
    exfalso.
    eapply (@Unique_subset _ T_dec) in H3; eauto.
    omega. }
  { simpl.
    intros.
    destruct (In_dec T_dec a b).
    { exists a. split; auto. }
    { destruct (IHa b (remove T_dec a c)); auto.
      { inversion H; clear H; auto. }
      { apply @Unique_remove with (T_dec:=T_dec); eauto. }
      { eapply @subset_remove_not_in with (T_dec:=T_dec); eauto.
        eapply subset_cons. eassumption.
        inversion H; clear H; eauto. }
      { eapply @subset_remove_not_in with (T_dec:=T_dec); eauto. }
      { assert (In a c) by firstorder.
        eapply @length_remove_In with (T_dec:=T_dec) in H5.
        omega. }
      { destruct H5 as [ ? [ ? ? ] ].
        exists x; auto. } } }
Qed.

Lemma subset_remove_both : forall {T} T_dec a b,
    subset a b ->
    forall (x : T), subset (remove T_dec x a) (remove T_dec x b).
Proof.
  unfold subset. simpl; intros.
  rewrite In_remove_iff.
  rewrite In_remove_iff in H0.
  firstorder.
Defined.

Lemma remove_not_In : forall {T} T_dec (x : T) xs,
    ~In x xs ->
    remove T_dec x xs = xs.
Proof.
  induction xs.
  { simpl; auto. }
  { simpl; intros.
    destruct (T_dec x a).
    { subst. exfalso. tauto. }
    { f_equal. firstorder. } }
Defined.

Lemma length_remove_unique_In : forall {T} T_dec (x : T) xs,
    Unique xs ->
    In x xs ->
    length xs = S (length (remove T_dec x xs)).
Proof.
  induction 1.
  { simpl. tauto. }
  { simpl.
    destruct (T_dec x l).
    { subst. intros.
      rewrite remove_not_In; auto. }
    { intro. simpl.
      rewrite <- IHUnique; auto.
      destruct H1; eauto. exfalso; congruence. } }
Defined.

Lemma strong_pigeon : forall {T} (T_dec : forall a b : T, {a = b} + {a <> b}) (a b c : list T),
    Unique a -> Unique b -> Unique c ->
    subset a c ->
    subset b c ->
    length a + length b > length c ->
    exists xs,
      Unique xs /\
      length xs >= length a + length b - length c /\
      subset xs a /\ subset xs b.
Proof.
  intros.
  pose (n := length a + length b - length c).
  fold n.
  assert (n = length a + length b - length c) by reflexivity.
  clearbody n.
  generalize dependent a; generalize dependent b; generalize dependent c.
  induction n.
  { simpl; intros; exfalso. omega. }
  { intros.
    destruct (@weak_pigeon _ T_dec a b c H H0 H1 H2 H3 H4).
    destruct H6 as [ ? [ ? ? ] ].
    rewrite (length_remove_unique_In T_dec _ _ H H6) in H5.
    rewrite (length_remove_unique_In T_dec _ _ H0 H7) in H5.
    rewrite (length_remove_unique_In T_dec _ _ H1 H8) in H5.
    destruct (dec_gt (length (remove T_dec x a) + length (remove T_dec x b)) (length (remove T_dec x c))).
    { destruct (fun H H' H'' => IHn (remove T_dec x c) H (remove T_dec x b) H' H'' (remove T_dec x a)); clear IHn; eauto using Unique_remove, subset_remove_both.
      { rewrite (length_remove_unique_In T_dec _ _ H H6) in H4.
        rewrite (length_remove_unique_In T_dec _ _ H0 H7) in H4.
        rewrite (length_remove_unique_In T_dec _ _ H1 H8) in H4.
        omega. }
      { exists (x :: x0).
        destruct H10 as [ ? [ ? [ ? ? ] ] ].
        split.
        { constructor; auto.
          intro. eapply H12 in H14.
          eapply remove_In in H14; auto. }
        split.
        { simpl; omega. }
        split.
        { red; intros.
          destruct H14; subst; auto.
          eapply H12 in H14. eapply In_remove_iff in H14. tauto. }
        { red; intros.
          destruct H14; subst; auto.
          eapply H13 in H14. eapply In_remove_iff in H14. tauto. } } }
    { exists (x :: nil).
      split.
      { repeat constructor. intro. apply H10. }
      split.
      { simpl. omega. }
      split; red; simpl; intros; eauto.
      { destruct H10; [ subst | ]; tauto. }
      { destruct H10; [ subst | ]; tauto. } } }
Qed.
