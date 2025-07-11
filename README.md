# 📊 Dynamic CSV Filter Dashboard (BI Filters)

A performant, dynamic business intelligence dashboard built with **React**, **Redux Toolkit**, and **TypeScript** that loads CSV data and supports Amazon-style column-based filtering with pagination and infinite scroll.

---

## 🚀 Features

- ✅ Upload and parse CSV data using **PapaParse**
- ✅ Dynamic column detection (no hardcoding column names)
- ✅ Paginated data (100 rows per page)
- ✅ Infinite scroll (reveals 20 entries at a time)
- ✅ Filters for each column (multi-select + searchable)
- ✅ Interdependent filters (Amazon-style)
- ✅ Dynamic filter options update based on selection
- ✅ Handles large datasets efficiently (e.g., 100k+ rows)
- ✅ Optimized with memoization, lazy rendering, and debounced filtering

---

## 🛠 Tech Stack

- ⚛️ React 18
- 🎯 TypeScript
- ⚙️ Redux Toolkit (State Management)
- 📦 PapaParse (CSV parsing)
- 🎛️ React-Select (multi-select filters)
- 🧪 Jest + React Testing Library (unit testing)
- 🌐 Deployed via Vercel / Netlify

---

## 🧪 How It Works

1. **CSV Stream Parsing**: Uses `Papa.parse` to stream large CSV data.
2. **Dynamic Header Detection**: Headers are extracted from CSV — no hardcoded keys.
3. **Redux State**: Stores the full dataset, visible data, selected filters, available filter options, and pagination info.
4. **Filters**:
   - Selecting a filter updates the table data.
   - Other filters update their available values based on intersection with current filtered dataset.
5. **Pagination**: Only 100 rows loaded per page (to keep memory usage low).
6. **Infinite Scroll**: Shows 20 rows at a time as user scrolls down.

