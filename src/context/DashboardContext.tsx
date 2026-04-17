import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Priority = "High" | "Medium" | "Low";

export type Task = {
  id: number;
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
  banner: string | null;
  setBanner: React.Dispatch<React.SetStateAction<string | null>>;
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
  toggleTaskStatus: (taskId: number) => void;
};

const STORAGE_KEY = "todo-dashboard-state-v1";

const getToday = () => new Date().toISOString().slice(0, 10);

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Finish UI wireframes",
    dueDate: "2026-04-02",
    priority: "High",
    completed: false,
    category: "Work",
    createdAt: "2026-03-29",
  },
  {
    id: 2,
    title: "Submit database assignment",
    dueDate: "2026-04-03",
    priority: "High",
    completed: false,
    category: "School",
    createdAt: "2026-03-30",
  },
  {
    id: 3,
    title: "Buy groceries",
    dueDate: "2026-04-01",
    priority: "Medium",
    completed: false,
    category: "Personal",
    createdAt: "2026-03-28",
  },
  {
    id: 4,
    title: "Review sprint backlog",
    dueDate: "2026-04-05",
    priority: "Medium",
    completed: true,
    category: "Work",
    createdAt: "2026-03-27",
  },
  {
    id: 5,
    title: "Prepare presentation slides",
    dueDate: "2026-04-06",
    priority: "High",
    completed: false,
    category: "Work",
    createdAt: "2026-03-31",
  },
  {
    id: 6,
    title: "Laundry and room cleanup",
    dueDate: "2026-04-04",
    priority: "Low",
    completed: false,
    category: "Personal",
    createdAt: "2026-04-01",
  },
  {
    id: 7,
    title: "Read operating systems chapter",
    dueDate: "2026-04-07",
    priority: "Medium",
    completed: true,
    category: "School",
    createdAt: "2026-03-26",
  },
];

const initialCategories = ["Work", "Personal", "School"];

export const priorityTone: Record<Priority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

const loadStoredState = () => {
  if (typeof window === "undefined") {
    return { tasks: initialTasks, categories: initialCategories };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { tasks: initialTasks, categories: initialCategories };
  }

  try {
    const parsed = JSON.parse(raw) as { tasks?: Task[]; categories?: string[] };
    return {
      tasks: parsed.tasks?.length ? parsed.tasks : initialTasks,
      categories: parsed.categories?.length ? parsed.categories : initialCategories,
    };
  } catch {
    return { tasks: initialTasks, categories: initialCategories };
  }
};

export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storedState = loadStoredState();
  const [tasks, setTasks] = useState<Task[]>(storedState.tasks);
  const [categories, setCategories] = useState<string[]>(storedState.categories);
  const [banner, setBanner] = useState<string | null>(null);
  const today = getToday();

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks, categories })
    );
  }, [tasks, categories]);

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
    if (!task.title.trim()) return;

    setTasks((prev) => [
      {
        id: Date.now(),
        title: task.title.trim(),
        dueDate: task.dueDate,
        priority: task.priority,
        completed: false,
        category: task.category,
        createdAt: today,
      },
      ...prev,
    ]);
    setBanner("New task created.");
  };

  const quickAddTask = (title: string, selectedCategory = "All Lists") => {
    if (!title.trim()) return false;

    const defaultCategory =
      selectedCategory === "All Lists" ? categories[0] ?? "Work" : selectedCategory;

    setTasks((prev) => [
      {
        id: Date.now(),
        title: title.trim(),
        dueDate: today,
        priority: "Medium",
        completed: false,
        category: defaultCategory,
        createdAt: today,
      },
      ...prev,
    ]);
    setBanner("Task added successfully.");
    return true;
  };

  const addCategory = (category: string) => {
    const value = category.trim();

    if (!value || categories.includes(value)) return false;

    setCategories((prev) => [...prev, value]);
    setBanner("Category created.");
    return true;
  };

  const toggleTaskStatus = (taskId: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
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
        toggleTaskStatus,
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
