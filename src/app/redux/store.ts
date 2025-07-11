import { configureStore } from "@reduxjs/toolkit";
import parsedCSVDATA from "./slice/CSVFilter";

export const store = configureStore({
    reducer:{
        csvData:parsedCSVDATA.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
