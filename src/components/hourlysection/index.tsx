// src/components/hourlysection/index.tsx
import React, { FC } from "react";
import ReactPaginate from "react-paginate";
import { Button } from "../button";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import { hourlyData as defaultHourlyData } from "@/src/utils/data";
import useHourlySection, { HourlyItem } from "@/src/hooks/useHourlySection";

interface Props {
  onTableItemClick: () => void;
  // optional override of data for testing or future backend integration
  data?: HourlyItem[];
  itemsPerPage?: number;
}

const HourlySectionOne: FC<Props> = ({
  onTableItemClick,
  data = defaultHourlyData,
  itemsPerPage = 9,
}) => {
  const { currentPage, pageCount, currentItems, handlePageClick } =
    useHourlySection([...data], itemsPerPage);

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="text-black text-xl font-semibold">Hourly Count</p>
        <div>
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
          className="flex justify-between gap-3 text-grey-4 my-2 text-xs font-semibold"
        >
          <p className="font-medium">Hour</p>
          <p className="font-medium">Count</p>
        </div>
        <hr />
        <div id="table-body">
          {currentItems.map((item, index) => (
            <div key={index} className="flex justify-between text-sm my-4">
              <p>{item.hour}</p>
              <p className="font-semibold">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Component */}
      <ReactPaginate
        previousLabel={<Icon path={mdiChevronLeft} size={0.7} />}
        nextLabel={<Icon path={mdiChevronRight} size={0.7} />}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={
          "pagination flex justify-center items-center mt-4 space-x-2"
        }
        activeClassName={"active text-white rounded-lg"}
        pageClassName={"page-item"}
        pageLinkClassName={
          "page-link px-3 py-1 text-black hover:bg-grey-3 hover:text-black rounded-lg"
        }
        previousClassName={
          "prev-item text-grey-1 hover:bg-grey-3 hover:text-black rounded-lg"
        }
        nextClassName={
          "next-item text-grey-1 hover:bg-grey-3 hover:text-black rounded-lg"
        }
        disabledClassName={"disabled opacity-50 cursor-not-allowed"}
        activeLinkClassName={
          "bg-primary-blue text-primary px-3 py-1 rounded-lg"
        }
      />
    </div>
  );
};

export default HourlySectionOne;
