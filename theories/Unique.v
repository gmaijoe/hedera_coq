(* Copyright Swirlds Inc. 2018 *)
(** Formalization of uniqueness of elements in a list *)
Require Import Coq.Bool.Bool.
Require Import Coq.Lists.List.
Require Import Coq.Classes.Morphisms.
Require Import Coq.omega.Omega.

Require Import Swirlds.Util.

(** All the elements of a list are unique. *)
Inductive Unique {T} : list T -> Prop :=
| Unique_nil : Unique nil
| Unique_cons : forall l ls, ~In l ls -> Unique ls -> Unique (l :: ls).

Definition subset {T} (ls ls' : list T) : Prop :=
  forall t, In t ls -> In t ls'.

Lemma subset_cons : forall {T} (x : T) xs ys,
    subset (x :: xs) ys ->
    subset xs ys.
Proof. unfold subset. simpl. firstorder. Defined.

Section uniq.
  Context {T : Type}.
  Context {T_dec : forall a b : T, {a = b} + {a <> b}}.

  Fixpoint uniq (ls : list T) : list T :=
    match ls with
    | nil => nil
    | l :: ls => l :: remove T_dec l (uniq ls)
    end.

  Lemma In_remove' : forall l l' ls, In l (remove T_dec l' ls) -> In l ls.
  Proof.
    clear.
    induction ls; simpl.
    { auto. }
    { intros. destruct (T_dec l' a); subst; eauto.
      destruct H; auto. }
  Defined.

  Lemma In_remove_iff : forall l' l ls, In l (remove T_dec l' ls) <-> (l <> l' /\ In l ls).
  Proof.
    split.
    - split.
      + intro. subst. eapply remove_In; eassumption.
      + eapply In_remove'; eassumption.
    - destruct 1.
      clear - H H0.
      induction ls.
      + inversion H0.
      + simpl.
        destruct (T_dec l' a).
        * subst. apply IHls.
          destruct H0; auto. congruence.
        * simpl. destruct H0.
          subst. eauto.
          right. eauto.
  Defined.

  Lemma Unique_remove : forall l ls, Unique ls -> Unique (remove T_dec l ls).
  Proof.
    induction 1; simpl.
    - constructor.
    - destruct (T_dec l l0); eauto.
      constructor; auto.
      intro. eapply In_remove' in H1; auto.
  Defined.

  Lemma uniq_Unique : forall ls,
      Unique (uniq ls).
  Proof.
    induction ls; simpl; intros; auto.
    - constructor.
    - constructor.
      + eapply remove_In.
      + eapply Unique_remove. assumption.
  Defined.

  Definition cardinality (ls : list T) : nat :=
    length (uniq ls).

  Lemma In_uniq : forall l ls, In l ls <-> In l (uniq ls).
  Proof.
    induction ls; simpl; intros.
    { tauto. }
    { rewrite IHls.
      destruct (T_dec a l).
      - subst. tauto.
      - rewrite In_remove_iff.
        split; try tauto.
        intros. destruct H; try tauto.
        right. split; auto. }
  Defined.

  Lemma remove_uniq : forall l ls, ~In l ls -> remove T_dec l ls = ls.
  Proof.
    induction ls; intros.
    - reflexivity.
    - simpl.
      destruct (T_dec l a).
      * subst. exfalso. apply H; left; auto.
      * f_equal. apply IHls.
        intro. apply H. right; auto.
  Defined.

  Lemma Unique_uniq : forall ls, Unique ls -> uniq ls = ls.
  Proof.
    induction 1; simpl; intros; auto.
    { f_equal.
      rewrite remove_uniq; auto.
      rewrite <- In_uniq. assumption. }
  Defined.

  Lemma subset_remove_not_in
    : forall (x : T) xs ys,
      subset xs ys ->
      ~In x xs ->
      subset xs (remove T_dec x ys).
  Proof.
    unfold subset. intros.
    rewrite In_remove_iff.
    destruct (T_dec x t).
    { subst. exfalso; tauto. }
    { auto. }
  Defined.

  Lemma length_remove : forall (x : T) xs,
      length xs >= length (remove T_dec x xs).
  Proof.
    induction xs.
    { simpl. constructor. }
    { simpl.
      destruct (T_dec x a).
      { omega. }
      { simpl. omega. } }
  Qed.

  Lemma length_remove_In : forall (x : T) xs,
      In x xs ->
      length xs > length (remove T_dec x xs).
  Proof.
    induction xs.
    { simpl. tauto. }
    { simpl. destruct 1.
      { subst.
        destruct (T_dec x x).
        { generalize (length_remove x xs).
          omega. }
        { exfalso; tauto. } }
      { apply IHxs in H; clear IHxs.
        destruct (T_dec x a); try omega.
        simpl. omega. } }
  Qed.

  Lemma Unique_subset : forall (a : list T),
      Unique a -> forall b, Unique b -> subset a b ->
                      length a <= length b.
  Proof.
    induction 1.
    { simpl. intros; omega. }
    { simpl; intros.
      specialize (IHUnique (remove T_dec l b) (Unique_remove _ _ H1)).
      assert (In l b) by (eapply H2; simpl; auto).
      eapply length_remove_In in H3.
      assert (subset ls (remove T_dec l b)).
      { unfold subset.
        intros. rewrite In_remove_iff.
        destruct (T_dec l t).
        { exfalso; subst; auto. }
        { split; auto. apply H2.
          right. assumption. } }
      eapply IHUnique in H4.
      omega. }
  Qed.

End uniq.

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

Lemma length_filter : forall {T} (p : T -> bool) xs,
    length xs = length (filter p xs) + length (filter (fun x => negb (p x)) xs).
Proof.
  induction xs; simpl; auto.
  { rewrite IHxs.
    destruct (p a); simpl; omega. }
Qed.

Lemma filter_is_nil : forall {T} p (ls : list T),
    ~(exists x, In x ls /\ p x = true) ->
    filter p ls = nil.
Proof.
  induction ls; simpl; auto.
  { intros.
    destruct (p a) eqn:?.
    { exfalso. apply H. eexists; eauto. }
    { apply IHls; clear IHls. intro.
      destruct H0.  apply H.
      exists x. tauto. } }
Qed.

Section uniqueBy.
  Context {T U : Type}.
  Variable f : T -> U.
  Variable U_dec : forall a b : U, {a = b} + {a <> b}.

  Fixpoint uniqueBy (es : list T) : list T :=
    match es with
    | nil => nil
    | e :: es =>
      let res := uniqueBy es in
      if anyb (map (fun x => match U_dec (f x) (f e) with
                          | left _ => true
                          | right _ => false
                          end) res)
      then res
      else e :: res
    end.

  Theorem uniqueBy_subset : forall xs, subset (uniqueBy xs) xs.
  Proof.
    red. unfold ListSet.set_In.
    induction xs; simpl.
    - tauto.
    - intros.
      destruct (anyb
                  (map (fun x => match U_dec (f x) (f a) with
                              | left _ => true
                              | right _ => false
                              end) (uniqueBy xs))).
      { eauto. }
      { inversion H; eauto. }
  Defined.

  Lemma uniqueBy_filter : forall xs c,
      uniqueBy (filter (fun x => negb (if U_dec (f x) c then true else false)) xs) =
      filter (fun x => negb (if U_dec (f x) c then true else false)) (uniqueBy xs).
  Proof.
    induction xs; simpl.
    { auto. }
    { intros.
      destruct (negb (if U_dec (f a) c then true else false)) eqn:Hx.
      { simpl.
        rewrite IHxs; clear IHxs.
        match goal with
        | |- (if ?X then _ else _) = _ => destruct X eqn:?
        end.
        { match goal with
          | |- context [ if ?X then _ else _ ] => destruct X eqn:?; auto
          end.
          exfalso.
          eapply anyb_true_iff in Heqb.
          eapply anyb_false_iff in Heqb0.
          apply Heqb0; clear Heqb0.
          apply in_map_iff in Heqb. apply in_map_iff.
          destruct Heqb.
          exists x.
          destruct H. split; auto.
          eapply filter_In in H0.
          tauto. }
        { apply anyb_false_iff in Heqb.
          rewrite in_map_iff in Heqb.
          match goal with
          | |- context [ if ?X then _ else _ ] => destruct X eqn:?
          end.
          { exfalso. apply anyb_true_iff in Heqb0.
            apply in_map_iff in Heqb0. apply Heqb; clear Heqb.
            destruct Heqb0. exists x.
            rewrite filter_In. split; try tauto. split; try tauto.
            destruct H. destruct (U_dec (f x) (f a)); try congruence.
            rewrite <- e in *. tauto. }
          { simpl. rewrite Hx. reflexivity. } } }
      { rewrite IHxs; clear IHxs.
        match goal with
        | |- context [ if ?X then _ else _ ] => destruct X
        end; auto.
        simpl. rewrite Hx. reflexivity. } }
  Qed.

  Theorem Unique_map_uniqueBy : forall xs,
      Unique (map f (uniqueBy xs)).
  Proof.
    induction xs.
    { simpl. constructor. }
    { simpl.
      match goal with
      | |- context [ if ?X then _ else _ ] => destruct X eqn:?; auto
      end.
      simpl. constructor; auto.
      apply anyb_false_iff in Heqb.
      rewrite in_map_iff in Heqb.
      rewrite in_map_iff.
      intro.
      apply Heqb; clear Heqb.
      destruct H. exists x.
      destruct (U_dec (f x) (f a)); firstorder. }
  Qed.

  Lemma Unique_map_Unique : forall xs,
      Unique (map f xs) ->
      Unique xs.
  Proof.
    induction xs; simpl; intros.
    { constructor. }
    { inversion H; clear H; subst; constructor; auto.
      intro. apply H2.
      apply in_map_iff. eauto. }
  Qed.

  Lemma Unique_uniqueBy:
    forall cs, Unique (uniqueBy cs).
  Proof.
    intros. apply Unique_map_Unique. apply Unique_map_uniqueBy.
  Qed.

  Lemma In_uniqueBy:
    forall (a : T) (ys : list T), In a ys -> exists x : T, f x = f a /\ In x (uniqueBy ys).
  Proof.
    intros.
    induction ys.
    { destruct H. }
    { destruct H; subst; simpl in *.
      { clear IHys.
        match goal with
        | |- context [ if ?X then _ else _ ] => destruct X eqn:?
        end.
        { apply anyb_true_iff in Heqb.
          apply in_map_iff in Heqb.
          destruct Heqb. exists x. destruct (U_dec (f x) (f a)); try tauto.
          exfalso; destruct H; congruence. }
        { exists a. split; auto. left. reflexivity. } }
      { apply IHys in H; clear IHys.
        destruct H. exists x. destruct H; split; auto.
        match goal with
        | |- context [ if ?X then _ else _ ] => destruct X eqn:?
        end; auto.
        right; auto. } }
  Qed.

  Lemma squeeze_uniqueBy : forall (xs ys : list T),
      subset xs ys ->
      Unique (map f xs) ->
      length xs <= length (uniqueBy ys).
  Proof.
    induction xs.
    { simpl. intros. omega. }
    { simpl. intros.
      cutrewrite (length (uniqueBy ys) =
                  S (length (uniqueBy (filter (fun x => negb (if U_dec (f x) (f a) then true else false)) ys)))).
      { inversion H0; clear H0; subst.
        eapply (IHxs (filter (fun x => negb (if U_dec (f x) (f a) then true else false)) ys)) in H4.
        omega.
        clear - H H3.
        unfold subset in *.
        intros. simpl in H.
        specialize (H _ (or_intror H0)).
        eapply filter_In.
        split; [ exact H | ].
        eapply negb_true_iff.
        intro.
        destruct (U_dec (f t) (f a)); try congruence.
        eapply H3.
        eapply in_map_iff. exists t. split; [ exact e | exact H0 ]. }
      { clear IHxs.
        inversion H0; clear H0; subst.
        rewrite uniqueBy_filter.
        rewrite (length_filter (fun x => if U_dec (f x) (f a) then true else false) (uniqueBy ys)) at 1.
        cutrewrite (length (filter (fun x => if U_dec (f x) (f a) then true else false) (uniqueBy ys)) = 1); [ reflexivity | ].
        assert (exists x, f x = f a /\ In x (uniqueBy ys)).
        { eapply In_uniqueBy.
          apply H. left; auto. }
        clear - H0.
        generalize (Unique_map_uniqueBy ys).
        generalize (Unique_uniqueBy ys).
        induction 1.
        { simpl.
          destruct H0. destruct H. destruct H0. }
        { simpl. inversion 1. clear H2; subst.
          destruct H0 as [ ? [ ? ? ] ]. destruct H2.
          { subst. rewrite H0.
            destruct (U_dec (f a) (f a)); try congruence. simpl.
            f_equal.
            rewrite filter_is_nil. auto.
            intro. destruct H2. destruct H2.
            destruct (U_dec (f x0) (f a)); try congruence.
            destruct e0. apply H5. apply in_map_iff. eexists; split; [ | eassumption ].
            firstorder. }
          { destruct H0.
            apply IHUnique in H6; clear IHUnique.
            destruct (U_dec (f l) (f x)) eqn:?; simpl; eauto.
            { exfalso. eapply H5. apply in_map_iff.
              eexists; split; [ | eassumption ]. eauto. }
            { eexists; split; eauto. } } } } }
  Qed.

End uniqueBy.


Theorem uniqueBy_id {U} (U_dec : forall a b : U, {a = b} + {a <> b})
  : forall x xs,
    In x xs <-> In x (uniqueBy (fun x => x) U_dec xs).
Proof.
  induction xs; simpl; intros.
  { tauto. }
  { rewrite IHxs.
    match goal with
    | |- context [ if ?X then _ else _ ] => destruct X eqn:?
    end.
    { firstorder.
      subst.
      eapply anyb_In in Heqb.
      apply in_map_iff in Heqb.
      destruct Heqb as [ ? [ ? ? ] ].
      destruct (U_dec x0 x); congruence. }
    { firstorder. } }
Qed.
