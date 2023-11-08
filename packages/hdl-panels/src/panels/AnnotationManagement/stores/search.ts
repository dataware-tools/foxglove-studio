import { Id, Index } from "flexsearch";
import create from "zustand";

export type SearchState = {
  highlightedTexts: string[];
  setHighlightedTexts: (newHighlightedTexts: string[]) => void;
  searchText: string;
  setSearchText: (newSearchText: string) => void;
  searchResult: Set<Id> | null;
  setSearchResult: (newSearchResult: Set<Id> | null) => void;
  index: Index;
};

export const useSearchState = create<SearchState>((set) => {
  const flexSearch = new Index({
    tokenize: "full",
  });
  return {
    highlightedTexts: [""],
    setHighlightedTexts: (highlightedTexts) => set({ highlightedTexts }),
    searchText: "",
    setSearchText: (searchText) => set({ searchText }),
    searchResult: null,
    setSearchResult: (searchResult) => set({ searchResult }),
    index: flexSearch,
  };
});
