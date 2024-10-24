import { useEffect, useState } from "react";

export const useDebouncedSearch = (
  delay: number = 1000,
  initValueArg?: string
) => {
  const [initValue, setSearchValue] = useState<string>(initValueArg || "");
  const [dbncValue, setDbncValue] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDbncValue(initValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [initValue, delay]);

  return { searchValue: initValue, setSearchValue, dbncValue };
};
