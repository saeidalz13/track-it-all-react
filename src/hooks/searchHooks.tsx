import { useEffect, useState } from "react";

export const useDebouncedSearch = (delay: number = 1000) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [dbncValue, setDbncValue] = useState<string>("");
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDbncValue(searchValue);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [searchValue, delay]);
  
    return { searchValue, setSearchValue, dbncValue };
  };