import Image from "next/image";
import Link from "next/link"; // นำเข้า Link จาก Next.js
import React from "react";

export const Logo = () => {
  return (
    <Link href="https://job-work-beta.vercel.app/"> {/* ใช้ Link เท่านั้น ไม่ต้องใช้ <a> */}
      <Image height={60} width={60} alt="Logo" src="/img/logo.png" />
    </Link>
  );
};
