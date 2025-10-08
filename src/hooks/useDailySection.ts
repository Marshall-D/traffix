// src/hooks/useDailySection.ts
import { useCallback, useState } from "react";

export interface Row {
  date: string;
  count: number;
}

/**
 * useDailySection
 * - Encapsulates modal, selected-date, and selectable-row logic for DailySectionOne.
 * - Calls `onTableItemClick` with a "YYYY-MM-DD" string when user activates a row
 *   (second click) or chooses "View Date" from the modal.
 */
export default function useDailySection(
  onTableItemClick: (date: string) => void,
  initialDate: Date | null = null
) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [selectedRow, setSelectedRow] = useState<number | null>(0);
  const [isClickedOnce, setIsClickedOnce] = useState<number | null>(null);

  const handleCalendarClick = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  const formatToISO = useCallback((d: Date) => {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  }, []);

  const handleViewDateClick = useCallback(() => {
    if (selectedDate) {
      const formattedStringDate = formatToISO(selectedDate);
      onTableItemClick(formattedStringDate);
    }
    setShowModal(false);
  }, [selectedDate, formatToISO, onTableItemClick]);

  const handleRowClick = useCallback(
    (index: number, date: string) => {
      if (isClickedOnce === index) {
        // second click activates the row
        onTableItemClick(date);
        setIsClickedOnce(null);
      } else {
        setSelectedRow(index);
        setIsClickedOnce(index);
      }
    },
    [isClickedOnce, onTableItemClick]
  );

  return {
    showModal,
    setShowModal,
    selectedDate,
    selectedRow,
    isClickedOnce,
    setSelectedRow,
    setIsClickedOnce,
    handleCalendarClick,
    handleDateChange,
    handleViewDateClick,
    handleRowClick,
  } as const;
}
