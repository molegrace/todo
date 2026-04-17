import React from "react";

type AlertProps = {
  message: string;
  type?: "success" | "error";
};

const Alert: React.FC<AlertProps> = ({ message, type = "success" }) => {
  const styles =
    type === "success"
      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border border-red-200 bg-red-50 text-red-700";

  return <div className={`rounded-2xl px-4 py-3 text-sm font-medium shadow-sm ${styles}`}>{message}</div>;
};

export default Alert;
