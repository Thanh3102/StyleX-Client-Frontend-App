"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalProps,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import Input from "../common/Input";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import Link from "next/link";
import { getLocalTimeZone, today } from "@internationalized/date";
import RenderIf from "./RenderIf";
import OtpVerifyModal from "../specific/signup/OtpVerifyModal";
import { SIGN_UP_URL } from "@/util/constaint/api-routes";
import { SyncCart } from "@/app/api/cart";

const LoginSchema = z.object({
  email: z
    .string({ required_error: "Vui lòng nhập một địa chỉ email" })
    .email("Vui lòng nhập một địa chỉ email hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .regex(/^.{8,20}$/, "Mật khẩu cần có từ 08 ký tự tới 20 ký tự"),
});

export type LoginData = z.infer<typeof LoginSchema>;

type Props = {
  redirect: string;
  onLoginClose?: () => void;
  onLoginSuccess?: () => void;
} & Omit<ModalProps, "children">;

const LoginModal = ({
  redirect,
  onLoginClose,
  onLoginSuccess,
  ...props
}: Props) => {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      onClose={() => {
        onLoginClose && onLoginClose();
      }}
      classNames={{
        wrapper: "p-5",
        body: "p-5",
      }}
      {...props}
    >
      <ModalContent className="">
        <ModalBody>
          <RenderIf condition={mode === "login"}>
            <LoginForm
              redirect={redirect}
              onLoginClose={onLoginClose}
              onLoginSuccess={onLoginSuccess}
            />
            <span>
              Bạn chưa có tài khoản ?{" "}
              <span
                className="font-medium hover:cursor-pointer"
                onClick={() => setMode("signup")}
              >
                Đăng ký ngay
              </span>
            </span>
          </RenderIf>
          <RenderIf condition={mode === "signup"}>
            <SignInForm />
            <span>
              Bạn đã có tài khoản ?{" "}
              <span
                className="font-medium hover:cursor-pointer"
                onClick={() => setMode("login")}
              >
                Đăng nhập
              </span>
            </span>
          </RenderIf>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type LoginFormProps = {
  redirect: string;
  onLoginClose?: () => void;
  onLoginSuccess?: () => void;
};

const LoginForm = ({
  redirect,
  onLoginClose,
  onLoginSuccess,
}: LoginFormProps) => {
  const router = useRouter();
  const pathname = usePathname()
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    const guestCartId = localStorage.getItem("cartId");
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      setIsLoading(false);

      if (result?.ok) {
        onLoginSuccess && onLoginSuccess();
        location.replace(pathname);
        toast.success("Đăng nhập thành công");
      } else {
        toast(result ? result.error : "Đã xảy ra lỗi", {
          type: "error",
        });
      }
    } catch (error: any) {
      toast(error.message ?? "Đã xảy ra lỗi", { type: "error" });
      setIsLoading(false);
    }
  };
  return (
    <>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <h4 className="text-3xl font-bold">Đăng nhập</h4>
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
          radius="sm"
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

const signInSchema = z.object({
  name: z
    .string({ required_error: "Vui lòng nhập một địa chỉ email" })
    .min(1, "Vui lòng nhập họ tên")
    .max(50, "Họ tên quá dài")
    .regex(/^[A-Za-zÀ-ỹ\s]+$/, "Họ tên chỉ chứa chữ cái"),
  email: z
    .string({ required_error: "Vui lòng nhập một địa chỉ email" })
    .email("Vui lòng nhập một địa chỉ email hợp lệ"),
  password: z
    .string({ required_error: "Vui lòng nhập mật khẩu" })
    .regex(
      /^(?=[a-zA-Z0-9-_.@]{8,20}$)(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9-_.@]*$/,
      "Mật khẩu cần có từ 08 ký tự tới 20 ký tự (bao gồm cả chữ và số). Chỉ có thể sử dụng các ký tự đặc biệt này -_.@"
    ),
  dob: z.date({ required_error: "Vui lòng chọn ngày sinh" }),
  gender: z.string(),
});

export type SignupData = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignupData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      gender: "Nam",
    },
  });

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      setIsLoading(true);
      const res = await fetch(SIGN_UP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      setIsLoading(false);

      const response = await res.json();

      if (res.ok) {
        // Mở modal nhập OTP nếu response ok
        setShowOtpVerify(true);
        return;
      }

      toast(response.message ?? "Đã xảy ra lỗi", { type: "error" });
    } catch (error: any) {
      toast(error.message ?? "Đã xảy ra lỗi", { type: "error" });
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="w-1/2 min-w-[400px] max-w-[800px] flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h4 className="text-3xl font-bold">Đăng ký</h4>
        <div className="flex flex-wrap -mx-2 [&>*]:px-2 gap-y-4">
          <Input
            label="HỌ TÊN"
            placeholder="Nhập họ tên của bạn"
            isRequired
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            {...register("name")}
            className="w-1/2"
          />

          <Input
            label="ĐỊA CHỈ EMAIL"
            placeholder="Nhập email hợp lệ"
            isRequired
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            {...register("email")}
            className="w-1/2"
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

          <DatePicker
            className="w-1/2"
            size="sm"
            variant="bordered"
            showMonthAndYearPickers
            isInvalid={!!errors.dob}
            errorMessage={errors.dob?.message}
            label="SINH NHẬT"
            description="Không thể chỉnh sửa ngày sinh sau khi bạn đăng ký tài khoản."
            maxValue={today(getLocalTimeZone())}
            onChange={(dateValue) =>
              //@ts-ignore
              setValue("dob", dateValue.toDate(getLocalTimeZone()), {
                shouldValidate: true,
              })
            }
          />

          <RadioGroup
            size="sm"
            className="w-1/2"
            label="GIỚI TÍNH"
            classNames={{ base: "[&>span]:label" }}
            orientation="horizontal"
            defaultValue={"Nam"}
            onValueChange={(value) => setValue("gender", value)}
          >
            <Radio value="Nam">Nam</Radio>
            <Radio value="Nữ">Nữ</Radio>
            <Radio value="Bỏ chọn">Bỏ chọn</Radio>
          </RadioGroup>
        </div>

        <Button
          size="lg"
          radius="sm"
          type="submit"
          className="text-white bg-black font-medium w-fit px-10"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Đăng ký
        </Button>
      </form>

      <RenderIf condition={showOtpVerify}>
        <OtpVerifyModal
          isOpen={showOtpVerify}
          onOpenChange={(open) => setShowOtpVerify(open)}
          data={getValues()}
          onVerifySuccess={() => {}}
        />
      </RenderIf>
    </>
  );
};

export default LoginModal;
