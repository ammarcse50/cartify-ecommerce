import Link from "next/link";
import { JSX } from "react";

interface PaginationBarProps {
  currrentPage: number;
  totalPages: number;
}

export default function PaginationBar({
  currrentPage,
  totalPages,
}: PaginationBarProps) {
  // const maxPage = Math.min(totalPages, Math.max(currrentPage + 4, 10));

  // const minPage = Math.max(1, Math.min(currrentPage - 5, maxPage - 9));
   
   const pagesTotal= [...Array(totalPages).keys()]

  const numberPageItems: JSX.Element[] = [];

  for (let page = 1; page <= pagesTotal.length; page++) {
    numberPageItems.push(
      <Link
        href={"?page=" + page}
        key={page}
        className={`join-item btn ${
          currrentPage === page ? "btn-active pointer-events-none" : ""
        }`}
      >
        {page}
      </Link>
    );
  }

  return (
    <>
      <div className="join hidden sm:block text-white">{numberPageItems}</div>
      <div className="join block sm:hidden">
        {currrentPage > 1 && (
          <Link href={"?page=" + (currrentPage - 1)}>«</Link>
        )}
        <button className="join-item btn pointer-events-none">
          page{currrentPage}
        </button>
        {currrentPage < totalPages && (
          <Link href={"?page=" + (currrentPage + 1)}>»</Link>
        )}

      
      </div>
      
    </>
  );
}
