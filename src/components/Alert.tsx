import React from "react";

type AlertProps = {
  message: string;
  type?: "success" | "error";
};

const Alert: React.FC<AlertProps> = ({ message, type = "success" }) => {
  const styles =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return <div className={`p-3 rounded ${styles}`}>{message}</div>;
};

export default Alert;
