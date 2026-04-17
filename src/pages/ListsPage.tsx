import React, { useMemo, useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Checkbox from "../components/Checkbox";
import DashboardLayout from "../components/DashboardLayout";
import Input from "../components/Input";
import Modal from "../components/Modal";
import {
  priorityTone,
  useDashboard,
} from "../context/DashboardContext";

const ListsPage: React.FC = () => {
  const { categories, tasks, addCategory, toggleTaskStatus } = useDashboard();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? "Work");

  const categoryCards = useMemo(
    () =>
      categories.map((category) => {
        const categoryTasks = tasks.filter((task) => task.category === category);
        const done = categoryTasks.filter((task) => task.completed).length;

        return {
          label: category,
          total: categoryTasks.length,
          done,
          pending: categoryTasks.length - done,
        };
      }),
    [categories, tasks]
  );

  const visibleTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.category === selectedCategory)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [selectedCategory, tasks]
  );

  const handleAddCategory = () => {
    const created = addCategory(newCategory);
    if (!created) return;

    setSelectedCategory(newCategory.trim());
    setNewCategory("");
    setIsCategoryModalOpen(false);
  };

  return (
    <>
      <DashboardLayout
        title="Lists & Categories"
        actions={
          <Button
            label="+ New list"
            variant="secondary"
            onClick={() => setIsCategoryModalOpen(true)}
          />
        }
      >
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categoryCards.map((category) => (
            <button
              key={category.label}
              type="button"
              onClick={() => setSelectedCategory(category.label)}
              className={`rounded-[2rem] border p-5 text-left shadow-sm transition ${
                selectedCategory === category.label
                  ? "border-main-500 bg-main-700 text-white shadow-lg"
                  : "border-main-200 bg-white hover:-translate-y-1 hover:shadow-lg"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-[0.24em] ${
                  selectedCategory === category.label ? "text-white/60" : "text-main-500"
                }`}
              >
                List
              </p>
              <h3 className="mt-3 text-2xl font-bold">{category.label}</h3>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div
                  className={`rounded-2xl px-3 py-3 ${
                    selectedCategory === category.label
                      ? "bg-white/10"
                      : "bg-main-50"
                  }`}
                >
                  <p className="text-xs opacity-70">Total</p>
                  <p className="mt-2 text-xl font-semibold">{category.total}</p>
                </div>
                <div
                  className={`rounded-2xl px-3 py-3 ${
                    selectedCategory === category.label
                      ? "bg-white/10"
                      : "bg-main-50"
                  }`}
                >
                  <p className="text-xs opacity-70">Done</p>
                  <p className="mt-2 text-xl font-semibold">{category.done}</p>
                </div>
                <div
                  className={`rounded-2xl px-3 py-3 ${
                    selectedCategory === category.label
                      ? "bg-white/10"
                      : "bg-main-50"
                  }`}
                >
                  <p className="text-xs opacity-70">Pending</p>
                  <p className="mt-2 text-xl font-semibold">{category.pending}</p>
                </div>
              </div>
            </button>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <Card className="space-y-5 p-6 shadow-lg">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
                  Selected list
                </p>
                <h2 className="mt-2 text-2xl font-bold text-main-700">
                  {selectedCategory}
                </h2>
              </div>
              <span className="rounded-full bg-main-100 px-4 py-2 text-sm font-medium text-main-600">
                {visibleTasks.length} task(s)
              </span>
            </div>

            <div className="space-y-3">
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-4 rounded-2xl border border-main-100 bg-white px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-semibold text-main-700">{task.title}</p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${priorityTone[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-main-500">
                      Due {task.dueDate} • Created {task.createdAt}
                    </p>
                  </div>

                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTaskStatus(task.id)}
                    label={task.completed ? "Done" : "Pending"}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 p-6 shadow-lg">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
                Why this page?
              </p>
              <h3 className="mt-2 text-2xl font-bold text-main-700">
                Less clutter, better focus
              </h3>
            </div>
            <div className="space-y-3 text-sm leading-7 text-main-500">
              <p>
                Categories now live in their own area, so the main dashboard can stay focused on daily progress.
              </p>
              <p>
                Pick a list to review only the tasks inside it, instead of scanning everything at once.
              </p>
              <p>
                Use this page whenever you want to understand workload by category or clean up your task organization.
              </p>
            </div>
          </Card>
        </section>
      </DashboardLayout>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-main-700">
              Create category
            </h2>
            <p className="text-sm text-main-500">
              Add a fresh list for organizing your tasks.
            </p>
          </div>

          <Input
            label="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full"
          />

          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setIsCategoryModalOpen(false)}
            />
            <Button label="Save category" onClick={handleAddCategory} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ListsPage;
