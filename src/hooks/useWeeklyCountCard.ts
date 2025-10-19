// src/hooks/useWeeklyCountCard.ts
import { useEffect, useState, useCallback } from "react";
import { WeeklyData } from "../types";

export type FetchWeeklyDataFn = () => Promise<WeeklyData[]>;

interface UseWeeklyCountCardArgs {
  weeklyData?: WeeklyData[];
  onTableItemClick: (date: string | null, week: number | null) => void;
  itemsPerPage?: number;
  /**
   * Optional fetcher for when you integrate with the backend.
   * If provided, the hook will call it once on mount and populate internal state.
   */
  fetchWeeklyData?: FetchWeeklyDataFn;
}

export function useWeeklyCountCard({
  weeklyData = [],
  onTableItemClick,
  itemsPerPage = 7,
  fetchWeeklyData,
}: UseWeeklyCountCardArgs) {
  // UI state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [isClickedOnce, setIsClickedOnce] = useState<number | null>(null);

  // internal data state (allows replacing with server data if fetcher is used)
  const [data, setData] = useState<WeeklyData[]>(weeklyData);

  // keep data in sync when parent prop changes
  useEffect(() => {
    setData(weeklyData ?? []);
  }, [weeklyData]);

  // optionally fetch data on mount if a fetcher is provided
  useEffect(() => {
    let mounted = true;
    if (fetchWeeklyData) {
      fetchWeeklyData()
        .then((res) => {
          if (mounted && Array.isArray(res)) setData(res);
        })
        .catch(() => {
          /* keep behavior minimal: swallow errors here; integration code can handle properly */
        });
    }
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchWeeklyData]);

  // Pagination calculations
  const pageCount = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const offset = currentPage * itemsPerPage;
  const currentItems = data.slice(offset, offset + itemsPerPage);

  // handlers
  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);
  const handleDateChange = useCallback(
    (d: Date | null) => setSelectedDate(d),
    []
  );

  const handleViewDateClick = useCallback(() => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    // Format to YYYY-MM-DD (en-CA format) to match stored weekly data format
    const formattedStringDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(selectedDate);

    const selectedDateObj = new Date(formattedStringDate);

    const matchedWeekData = data.find((item) => {
      const weekStartDate = new Date(item.date);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 6);
      return selectedDateObj >= weekStartDate && selectedDateObj <= weekEndDate;
    });

    if (matchedWeekData) {
      onTableItemClick(formattedStringDate, matchedWeekData.week);
      setShowModal(false);
    } else {
      alert("No data available for this date.");
    }
  }, [data, selectedDate, onTableItemClick]);

  const handleRowClick = useCallback(
    (indexOnPage: number, date: string) => {
      const matchedWeekData = data.find((item) => item.date === date);

      if (isClickedOnce === indexOnPage) {
        // second click -> send selected week
        if (matchedWeekData) {
          onTableItemClick(date, matchedWeekData.week);
        } else {
          onTableItemClick(null, null);
        }
        setIsClickedOnce(null);
      } else {
        // first click -> toggle selection locally
        setSelectedRow(indexOnPage);
        setIsClickedOnce(indexOnPage);
      }
    },
    [data, isClickedOnce, onTableItemClick]
  );

  const handlePageClick = useCallback((event: { selected: number }) => {
    setCurrentPage(event.selected);
    // Optionally reset row selection when page changes, to keep UX consistent:
    setSelectedRow(null);
    setIsClickedOnce(null);
  }, []);

  // allow integration code to manually refresh data
  const loadWeeklyData = useCallback(async () => {
    if (!fetchWeeklyData) return;
    const newData = await fetchWeeklyData();
    setData(newData ?? []);
  }, [fetchWeeklyData]);

  return {
    // state
    currentPage,
    showModal,
    selectedDate,
    selectedRow,
    isClickedOnce,

    // data & pagination
    data,
    currentItems,
    pageCount,

    // handlers
    openModal,
    closeModal,
    handleDateChange,
    handleViewDateClick,
    handleRowClick,
    handlePageClick,

    // integration
    loadWeeklyData,
    setData, // allow parent/integration to set data easily
    setCurrentPage,
    setSelectedRow,
  };
}

export default useWeeklyCountCard;
