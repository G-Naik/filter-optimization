// components/FilterPanel.tsx
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { updateSelectedFilter, applyFilters } from '../redux/slice/CSVFilter';
import { useDebounce } from './Debounce';

// 🚫 SSR disabled — this prevents hydration error
const ClientOnlySelect = dynamic(() => import('./ClientSelect'), { ssr: false });

const FilterPanel = () => {
  const dispatch = useAppDispatch();
  const { availabelOptions, selectedFilters , availableFilterKeys } = useAppSelector((state: RootState) => state.csvData);

  const debouncedApply = useDebounce(() => dispatch(applyFilters()), 300);

  const handleChange = (selected: any, column: string) => {
    const values = selected.map((option: any) => option.value);
    dispatch(updateSelectedFilter({ column, values }));
    debouncedApply(); // Debounced apply
  };

  const renderDropdown = (column: string) => {
    const options = availabelOptions[column]?.map(value => ({
      label: value,
      value,
    })) || [];

    const selected = selectedFilters[column]?.map(value => ({
      label: value,
      value,
    })) || [];

    return (
      <div key={column} className="mb-2 w-full min-w-[150px]">
        <label className="block font-semibold mb-1 text-sm capitalize">{column}</label>
        <ClientOnlySelect
          options={options}
          value={selected}
          onChange={(selectedOptions: any) => handleChange(selectedOptions || [], column)}
          isMulti
          isSearchable
          placeholder={`Filter ${column}`}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: 32,
              fontSize: 12,
              padding: '1px',
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: '#e2e8f0',
            }),
          }}
        />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white">
      {availableFilterKeys.map(renderDropdown)}
    </div>
  );
};

export default FilterPanel;
