import Link from "next/link";
import { useState, type ReactNode } from "react";

const DashboardItem = ({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  onClick?: () => any;
  href?: string;
  icon: React.FC<any>;
  children: ReactNode;
}) => {
  return (
    <li>
      {href ? (
        <Link href={href}>
          <div className="flex items-center rounded-lg p-2  text-white hover:bg-gray-700">
            {" "}
            {
              <Icon className="h-6 w-6  text-gray-400 transition duration-75 group-hover:text-white" />
            }
            <span className="ml-3">{children}</span>
          </div>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className="flex w-full items-center rounded-lg  p-2 text-white hover:bg-gray-700"
        >
          {
            <Icon className="h-6 w-6 text-gray-400 transition  duration-75 group-hover:text-white" />
          }
          <span className="ml-3">{children}</span>
        </button>
      )}
    </li>
  );
};

interface DropDownNavItemProps {
  icon: React.FC<any>;
  dropDownItems: { text: string; href: string }[];
  children: ReactNode;
}

export const DropDownDashboardItem = ({
  icon: Icon,
  dropDownItems,
  children,
}: DropDownNavItemProps) => {
  const [isDropdownOpened, setIsDropDownOpened] = useState(true);
  return (
    <li>
      <button
        type="button"
        className="group flex w-full items-center rounded-lg p-2 text-white transition  duration-75 hover:bg-gray-700"
        aria-controls="dropdown-example"
        data-collapse-toggle="dropdown-example"
        onClick={() => setIsDropDownOpened((prevState) => !prevState)}
      >
        <Icon className="h-6 w-6 flex-shrink-0  text-gray-400 transition  duration-75 group-hover:text-white" />
        <span
          className="ml-3 flex-1 whitespace-nowrap text-left"
          sidebar-toggle-item="true"
        >
          {children}
        </span>
        <svg
          sidebar-toggle-item="true"
          className="h-6 w-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      <ul
        id="dropdown-example"
        className={`${!isDropdownOpened ? "hidden" : ""} space-y-2 py-2`}
      >
        {dropDownItems.map(({ href, text }, i) => (
          <li key={i}>
            <Link href={href}>
              <span className="group flex w-full items-center rounded-lg p-2 pl-11  text-white transition  duration-75 hover:bg-gray-700">
                {text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default DashboardItem;
