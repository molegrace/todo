import {
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

export type FirestoreTaskDoc = {
  title: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  category: string;
  createdAt: string;
};

type DashboardMetaDoc = {
  categories: string[];
};

const dashboardMetaRef = (uid: string) => doc(db, "users", uid, "meta", "dashboard");
const tasksCollectionRef = (uid: string) => collection(db, "users", uid, "tasks");
const taskRef = (uid: string, taskId: string) => doc(db, "users", uid, "tasks", taskId);

export const ensureDashboardMeta = async (
  uid: string,
  defaultCategories: string[]
): Promise<void> => {
  const ref = dashboardMetaRef(uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return;

  await setDoc(ref, { categories: defaultCategories } satisfies DashboardMetaDoc);
};

export const subscribeDashboardCategories = (
  uid: string,
  onChange: (categories: string[]) => void
): (() => void) =>
  onSnapshot(dashboardMetaRef(uid), (snapshot) => {
    const data = snapshot.data() as DashboardMetaDoc | undefined;
    onChange(data?.categories ?? []);
  });

export const setDashboardCategories = async (
  uid: string,
  categories: string[]
): Promise<void> => {
  await setDoc(dashboardMetaRef(uid), { categories } satisfies DashboardMetaDoc, {
    merge: true,
  });
};

export const subscribeUserTasks = (
  uid: string,
  onChange: (tasks: Array<{ id: string } & FirestoreTaskDoc>) => void
): (() => void) => {
  const q = query(tasksCollectionRef(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    onChange(
      snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as FirestoreTaskDoc),
      }))
    );
  });
};

export const newUserTaskId = (uid: string): string =>
  doc(tasksCollectionRef(uid)).id;

export const setUserTask = async (
  uid: string,
  taskId: string,
  task: FirestoreTaskDoc
): Promise<void> => {
  await setDoc(taskRef(uid, taskId), task);
};

export const updateUserTask = async (
  uid: string,
  taskId: string,
  updates: Partial<FirestoreTaskDoc>
): Promise<void> => {
  await updateDoc(taskRef(uid, taskId), updates);
};

export const deleteUserTask = async (uid: string, taskId: string): Promise<void> => {
  await deleteDoc(taskRef(uid, taskId));
};

export const bulkMoveTasksToCategory = async (
  uid: string,
  fromCategory: string,
  toCategory: string
): Promise<void> => {
  const q = query(tasksCollectionRef(uid), where("category", "==", fromCategory));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.update(docSnap.ref, { category: toCategory });
  });
  await batch.commit();
};
