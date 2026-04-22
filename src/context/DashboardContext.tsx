import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  bulkMoveTasksToCategory,
  ensureDashboardMeta,
  deleteUserTask,
  newUserTaskId,
  setDashboardCategories,
  setUserTask,
  subscribeDashboardCategories,
  subscribeUserTasks,
  updateUserTask,
} from "../api/firestoreDashboardApi";

export type Priority = "High" | "Medium" | "Low";

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  category: string;
  createdAt: string;
};

export type TaskDraft = {
  title: string;
  dueDate: string;
  priority: Priority;
  category: string;
};

type DashboardContextValue = {
  tasks: Task[];
  categories: string[];
  today: string;
  banner: { type: "success" | "error"; message: string } | null;
  setBanner: React.Dispatch<
    React.SetStateAction<{ type: "success" | "error"; message: string } | null>
  >;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  dueTodayTasks: number;
  progressPercent: number;
  upcomingDeadlines: Task[];
  completionRate: number;
  addTask: (task: TaskDraft) => void;
  quickAddTask: (title: string, selectedCategory?: string) => boolean;
  addCategory: (category: string) => boolean;
  renameCategory: (currentCategory: string, nextCategory: string) => boolean;
  deleteCategory: (category: string) => boolean;
  toggleTaskStatus: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id">>) => boolean;
  deleteTask: (taskId: string) => void;
};

const getToday = () => new Date().toISOString().slice(0, 10);

const defaultCategories = ["Work", "Personal", "School"];

export const priorityTone: Record<Priority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [banner, setBanner] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);
  const today = getToday();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setCategories(defaultCategories);
      return;
    }

    let isMounted = true;
    void ensureDashboardMeta(user.uid, defaultCategories).catch(() => {
      if (!isMounted) return;
      setBanner({
        type: "error",
        message: "Failed to load dashboard settings.",
      });
    });

    const unsubscribeCategories = subscribeDashboardCategories(user.uid, (next) => {
      setCategories(next.length ? next : defaultCategories);
    });
    const unsubscribeTasks = subscribeUserTasks(user.uid, (next) => {
      setTasks(next);
    });

    return () => {
      isMounted = false;
      unsubscribeCategories();
      unsubscribeTasks();
    };
  }, [user]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!user) return;
    console.log(`[dashboard] tasks for uid=${user.uid}`, tasks);
  }, [tasks, user]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(
    (task) => !task.completed && task.dueDate < today
  ).length;
  const dueTodayTasks = tasks.filter(
    (task) => !task.completed && task.dueDate === today
  ).length;
  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const completionRate =
    totalTasks === 0 ? 0 : Number(((completedTasks / totalTasks) * 100).toFixed(1));

  const upcomingDeadlines = useMemo(
    () =>
      [...tasks]
        .filter((task) => !task.completed && task.dueDate >= today)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 4),
    [tasks, today]
  );

  const addTask = (task: TaskDraft) => {
    if (!user) return;

    const title = task.title.trim();
    if (!title) return;

    const taskId = newUserTaskId(user.uid);
    setTasks((prev) => [
      {
        id: taskId,
        title,
        dueDate: task.dueDate,
        priority: task.priority,
        completed: false,
        category: task.category,
        createdAt: today,
      },
      ...prev,
    ]);
    setBanner({ type: "success", message: "New task created." });

    void setUserTask(user.uid, taskId, {
      title,
      dueDate: task.dueDate,
      priority: task.priority,
      completed: false,
      category: task.category,
      createdAt: today,
    }).catch((error) => {
      if (import.meta.env.DEV) console.error("Failed to save task:", error);
      setTasks((prev) => prev.filter((item) => item.id !== taskId));
      setBanner({ type: "error", message: "Failed to save task. Please try again." });
    });
  };

  const quickAddTask = (title: string, selectedCategory = "All Lists") => {
    if (!user) return false;

    if (!title.trim()) return false;

    const defaultCategory =
      selectedCategory === "All Lists" ? categories[0] ?? "Work" : selectedCategory;

    const trimmedTitle = title.trim();
    const taskId = newUserTaskId(user.uid);

    setTasks((prev) => [
      {
        id: taskId,
        title: trimmedTitle,
        dueDate: today,
        priority: "Medium",
        completed: false,
        category: defaultCategory,
        createdAt: today,
      },
      ...prev,
    ]);
    setBanner({ type: "success", message: "Task added successfully." });

    void setUserTask(user.uid, taskId, {
      title: trimmedTitle,
      dueDate: today,
      priority: "Medium",
      completed: false,
      category: defaultCategory,
      createdAt: today,
    }).catch((error) => {
      if (import.meta.env.DEV) console.error("Failed to quick-save task:", error);
      setTasks((prev) => prev.filter((item) => item.id !== taskId));
      setBanner({ type: "error", message: "Failed to save task. Please try again." });
    });
    return true;
  };

  const addCategory = (category: string) => {
    if (!user) return false;

    const value = category.trim();

    if (!value || categories.includes(value)) return false;

    setCategories((prev) => {
      const next = [...prev, value];
      void setDashboardCategories(user.uid, next).catch(() => {
        setBanner({ type: "error", message: "Failed to save category. Please try again." });
      });
      return next;
    });
    setBanner({ type: "success", message: "Category created." });
    return true;
  };

  const renameCategory = (currentCategory: string, nextCategory: string) => {
    if (!user) return false;

    const trimmedNextCategory = nextCategory.trim();

    if (
      !trimmedNextCategory ||
      !categories.includes(currentCategory) ||
      (trimmedNextCategory !== currentCategory &&
        categories.includes(trimmedNextCategory))
    ) {
      return false;
    }

    if (trimmedNextCategory === currentCategory) return true;

    setCategories((prev) => {
      const next = prev.map((item) =>
        item === currentCategory ? trimmedNextCategory : item
      );
      void setDashboardCategories(user.uid, next)
        .then(() =>
          bulkMoveTasksToCategory(user.uid, currentCategory, trimmedNextCategory)
        )
        .catch(() => {
          setBanner({ type: "error", message: "Failed to update category. Please try again." });
        });
      return next;
    });
    setTasks((prev) =>
      prev.map((task) =>
        task.category === currentCategory
          ? { ...task, category: trimmedNextCategory }
          : task
      )
    );
    setBanner({ type: "success", message: "Category updated." });
    return true;
  };

  const deleteCategory = (category: string) => {
    if (!user) return false;

    if (!categories.includes(category) || categories.length <= 1) return false;

    const fallbackCategory =
      categories.find((item) => item !== category) ?? defaultCategories[0];

    setCategories((prev) => {
      const next = prev.filter((item) => item !== category);
      void setDashboardCategories(user.uid, next)
        .then(() => bulkMoveTasksToCategory(user.uid, category, fallbackCategory))
        .catch(() => {
          setBanner({ type: "error", message: "Failed to delete category. Please try again." });
        });
      return next;
    });
    setTasks((prev) =>
      prev.map((task) =>
        task.category === category
          ? { ...task, category: fallbackCategory }
          : task
      )
    );
    setBanner({ type: "success", message: "Category deleted." });
    return true;
  };

  const toggleTaskStatus = (taskId: string) => {
    if (!user) return;

    setTasks((prev) => {
      const current = prev.find((task) => task.id === taskId);
      if (!current) return prev;

      const nextCompleted = !current.completed;
      void updateUserTask(user.uid, taskId, { completed: nextCompleted }).catch(
        () => {
          setBanner({ type: "error", message: "Failed to update task. Please try again." });
        }
      );

      return prev.map((task) =>
        task.id === taskId ? { ...task, completed: nextCompleted } : task
      );
    });
  };

  const updateTask = (taskId: string, updates: Partial<Omit<Task, "id">>) => {
    if (!user) return false;

    const title = updates.title?.trim();
    if (updates.title !== undefined && !title) return false;

    setTasks((prev) => {
      const existing = prev.find((task) => task.id === taskId);
      if (!existing) return prev;

      const nextTask = {
        ...existing,
        ...updates,
        ...(updates.title !== undefined ? { title } : null),
      } as Task;

      void updateUserTask(user.uid, taskId, {
        title: nextTask.title,
        dueDate: nextTask.dueDate,
        priority: nextTask.priority,
        completed: nextTask.completed,
        category: nextTask.category,
        createdAt: nextTask.createdAt,
      }).catch(() => {
        setBanner({ type: "error", message: "Failed to update task. Please try again." });
      });

      return prev.map((task) => (task.id === taskId ? nextTask : task));
    });

    return true;
  };

  const deleteTask = (taskId: string) => {
    if (!user) return;

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setBanner({ type: "success", message: "Task deleted." });

    void deleteUserTask(user.uid, taskId).catch(() => {
      setBanner({ type: "error", message: "Failed to delete task. Please try again." });
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        tasks,
        categories,
        today,
        banner,
        setBanner,
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        dueTodayTasks,
        progressPercent,
        upcomingDeadlines,
        completionRate,
        addTask,
        quickAddTask,
        addCategory,
        renameCategory,
        deleteCategory,
        toggleTaskStatus,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
};
