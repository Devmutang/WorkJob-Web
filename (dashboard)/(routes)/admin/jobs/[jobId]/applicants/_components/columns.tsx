"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, File } from "lucide-react";
import Link from "next/link";
import { CellActions } from "./cell-actions";

export type ApplicantColumns = {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  appliedAt: string;
  resume: string;
  resumeName: string;
};

export const columns: ColumnDef<ApplicantColumns>[] = [
  {
    accessorKey: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ชื่อเต็ม
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          อีเมล
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ติดต่อ
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },


  {
    accessorKey: "appliedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          วันที่
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, fullname, email } = row.original;
      return <CellActions id={id} fullName={fullname} email={email} />;
    },
  },
];
