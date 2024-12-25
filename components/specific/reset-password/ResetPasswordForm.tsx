"use client";

import { resetPassword } from "@/app/api/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z
  .object({
    password: z
      .string({ required_error: "Vui lòng nhập mật khẩu" })
      .regex(
        /^(?=[a-zA-Z0-9-_.@]{8,20}$)(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9-_.@]*$/,
        "Mật khẩu cần có từ 08 ký tự tới 20 ký tự (bao gồm cả chữ và số). Chỉ có thể sử dụng các ký tự đặc biệt này -_.@"
      ),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.confirmPassword !== data.password) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu nhập lại không đúng",
        path: ["confirmPassword"],
      });
    }
  });

type Fields = z.infer<typeof schema>;

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Fields> = async (data) => {
    try {
      setIsLoading(true);
      const { message } = await resetPassword(
        searchParams.get("token") ?? "",
        data.password
      );
      toast.success(message);
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold">Đặt lại mật khẩu</h1>
      <div className="flex flex-col gap-2">
        <Input
          type="password"
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          labelPlacement="outside"
          radius="sm"
          variant="bordered"
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          description="Mật khẩu cần có từ 08 ký tự tới 20 ký tự (bao gồm cả chữ và số). Chỉ có thể sử dụng các ký tự đặc biệt này -_.@"
          {...register("password")}
        />
        <Input
          type="password"
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          labelPlacement="outside"
          radius="sm"
          variant="bordered"
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>
      <Button
        color="primary"
        radius="sm"
        fullWidth
        type="submit"
        isLoading={isLoading}
        isDisabled={isLoading}
      >
        Đặt lại mật khẩu
      </Button>
      <span
        className="text-center text-blue-500 hover:underline hover:cursor-pointer"
        onClick={() => router.push("/")}
      >
        Quay lại trang chủ
      </span>
    </form>
  );
};
export default ResetPasswordForm;
