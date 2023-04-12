import { type ReactNode } from "react";

interface Props {
  colNames: string[];
  children: ReactNode;
}

const Table = ({ colNames, children }: Props) => {
  return (
    <table className="w-full text-left text-sm text-gray-400">
      <thead className=" bg-gray-700 text-xs  uppercase text-gray-400">
        <tr>
          {colNames.map((colName, i) => (
            <th scope="col" key={`${colName}-${i}`} className="px-6 py-3">
              {colName}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
