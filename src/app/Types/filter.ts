export type ModKey = 'mod3' | 'mod4' | 'mod5' | 'mod6';

export interface Filters {
  mod3: number[];
  mod4: number[];
  mod5: number[];
  mod6: number[];
}


export interface CSVFilters {
    selectedFilters:Filters;
    availabelOptions:Filters;
}