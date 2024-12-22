import React, { FC, useState } from "react";
import { Button } from "../button";
interface DailyData {
  date: string;
  count: number;
  day: string;
}
interface Props {
  onTableItemClick: () => void;
  dailyData: DailyData[];
}

const DailySectionWeeklyCountCard: FC<Props> = ({
  onTableItemClick,
  dailyData,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Set the number of items per page
  const itemsPerPage = 9;

  // Calculate the items for the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = dailyData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(dailyData.length / itemsPerPage);

  // Handle page change
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="text-black text-xl font-semibold">Daily Count</p>

        <div>
          <Button
            onClick={onTableItemClick}
            size="sm"
            variant="primary"
            className="text-xs"
          >
            Back to weekly view
          </Button>
        </div>
      </div>
      <hr className="mt-4" />
      <div id="table">
        <div
          id="table-header"
          className="grid grid-cols-3   text-center  text-grey-4 my-2 text-xs font-semibold"
        >
          <p className="col-start-1 text-left">Day</p>
          <p className="col-start-2">Date</p>
          <p className="col-start-3 text-right">Count</p>
        </div>
        <hr />
        <div
          id="table-body"
          className="grid grid-cols-3 gap-8 mt-8 text-sm text-black-2"
        >
          {currentItems.map((item, index) => (
            <React.Fragment key={index}>
              <p className="col-start-1 text-left">{item.day}</p>
              <p className="col-start-2 text-center">{item.date}</p>
              <p className="col-start-3 text-right font-semibold">
                {item.count}
              </p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailySectionWeeklyCountCard;
