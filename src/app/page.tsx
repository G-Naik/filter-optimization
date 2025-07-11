"use client"
import React from 'react'
import TableData from './Components/TableData'
import FilterPanel from './Components/FilterTable'

export default function page() {
  return (
    <div>
      <FilterPanel />
      <TableData />
    </div>
  )
}
