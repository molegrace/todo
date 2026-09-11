import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import DashboardLayout from "../components/DashboardLayout";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { useDashboard } from "../context/DashboardContext";

const ListsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    categories,
    tasks,
    addCategory,
    renameCategory,
    deleteCategory,
  } = useDashboard();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? "Work");
  const [isManageCategoryModalOpen, setIsManageCategoryModalOpen] = useState(false);
  const [categoryDraft, setCategoryDraft] = useState("");

  useEffect(() => {
    if (!categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0] ?? "Work");
    }
  }, [categories, selectedCategory]);

  const categoryTableData = useMemo(
    () =>
      categories.map((category) => {
        const categoryTasks = tasks.filter((task) => task.category === category);
        const done = categoryTasks.filter((task) => task.completed).length;

        return {
          id: category,
          label: category,
          total: categoryTasks.length,
          done,
          pending: categoryTasks.length - done,
        };
      }),
    [categories, tasks]
  );

  const handleAddCategory = () => {
    const created = addCategory(newCategory);
    if (!created) return;

    setSelectedCategory(newCategory.trim());
    setNewCategory("");
    setIsCategoryModalOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/dashboard/lists/${encodeURIComponent(category)}`);
  };

  const handleUpdateCategory = () => {
    const updated = renameCategory(selectedCategory, categoryDraft);
    if (!updated) return;

    setSelectedCategory(categoryDraft.trim());
    setIsManageCategoryModalOpen(false);
  };

  const handleDeleteCategory = () => {
    const nextSelectedCategory =
      categories.find((category) => category !== selectedCategory) ?? "Work";

    const deleted = deleteCategory(selectedCategory);
    if (!deleted) return;

    setSelectedCategory(nextSelectedCategory);
    setIsManageCategoryModalOpen(false);
  };

  return (
    <>
      <DashboardLayout
        title=""
        actions={
          <Button
            label="+ New list"
            variant="secondary"
            onClick={() => setIsCategoryModalOpen(true)}
          />
        }
      >
        {/* Borderless Categories Table */}
        <div className="py-2">
          <Table
            data={categoryTableData}
            emptyMessage="No categories available."
            borderless
            columns={[
              {
                header: "Category Name",
                accessor: "label",
                render: (cat) => (
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat.label)}
                    className="font-bold text-main-700 hover:text-main-500 hover:underline text-left"
                  >
                    {cat.label}
                  </button>
                ),
              },
              {
                header: "Total Tasks",
                accessor: "total",
                render: (cat) => <span className="font-semibold text-main-700">{cat.total}</span>,
              },
              {
                header: "Done",
                accessor: "done",
                render: (cat) => (
                  <span className="font-semibold text-green-600">{cat.done}</span>
                ),
              },
              {
                header: "Pending",
                accessor: "pending",
                render: (cat) => (
                  <span className="font-semibold text-orange-600">{cat.pending}</span>
                ),
              },
              {
                id: "actions",
                header: "Actions",
                accessor: "id",
                className: "text-right",
                render: (cat) => (
                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      className="px-2.5 py-1.5"
                      title="View category details"
                      aria-label="View category details"
                      onClick={() => handleCategoryClick(cat.label)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-main-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </div>
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

      <Modal
        isOpen={isManageCategoryModalOpen}
        onClose={() => setIsManageCategoryModalOpen(false)}
      >
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-main-700">
              Manage category
            </h2>
            <p className="text-sm text-main-500">
              Edit the category name or remove it from your lists.
            </p>
          </div>

          <Input
            label="Category name"
            value={categoryDraft}
            onChange={(e) => setCategoryDraft(e.target.value)}
            className="w-full"
          />

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              label="Delete"
              variant="danger"
              onClick={handleDeleteCategory}
              disabled={categories.length <= 1}
            />
            <Button
              label="Cancel"
              variant="secondary"
              onClick={() => setIsManageCategoryModalOpen(false)}
            />
            <Button label="Save changes" onClick={handleUpdateCategory} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ListsPage;
