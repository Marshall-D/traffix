import React, { FC, useState } from "react";
import ReactPaginate from "react-paginate";
import { Button } from "../button";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";

interface Props {
  onTableItemClick: () => void;
}

// Sample data for the table (hourly count)
const data = [
  { hour: "12:00", count: 200 },
  { hour: "13:00", count: 150 },
  { hour: "14:00", count: 250 },
  { hour: "15:00", count: 180 },
  { hour: "16:00", count: 220 },
  { hour: "17:00", count: 170 },
  { hour: "18:00", count: 300 },
  { hour: "19:00", count: 130 },
  { hour: "20:00", count: 240 },
  { hour: "21:00", count: 280 },
  { hour: "22:00", count: 210 },
  { hour: "23:00", count: 160 },
];

const HourlySectionOne: FC<Props> = ({ onTableItemClick }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Set the number of items per page
  const itemsPerPage = 9;

  // Calculate the items for the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = data.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  // Handle page change
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="font-medium">Daily Count</p>
        <div className="">
          <Button
            onClick={onTableItemClick}
            size="sm"
            variant="primary"
            className="text-xs"
          >
            Back to daily view
          </Button>
        </div>
      </div>
      <hr className="mt-4" />
      <div id="table">
        <div
          id="table-header"
          className="flex justify-between gap-3 text-grey-2 mt-4"
        >
          <p className="font-medium ml-16">Hour</p>
          <p className="font-medium">Count</p>
        </div>
        <hr />
        <div id="table-body">
          {currentItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm my-4">
              <p className="ml-16">{item.hour}</p>
              <p>{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Component */}
      <ReactPaginate
        previousLabel={<Icon path={mdiChevronLeft} size={0.7} />} // Previous Icon
        nextLabel={<Icon path={mdiChevronRight} size={0.7} />} // Next Icon
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={
          "pagination flex justify-center items-center mt-4 space-x-2"
        }
        activeClassName={"active"}
        pageClassName={"page-item"}
        pageLinkClassName={
          "page-link px-3 py-1 text-gray-600 " // Removed border classes
        }
        previousClassName={"prev-item text-grey-1"}
        nextClassName={"next-item text-grey-1"}
        disabledClassName={"disabled opacity-50 cursor-not-allowed"}
        // Styling for the active page number
        activeLinkClassName={
          "bg-primary-blue text-primary px-3 py-1 rounded-lg"
        } // Dark blue for active page
      />
    </div>
  );
};

export default HourlySectionOne;
