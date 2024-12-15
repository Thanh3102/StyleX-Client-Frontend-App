"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ActiveFilter = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    const paramsArray: { key: string; value: string }[] = [];
    searchParams.forEach((value, key) => {
      paramsArray.push({ key, value });
    });
    setParams(paramsArray);
  }, [searchParams]);

  return (
    <div className="p-5">
      {params.map((item) => (
        <div className="p-2 bg-gray-100 w-fit" key={item.key}>
          {item.key} : {item.value}
        </div>
      ))}
    </div>
  );
};
export default ActiveFilter;
