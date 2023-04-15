import { type Book } from "@prisma/client";

const Book = ({
  author,
  availableCopies,
  publisher,
  title,
  yearOfRelease,
  renderMoreCols,
}: Book & { renderMoreCols?: () => JSX.Element | false }) => {
  return (
    <tr className="border-b border-gray-700 bg-gray-800 hover:bg-gray-600">
      <th
        scope="row"
        className="whitespace-nowrap px-6 py-4 font-medium text-white"
      >
        {title}
      </th>
      <td className="px-6 py-4">{author}</td>
      <td className="px-6 py-4">{publisher}</td>
      <td className="px-6 py-4">{yearOfRelease}</td>
      <td className="px-6 py-4">{availableCopies}</td>
      {renderMoreCols && renderMoreCols()}
    </tr>
  );
};

export default Book;
