// src/hooks/useHourlySection.ts
import { useCallback, useMemo, useState } from "react";

export interface HourlyItem {
  hour: string;
  count: number;
}

/**
 * useHourlySection
 * - Encapsulates pagination state/logic for the hourly table.
 * - Accepts an array of HourlyItem and itemsPerPage.
 */
export default function useHourlySection(
  items: HourlyItem[],
  itemsPerPage = 9
) {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(items.length / itemsPerPage)),
    [items.length, itemsPerPage]
  );

  const offset = useMemo(
    () => currentPage * itemsPerPage,
    [currentPage, itemsPerPage]
  );

  const currentItems = useMemo(
    () => items.slice(offset, offset + itemsPerPage),
    [items, offset, itemsPerPage]
  );

  const handlePageClick = useCallback((event: { selected: number }) => {
    setCurrentPage(event.selected);
  }, []);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(0);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    pageCount,
    currentItems,
    handlePageClick,
    resetToFirstPage,
  } as const;
}
