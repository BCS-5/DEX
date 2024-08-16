import { useMemo } from "react";
import MOCK_DATA from "./MOCK_DATA.json";
import { COLUMNS } from "./columns";
import { usePagination, useTable } from "react-table";
import "./table.css";

export const PaginationTable = () => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => MOCK_DATA, []);

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      usePagination
    );

  return (
    <div className="table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaginationTable;
