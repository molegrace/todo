import React from "react";

type Column<T> = {
  header: string;
  accessor: keyof T;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

function Table<T extends { id: string | number }>({ data, columns }: TableProps<T>) {
  return (
    <table className="min-w-full border">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={String(col.accessor)} className="p-2 border">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={String(col.accessor)} className="p-2 border">
                {String(row[col.accessor])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
