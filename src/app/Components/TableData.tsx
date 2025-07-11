"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { RootState } from '../redux/store';
import { parseCSV, paginateToPage, loadMore } from '../redux/slice/CSVFilter';
import DataTable from 'react-data-table-component';
import { useInView } from 'react-intersection-observer';

export default function TableData() {
  const dispatch = useAppDispatch();
  const { result, headers, loading, visibleData, page, limit} = useAppSelector((state: RootState) => state.csvData);
  const [columns, setColumns] = useState([]);

  const { ref, inView } = useInView({
    threshold: 1.0,
    rootMargin: "0px",
  });

  // Parse CSV on mount
  useEffect(() => {
    dispatch(parseCSV());
  }, [dispatch]);

  // Load more when observer is triggered
  useEffect(() => {
    if (inView) {
      dispatch(loadMore());
    }
  }, [inView, dispatch]);

  // Set dynamic columns
  useEffect(() => {
    if (headers.length > 0) {
      const dynamicCols = headers.map((header) => ({
        name: header,
        selector: (row: any) => row[header],
      }));
      setColumns(dynamicCols);
    }
  }, [headers]);

  if (loading === "Pending") {
    return <div className="p-4 text-center text-lg font-semibold">Loading...</div>;
  }

  return (
    <div className="md:px-10 px-2">
      <h1 className="text-xl font-bold mb-4">CSV Data Table</h1>

      {/* ✅ Scrollable Wrapper with Observer Target */}
      <div
        style={{
          maxHeight: `80vh`,
          overflowY: "auto",
          padding:"2rem 1rem"
        }}
      >
        <DataTable
          columns={columns}
          data={visibleData}
          pagination
          paginationServer
          paginationPerPage={limit}
          paginationDefaultPage={page + 1}
          paginationTotalRows={result.length}
          onChangePage={(newPage) => dispatch(paginateToPage(newPage - 1))}
          highlightOnHover
          dense
          striped
          responsive
        />
        {/* 👇 Intersection trigger must be INSIDE scrollable container */}
        <div ref={ref} style={{ height: 10 }} />
      </div>
    </div>
  );
}
