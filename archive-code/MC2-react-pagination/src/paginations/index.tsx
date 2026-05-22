import React, { useMemo } from "react";
import styles from "./index.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, onPageChange, totalPages }) => {
  const pages = useMemo(() => {
    const pageNumbers: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  }, [totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={currentPage === page ? `${styles.active}` : ""}
          onClick={() => handlePageChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
        >
          {page}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
