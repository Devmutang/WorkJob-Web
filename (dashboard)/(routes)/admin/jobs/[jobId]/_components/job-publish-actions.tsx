"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

export const JobPublishAction = ({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      if (isPublished) {
        // unpublish the job
        await axios.patch(`/api/jobs/${jobId}/unpublish`);
        toast.success("งานไม่ได้เผยแพร่");
      } else {
        await axios.patch(`/api/jobs/${jobId}/publish`);
        toast.success("งานได้รับการเผยแพร่");
      }
      router.refresh();
    } catch (error) {
      toast.error("มีบางอย่างผิดพลาด");
      console.log((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/jobs/${jobId}`);
      toast.success("งานถูกลบ");
      router.refresh();
      return router.push("/admin/jobs");
    } catch (error) {
      toast.error("มีบางอย่างผิดพลาด");
      console.log((error as Error)?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant={"outline"}
        onClick={onClick}
        disabled={disabled || isLoading}
        size={"sm"}
      >
        {isPublished ? "ยกเลิกการเผยแพร่งาน" : "เผยแพร่งาน"}
      </Button>

      <Button
        variant={"destructive"}
        size={"icon"}
        disabled={isLoading}
        onClick={onDelete}
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
};
