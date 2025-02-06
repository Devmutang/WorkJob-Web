"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";

export const DateFilter = () => {
  const data = [
    { value: "today", label: "วันนี้" },
    { value: "yesterday", label: "เมื่อวาน" },
    { value: "thisWeek", label: "สัปดาห์นี้" },
    { value: "lastWeek", label: "สัปดาห์ที่แล้ว" },
    { value: "thisMonth", label: "เดือนนี้" },
  ];

  const router = useRouter();
  const pathname = usePathname();

  const onChange = (value: string) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      createdAtFilter: value,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  };

  return (
    <Select onValueChange={(selected) => onChange(selected)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter By Date" />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
