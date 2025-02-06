"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "ชื่อตำแหน่งงานห้ามเว้นว่าง" }),
});

const JobCreatePage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/jobs", values);
      router.push(`/admin/jobs/${response.data.id}`);
      toast.success("สร้างตำแหน่งงานเรียบร้อยแล้ว");
    } catch (error) {
      console.log((error as Error)?.message);
      // แจ้งเตือนด้วย toast notification
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">ตั้งชื่อตำแหน่งงานของคุณ</h1>
        <p className="text-sm text-neutral-500">
          คุณอยากตั้งชื่อตำแหน่งงานว่าอะไร? ไม่ต้องกังวล คุณสามารถเปลี่ยนแปลงได้ในภายหลัง
        </p>
        {/* ฟอร์ม */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            {/* ฟิลด์ของฟอร์ม */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อตำแหน่งงาน</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="เช่น 'Full-Stack Developer'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>บทบาทของตำแหน่งงานนี้</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href={"/admin/jobs"}>
                <Button type="button" variant={"ghost"}>
                  ยกเลิก
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                ดำเนินการต่อ
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JobCreatePage;
