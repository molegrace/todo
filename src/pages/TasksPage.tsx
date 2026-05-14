import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Checkbox from "../components/Checkbox";
import DashboardLayout from "../components/DashboardLayout";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";
import Select from "../components/Dropdown";
import Table from "../components/Table";
import {
  priorityTone,
  useDashboard,
} from "../context/DashboardContext";
import type { Task, TaskDraft, TaskImage } from "../context/DashboardContext";

type ViewFilter = "all" | "pending" | "today" | "upcoming" | "completed" | "overdue";

const viewButtons: { label: string; value: ViewFilter }[] = [
  { label: "All tasks", value: "all" },
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

const TasksPage: React.FC = () => {
  const {
    tasks,
    categories,
    today,
    addTask,
    toggleTaskStatus,
    updateTask,
    deleteTask,
    pendingTasks,
    completedTasks,
    overdueTasks,
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedView, setSelectedView] = useState<ViewFilter>("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [viewingImage, setViewingImage] = useState<TaskImage | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [newTask, setNewTask] = useState<TaskDraft>({
    title: "",
    dueDate: today,
    priority: "Medium",
    category: categories[0] ?? "Work",
    images: [],
  });

  const filteredTasks = useMemo(() => {
    const searched = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || task.category === selectedCategory;
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      let matchesView = true;
      if (selectedView === "all") matchesView = !task.completed;
      if (selectedView === "pending") matchesView = !task.completed;
      if (selectedView === "today") matchesView = task.dueDate === today && !task.completed;
      if (selectedView === "upcoming") matchesView = task.dueDate > today && !task.completed;
      if (selectedView === "completed") matchesView = task.completed;
      if (selectedView === "overdue") matchesView = task.dueDate < today && !task.completed;

      return matchesSearch && matchesCategory && matchesPriority && matchesView;
    });

    return [...searched].sort((a, b) => {
      if (sortBy === "priority") {
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }

      return a[sortBy as "dueDate" | "createdAt"].localeCompare(
        b[sortBy as "dueDate" | "createdAt"]
      );
    });
  }, [priorityFilter, searchTerm, selectedCategory, selectedView, sortBy, tasks, today]);

  const tasksPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / tasksPerPage));
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedTasks = filteredTasks.slice(
    (visiblePage - 1) * tasksPerPage,
    visiblePage * tasksPerPage
  );

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutsideSearch = (event: MouseEvent) => {
      if (!searchWrapperRef.current) return;
      if (searchWrapperRef.current.contains(event.target as Node)) return;
      if (searchTerm) return;

      setIsSearchOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutsideSearch);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSearch);
    };
  }, [searchTerm]);

  const applyStatFilter = (view: ViewFilter) => {
    setSelectedView(view);
    setSearchTerm("");
    setPriorityFilter("all");
    setSelectedCategory("all");
    setCurrentPage(1);
  };

  const statCards: {
    title: string;
    value: number;
    description: string;
    view: ViewFilter;
  }[] = [
    {
      title: "Pending tasks",
      value: pendingTasks,
      description: "Still waiting for action",
      view: "pending",
    },
    {
      title: "Completed",
      value: completedTasks,
      description: "Wrapped up and done",
      view: "completed",
    },
    {
      title: "Overdue",
      value: overdueTasks,
      description: "Need attention first",
      view: "overdue",
    },
  ];

  const handleAddTask = () => {
    if (editingTaskId) {
      const updated = updateTask(editingTaskId, {
        title: newTask.title,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        category: newTask.category,
        images: newTask.images,
      });
      if (!updated) return;
    } else {
      addTask(newTask);
    }

    setIsTaskModalOpen(false);
    setEditingTaskId(null);
    setNewTask({
      title: "",
      dueDate: today,
      priority: "Medium",
      category: categories[0] ?? "Work",
      images: [],
    });
  };

  const openCreateTaskModal = () => {
    setEditingTaskId(null);
    setNewTask({
      title: "",
      dueDate: today,
      priority: "Medium",
      category: categories[0] ?? "Work",
      images: [],
    });
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    setEditingTaskId(taskId);
    setNewTask({
      title: task.title,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      images: task.images,
    });
    setIsTaskModalOpen(true);
  };

  const handleTaskImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const url = typeof reader.result === "string" ? reader.result : "";
        if (!url) return;

        setNewTask((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2)}`,
              url,
              caption: "",
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const updateTaskImageCaption = (imageId: string, caption: string) => {
    setNewTask((prev) => ({
      ...prev,
      images: prev.images.map((image) =>
        image.id === imageId ? { ...image, caption } : image
      ),
    }));
  };

  const removeTaskImage = (imageId: string) => {
    setNewTask((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image.id !== imageId),
    }));
  };

  return (
    <>
      <DashboardLayout
        title="Tasks"
        actions={
          <Button
            label="+ New task"
            variant="secondary"
            onClick={openCreateTaskModal}
            className="w-full sm:w-auto"
          />
        }
      >
        <section className="grid gap-4 md:grid-cols-3">
          {statCards.map((stat) => {
            const isActive = selectedView === stat.view;

            return (
              <button
                key={stat.view}
                type="button"
                onClick={() => applyStatFilter(stat.view)}
                aria-pressed={isActive}
                className={`min-w-0 max-w-full rounded-2xl border p-4 text-left shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-main-400 sm:p-5 ${
                  isActive
                    ? "border-main-700 bg-main-700 text-white"
                    : "border-main-200 bg-white text-main-700"
                }`}
              >
                <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-main-700"}`}>
                  {stat.title}
                </p>
                <p className={`mt-3 text-3xl font-bold sm:text-4xl ${isActive ? "text-white" : "text-main-700"}`}>
                  {stat.value}
                </p>
                <p className={`mt-2 text-sm ${isActive ? "text-main-100" : "text-main-500"}`}>
                  {stat.description}
                </p>
              </button>
            );
          })}
        </section>

        <Card className="space-y-5 p-4 shadow-lg sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-500 sm:tracking-[0.24em]">
                Filters
              </p>
              
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {viewButtons.map((view) => (
                <button
                  key={view.value}
                  type="button"
                  onClick={() => {
                    setSelectedView(view.value);
                    setCurrentPage(1);
                  }}
                  className={`min-w-0 rounded-full px-3 py-2 text-center text-sm font-medium transition sm:px-4 ${
                    selectedView === view.value
                      ? "bg-main-700 text-white"
                      : "bg-main-100 text-main-600 hover:bg-main-200"
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-5 p-4 shadow-lg sm:p-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] xl:items-end">
            <div className="min-w-0 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-main-500 sm:tracking-[0.24em]">
                Task board
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                <Select
                  label="Category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { label: "All categories", value: "all" },
                    ...categories.map((category) => ({
                      label: category,
                      value: category,
                    })),
                  ]}
                />
                <Select
                  label="Priority"
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  options={[
                    { label: "All priorities", value: "all" },
                    { label: "High", value: "High" },
                    { label: "Medium", value: "Medium" },
                    { label: "Low", value: "Low" },
                  ]}
                />
                <Select
                  label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { label: "Due date", value: "dueDate" },
                    { label: "Priority", value: "priority" },
                    { label: "Created date", value: "createdAt" },
                  ]}
                />
              </div>
            </div>
            <div className="flex justify-end" ref={searchWrapperRef}>
              {isSearchOpen || searchTerm ? (
                <div className="w-full">
                  <Input
                    ref={searchInputRef}
                    label="Search"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Search tasks"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-main-200 bg-white text-main-600 shadow-sm transition hover:bg-main-50 hover:text-main-700 focus:outline-none focus:ring-2 focus:ring-main-400"
                >
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m21 21-4.3-4.3" />
                    <circle cx="11" cy="11" r="8" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <Table
              data={paginatedTasks}
              emptyMessage="No tasks match the current filters."
              columns={[
                {
                  header: "Task",
                  accessor: "title",
                  render: (task) => (
                    <div>
                      <p className="font-semibold text-main-700">{task.title}</p>
                      <p className="text-xs text-main-500">{task.category}</p>
                    </div>
                  ),
                },
                {
                  header: "Due date",
                  accessor: "dueDate",
                  render: (task) => (
                    <span
                      className={
                        task.completed
                          ? "text-main-400"
                          : task.dueDate < today
                          ? "font-semibold text-red-600"
                          : "text-main-600"
                      }
                    >
                      {task.dueDate}
                    </span>
                  ),
                },
                {
                  header: "Priority",
                  accessor: "priority",
                  render: (task) => (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  ),
                },
                {
                  id: "status",
                  header: "Status",
                  accessor: "completed",
                  render: (task) => (
                    <Checkbox
                      checked={task.completed}
                      onChange={() => toggleTaskStatus(task.id)}
                      label={task.completed ? "Done" : "Pending"}
                    />
                  ),
                },
                {
                  id: "actions",
                  header: "Actions",
                  accessor: "id",
                  className: "text-right",
                  render: (task) => (
                    <div className="flex justify-end gap-2">
                      <Button
                        label="View"
                        variant="secondary"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => setViewingTask(task)}
                      />
                      <Button
                        label="Edit"
                        variant="secondary"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => openEditTaskModal(task.id)}
                      />
                      <Button
                        label="Delete"
                        variant="danger"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Delete this task? This action cannot be undone."
                          );
                          if (!confirmed) return;
                          deleteTask(task.id);
                        }}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-main-500">
              Page {visiblePage} of {totalPages}
            </p>
            <Pagination
              currentPage={visiblePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      </DashboardLayout>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-main-700">
              {editingTaskId ? "Edit task" : "Create task"}
            </h2>
            <p className="text-sm text-main-500">
              {editingTaskId
                ? "Update the task details."
                : "Add a new task to your workspace."}
            </p>
          </div>

          <Input
            label="Task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full"
          />
          <Input
            label="Due date"
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))
            }
            className="w-full"
          />
          <Select
            label="Priority"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev,
                priority: e.target.value as TaskDraft["priority"],
              }))
            }
            options={[
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ]}
          />
          <Select
            label="Category"
            value={newTask.category}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, category: e.target.value }))
            }
            options={categories.map((category) => ({
              label: category,
              value: category,
            }))}
          />

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-main-700">
                Pictures
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleTaskImagesChange}
                className="block w-full rounded-lg border border-main-300 bg-white px-4 py-2 text-sm text-main-700 file:mr-4 file:rounded-lg file:border-0 file:bg-main-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-main-700 hover:file:bg-main-200 focus:outline-none focus:ring-2 focus:ring-main-400"
              />
            </div>

            {newTask.images.length > 0 && (
              <div className="grid gap-3">
                {newTask.images.map((image, index) => (
                  <div
                    key={image.id}
                    className="grid gap-3 rounded-2xl border border-main-200 p-3 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-start"
                  >
                    <img
                      src={image.url}
                      alt={image.caption || `Task picture ${index + 1}`}
                      className="h-24 w-full rounded-xl object-cover sm:w-24"
                    />
                    <Input
                      label="Caption"
                      placeholder="Write image caption..."
                      value={image.caption}
                      onChange={(e) => updateTaskImageCaption(image.id, e.target.value)}
                      className="w-full"
                    />
                    <Button
                      label="Remove"
                      variant="danger"
                      className="px-3 py-2 text-xs"
                      onClick={() => removeTaskImage(image.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setIsTaskModalOpen(false)}
            />
            <Button
              label={editingTaskId ? "Save changes" : "Save task"}
              onClick={handleAddTask}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(viewingTask)}
        onClose={() => {
          setViewingTask(null);
          setViewingImage(null);
        }}
      >
        {viewingTask && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-main-700">
                {viewingTask.title}
              </h2>
              <p className="text-sm text-main-500">
                Created {viewingTask.createdAt}
              </p>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-2xl bg-main-50 p-4">
                <p className="font-medium text-main-500">Category</p>
                <p className="mt-1 font-semibold text-main-700">{viewingTask.category}</p>
              </div>
              <div className="rounded-2xl bg-main-50 p-4">
                <p className="font-medium text-main-500">Priority</p>
                <p className="mt-1 font-semibold text-main-700">{viewingTask.priority}</p>
              </div>
              <div className="rounded-2xl bg-main-50 p-4">
                <p className="font-medium text-main-500">Due date</p>
                <p className="mt-1 font-semibold text-main-700">{viewingTask.dueDate}</p>
              </div>
              <div className="rounded-2xl bg-main-50 p-4">
                <p className="font-medium text-main-500">Status</p>
                <p className="mt-1 font-semibold text-main-700">
                  {viewingTask.completed ? "Done" : "Pending"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-main-700">Pictures</h3>
              {viewingTask.images.length === 0 ? (
                <p className="mt-2 text-sm text-main-500">
                  No pictures were added to this task.
                </p>
              ) : (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {viewingTask.images.map((image, index) => (
                    <button
                      type="button"
                      key={image.id}
                      onClick={() => setViewingImage(image)}
                      className="overflow-hidden rounded-2xl border border-main-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-main-400"
                    >
                      <img
                        src={image.url}
                        alt={image.caption || `Task picture ${index + 1}`}
                        className="h-48 w-full object-cover"
                      />
                      <span className="block p-3 text-sm text-main-600">
                        {image.caption || "No caption"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {viewingImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 py-6">
          <div className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setViewingImage(null)}
              aria-label="Close image preview"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-xl font-semibold text-main-700 shadow-sm transition hover:bg-main-100"
            >
              x
            </button>
            <img
              src={viewingImage.url}
              alt={viewingImage.caption || "Task picture preview"}
              className="max-h-[72vh] w-full rounded-2xl object-contain"
            />
            <p className="mt-4 text-sm text-main-600">
              {viewingImage.caption || "No caption"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TasksPage;
