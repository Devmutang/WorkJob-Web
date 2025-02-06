"use client";

import Box from "@/components/box";
import Image from "next/image";
import React from "react";

export const HomeBanner = () => {
  return (
    <Box className="relative w-full overflow-hidden h-64 justify-center rounded-lg mt-12">
      <Image
        alt="Home Screen Banner"
        src={"/img/job-portal-banner.jpg"}
        fill
        className="w-full h-full object-cover"
      />
    </Box>
  );
};
