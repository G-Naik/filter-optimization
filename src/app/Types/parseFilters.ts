import { Filters } from "./filter";

export interface CSVDATA {
  number: number;
  mod3: number;
  mod4: number;
  mod5: number;
  mod6: number;
}

export interface ExtractCSVDATA {
  result: CSVDATA[];
  headers: string[];
  loading: "idle" | "Pending" | "Success" | "Failure";
  error:string;
  currentData:CSVDATA[];
  visibleData:CSVDATA[];
  batchSize:number;
  scrollIndex:number,
  limit:number,
  page:number,
  selectedFilters: Record<string, number[]>; // dynamic
  availabelOptions: Record<string, number[]>;
  availableFilterKeys:string[]
  filteredResult:CSVDATA[]
}