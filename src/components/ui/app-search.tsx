"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppSearchProps {
  placeholder?: string;
  onChangeSearchValue: (value: string) => void;
  searchValue: string;
  onSearch: () => void;
  onClearSearch: () => void;
  isDisabledButton?: boolean;
}

export default function AppSearch(props: AppSearchProps) {
  const {
    searchValue,
    placeholder,
    onChangeSearchValue,
    onSearch,
    onClearSearch,
    isDisabledButton = false,
  } = props;

  return (
    <div className="flex w-full items-center gap-2">
      {/* Search Input */}
      <div className="relative w-full">
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => onChangeSearchValue(e.target.value)}
          className="w-full text-muted-foreground text-xs placeholder:text-xs"
        />

        {/* Search clear button */}
        {searchValue && (
          <button
            type="button"
            className="absolute top-1/2 right-1 h-7 w-5 -translate-y-1/2 text-muted-foreground"
            onClick={onClearSearch}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={onSearch} disabled={isDisabledButton}>
          Search
        </Button>
      </div>
    </div>
  );
}
