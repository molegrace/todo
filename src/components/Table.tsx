import React from "react";

type Column<T> = {
  id?: string;
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
};

function Table<T extends { id: string | number }>({
  data,
  columns,
  emptyMessage = "No data available.",
}: TableProps<T>) {
  return (
    <div className="max-w-full overflow-x-auto rounded-2xl border border-main-200">
      <table className="min-w-[720px] bg-white sm:min-w-full">
        <thead className="bg-main-100 text-left text-sm text-main-600">
          <tr>
            {columns.map((col) => (
              <th
                key={col.id ?? String(col.accessor)}
                className={`px-4 py-3 font-semibold ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-main-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-t border-main-100 text-sm text-main-700">
                {columns.map((col) => (
                  <td
                    key={col.id ?? String(col.accessor)}
                    className={`px-4 py-3 align-middle ${col.className ?? ""}`}
                  >
                    {col.render ? col.render(row) : String(row[col.accessor])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
