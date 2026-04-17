import React, { useEffect, useMemo, useState } from "react";
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
import type { TaskDraft } from "../context/DashboardContext";

type ViewFilter = "all" | "today" | "upcoming" | "completed";

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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<TaskDraft>({
    title: "",
    dueDate: today,
    priority: "Medium",
    category: categories[0] ?? "Work",
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
      if (selectedView === "today") matchesView = task.dueDate === today && !task.completed;
      if (selectedView === "upcoming") matchesView = task.dueDate > today && !task.completed;
      if (selectedView === "completed") matchesView = task.completed;

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
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleAddTask = () => {
    addTask(newTask);
    setIsTaskModalOpen(false);
    setNewTask({
      title: "",
      dueDate: today,
      priority: "Medium",
      category: categories[0] ?? "Work",
    });
  };

  return (
    <>
      <DashboardLayout
        title="Tasks"
        actions={<Button label="+ New task" onClick={() => setIsTaskModalOpen(true)} />}
      >
        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5 shadow-lg">
            <p className="text-sm font-semibold text-main-700">Pending tasks</p>
            <p className="mt-3 text-4xl font-bold text-main-700">{pendingTasks}</p>
            <p className="mt-2 text-sm text-main-500">Still waiting for action</p>
          </Card>
          <Card className="p-5 shadow-lg">
            <p className="text-sm font-semibold text-main-700">Completed</p>
            <p className="mt-3 text-4xl font-bold text-main-700">{completedTasks}</p>
            <p className="mt-2 text-sm text-main-500">Wrapped up and done</p>
          </Card>
          <Card className="p-5 shadow-lg">
            <p className="text-sm font-semibold text-main-700">Overdue</p>
            <p className="mt-3 text-4xl font-bold text-main-700">{overdueTasks}</p>
            <p className="mt-2 text-sm text-main-500">Need attention first</p>
          </Card>
        </section>

        <Card className="space-y-5 p-6 shadow-lg">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
                Filters
              </p>
              <h2 className="mt-2 text-2xl font-bold text-main-700">
                Refine your task list
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {viewButtons.map((view) => (
                <button
                  key={view.value}
                  type="button"
                  onClick={() => {
                    setSelectedView(view.value);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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

          <div className="grid gap-3 lg:grid-cols-4">
            <Input
              label="Search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full"
            />
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
        </Card>

        <Card className="space-y-5 p-6 shadow-lg">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
                Task board
              </p>
              <h2 className="mt-2 text-2xl font-bold text-main-700">
                Focused task management
              </h2>
            </div>
            <p className="text-sm text-main-500">
              Showing {paginatedTasks.length} of {filteredTasks.length} task(s)
            </p>
          </div>

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
            ]}
          />

          <div className="flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      </DashboardLayout>

      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-main-700">Create task</h2>
            <p className="text-sm text-main-500">
              Add a new task to your workspace.
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

          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setIsTaskModalOpen(false)}
            />
            <Button label="Save task" onClick={handleAddTask} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TasksPage;
