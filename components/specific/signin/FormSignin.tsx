"use client";

import Input from "@/components/common/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import {} from "@internationalized/date";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { z } from "zod";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const zodSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập một địa chỉ email" })
    .email("Vui lòng nhập một địa chỉ email hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .regex(/^.{8,20}$/, "Mật khẩu cần có từ 08 ký tự tới 20 ký tự"),
});

export type SignupData = z.infer<typeof zodSchema>;

const FormSignin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(zodSchema),
  });

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });


      if (result?.ok) {
        router.push("/");
      } else {
        toast(result ? result.error : "Đã xảy ra lỗi", {
          type: "error",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      toast(error.message ?? "Đã xảy ra lỗi", { type: "error" });
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="w-2/3 min-w-[400px] max-w-[800px] flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h4 className="text-3xl font-bold">Đăng nhập</h4>
        <span>Đăng nhập bằng địa chỉ email và mật khẩu của bạn.</span>

        <Input
          label="ĐỊA CHỈ EMAIL"
          placeholder="Nhập email hợp lệ"
          isRequired
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="MẬT KHẨU"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          isRequired
          description="Mật khẩu cần có từ 08 ký tự tới 20 ký tự (bao gồm cả chữ và số). Chỉ có thể sử dụng các ký tự đặc biệt này -_.@"
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
          endContent={
            showPassword ? (
              <FaRegEyeSlash
                onClick={() => setShowPassword(false)}
                className="hover:cursor-pointer hover:text-gray-500"
              />
            ) : (
              <FaRegEye
                onClick={() => setShowPassword(true)}
                className="hover:cursor-pointer hover:text-gray-500"
              />
            )
          }
          {...register("password")}
        />

        <Button
          size="lg"
          radius="none"
          type="submit"
          className="text-white bg-black font-medium w-fit px-10"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Đăng nhập
        </Button>
      </form>
    </>
  );
};
export default FormSignin;
