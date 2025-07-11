import { extractCSVStream } from "@/app/Utils/parseCSV";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CSVDATA, ExtractCSVDATA } from "@/app/Types/parseFilters";

const initialState: ExtractCSVDATA = {
  result: [],
  headers: [],
  loading: "idle",
  error: "",
  currentData: [],
  visibleData: [],
  batchSize: 20,
  limit: 100,
  scrollIndex: 1,
  page: 0,
  selectedFilters: {},
  availabelOptions: {},
  availableFilterKeys: [],
  filteredResult: []
};

export const parseCSV = createAsyncThunk(
  "parsedData/parsingData",
  async (_, thunkAPI) => {
    try {
      const response = await extractCSVStream("./dataset_small.csv");

      if (!response?.parseData || response.parseData.length === 0) {
        return thunkAPI.rejectWithValue("Something went wrong. No data found.");
      }

      if (!response?.headers || response.headers.length === 0) {
        return thunkAPI.rejectWithValue("Unable to fetch header fields.");
      }

      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Unknown Error"
      );
    }
  }
);

const parsedCSVDATA = createSlice({
  name: "parsedCSVDATA/parsingData",
  initialState,
  reducers: {
    paginateToPage: (state, action) => {
      const page = action.payload;
      const dataSource = state.filteredResult.length > 0 ? state.filteredResult : state.result;

      const startIndex = page * state.limit;
      const endIndex = startIndex + state.limit;

      state.page = page;
      state.scrollIndex = 1;

      state.currentData = dataSource.slice(startIndex, endIndex);
      state.visibleData = state.currentData.slice(0, state.batchSize);
    },
    loadMore: (state) => {
      const nextIndex = state.scrollIndex * state.batchSize;

      if (nextIndex < state.currentData.length) {
        const nextBatch = state.currentData.slice(0, nextIndex + state.batchSize);
        state.visibleData = nextBatch;
        state.scrollIndex += 1;
      }
    },
    updateSelectedFilter: (state, action) => {
      const { column, values } = action.payload;
      state.selectedFilters[column] = values;
    },
    applyFilters: (state) => {
      const { result, selectedFilters } = state;

      // Only filter if necessary
      const shouldFilter = Object.values(selectedFilters).some(values => values.length > 0);
      const filtered = shouldFilter
        ? result.filter(row => {
            return Object.entries(selectedFilters).every(([col, values]) => {
              return values.length === 0 || values.includes(row[col]);
            });
          })
        : result;

      state.filteredResult = filtered;

      const newOptions: Record<string, string[]> = {};

      Object.keys(selectedFilters).forEach((key) => {
        const baseData = filtered;
        const uniqueValues = Array.from(new Set(baseData.map(row => row[key]))).sort();
        newOptions[key] = uniqueValues;
      });

      state.availabelOptions = newOptions;

      state.page = 0;
      state.currentData = filtered.slice(0, state.limit);
      state.visibleData = state.currentData.slice(0, state.batchSize);
      state.scrollIndex = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(parseCSV.pending, (state) => {
        state.loading = "Pending";
      })
      .addCase(parseCSV.fulfilled, (state, action) => {
        state.result = action.payload?.parseData || [];
        state.headers = action.payload?.headers || [];
        state.loading = "Success";

        state.availableFilterKeys = state.headers.filter((key) => key !== "number");

        const getUnique = (arr: number[]) => [...new Set(arr)].sort((a, b) => a - b);
        const newSelectedFilters: Record<string, any[]> = {};
        const newAvailableOptions: Record<string, any[]> = {};

        state.availableFilterKeys.forEach((key) => {
          const values = getUnique(state.result.map(row => row[key]));
          newSelectedFilters[key] = [];
          newAvailableOptions[key] = values;
        });

        state.selectedFilters = newSelectedFilters;
        state.availabelOptions = newAvailableOptions;

        state.page = 0;
        state.scrollIndex = 1;

        state.currentData = state.result.slice(0, state.limit);
        state.visibleData = state.currentData.slice(0, state.batchSize);
      })
      .addCase(parseCSV.rejected, (state, action) => {
        state.loading = "Failure";
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { paginateToPage, loadMore, updateSelectedFilter, applyFilters } = parsedCSVDATA.actions;
export default parsedCSVDATA;
