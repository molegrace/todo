import React from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import Card from "../components/Card";
import DashboardLayout from "../components/DashboardLayout";
import { getGreeting, priorityTone, useDashboard } from "../context/DashboardContext";

const DashboardPage: React.FC = () => {
  const {
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    dueTodayTasks,
    progressPercent,
    upcomingDeadlines,
    tasks,
  } = useDashboard();

  const highPriorityOpen = tasks.filter(
    (task) => !task.completed && task.priority === "High"
  ).length;

  return (
    <DashboardLayout
      title="Dashboard Overview"
      description="A clear summary of what matters today."
      showHeaderCard={false}
      showSnapshot={false}
    >
      <section className="overflow-hidden rounded-[2rem] border border-main-200 bg-white p-6 text-main-600 shadow-xl sm:p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-6">
            <p className="pt-2 text-xs uppercase tracking-[0.3em] text-main-500">
              {getGreeting()}
            </p>
            <h1 className="whitespace-nowrap text-3xl font-bold text-main-700 sm:text-5xl">
              Your day at a glance
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total Tasks", value: totalTasks },
              { label: "Done Tasks", value: completedTasks },
              { label: "Pending Tasks", value: pendingTasks },
              { label: "High priority Tasks", value: highPriorityOpen },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-main-200 bg-main-100 px-4 py-4 shadow-lg shadow-main-200/60"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-main-500">
                  {item.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-main-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5 p-6 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
                Progress
              </p>
              <h2 className="mt-2 text-2xl font-bold text-main-700">
                Completion status
              </h2>
            </div>
            <span className="rounded-full bg-main-100 px-4 py-2 text-sm font-medium text-main-700">
              {progressPercent}% complete
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-main-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-main-500 to-primary-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-main-50 p-4">
              <p className="text-sm font-semibold text-main-700">Today</p>
              <p className="mt-3 text-4xl font-bold text-main-700">{dueTodayTasks}</p>
              <p className="mt-2 text-sm text-main-500">tasks due today</p>
            </div>
            <div className="rounded-2xl bg-main-50 p-4">
              <p className="text-sm font-semibold text-main-700">Overdue</p>
              <p className="mt-3 text-4xl font-bold text-main-700">{overdueTasks}</p>
              <p className="mt-2 text-sm text-main-500">need attention now</p>
            </div>
            <div className="rounded-2xl bg-main-50 p-4">
              <p className="text-sm font-semibold text-main-700">Done</p>
              <p className="mt-3 text-4xl font-bold text-main-700">{completedTasks}</p>
              <p className="mt-2 text-sm text-main-500">finished successfully</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-6 shadow-lg">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
              Reminders
            </p>
            <h2 className="mt-2 text-2xl font-bold text-main-700">
              Attention points
            </h2>
          </div>

          <Alert message={`${dueTodayTasks} task(s) are due today.`} type="success" />
          <Alert
            message={`${overdueTasks} overdue task(s) need attention.`}
            type={overdueTasks > 0 ? "error" : "success"}
          />

          <div className="rounded-2xl bg-main-50 p-4">
            <p className="text-sm font-semibold text-main-700">Next best action</p>
            <p className="mt-2 text-sm leading-7 text-main-500">
              Use the Tasks page to update statuses and due dates, or open Lists when you want to reorganize categories.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4 p-6 shadow-lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
                Upcoming
              </p>
              <h2 className="mt-2 text-2xl font-bold text-main-700">
                Closest deadlines
              </h2>
            </div>
            <Link
              to="/dashboard/tasks"
              className="text-sm font-medium text-main-600 transition hover:text-main-700"
            >
              Open tasks page
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-3 rounded-2xl bg-main-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
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
                  <p className="mt-2 text-sm text-main-500">{task.category}</p>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-sm text-main-600">
                  {task.dueDate}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-6 shadow-lg">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-main-500">
              Shortcuts
            </p>
            <h2 className="mt-2 text-2xl font-bold text-main-700">
              Go where you need
            </h2>
          </div>

          <Link
            to="/dashboard/tasks"
            className="block rounded-2xl border border-main-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-main-300 hover:bg-main-50"
          >
            <p className="font-semibold text-main-700">Tasks page</p>
            <p className="mt-1 text-sm text-main-500">
              Filter, sort, update, and create tasks.
            </p>
          </Link>

          <Link
            to="/dashboard/lists"
            className="block rounded-2xl border border-main-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-main-300 hover:bg-main-50"
          >
            <p className="font-semibold text-main-700">Lists page</p>
            <p className="mt-1 text-sm text-main-500">
              Review categories and browse tasks by list.
            </p>
          </Link>
        </Card>
      </section>
    </DashboardLayout>
  );
};

export default DashboardPage;
