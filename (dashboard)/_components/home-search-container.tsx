"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";
import Box from "@/components/box";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const HomesearchContainer = () => {
  const [title, setTitle] = useState("");

  const router = useRouter();

  const handleClick = () => {
    const href = qs.stringifyUrl({
      url: "/search",
      query: {
        title: title || undefined,
      },
    });

    router.push(href);
  };
  return (
    <div className="w-full  items-center justify-center hidden md:flex mt-8  px-4">
      <Box className="w-3/4 p-4 rounded-full h-16 shadow-lg px-12 text-muted-foreground gap-3 bg-neutral-50">
        <Input
          placeholder="ค้นหาตามชื่อตำแหน่งงาน..."
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 text-lg font-sans bg-transparent outline-none border-none min-w-72 focus:outline-none focus:border-none"
        />

        <Button
          onClick={handleClick}
          disabled={!title}
          className="bg-purple-600 hover:bg-purple-700"
          size={"icon"}
        >
          <Search className="w-5 h-5 min-w-5" />
        </Button>
      </Box>
    </div>
  );
};
