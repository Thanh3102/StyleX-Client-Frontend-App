import { requestResetPassword } from "@/app/api/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ required_error: "Chưa nhập email" })
    .email("Email không hợp lệ"),
});

type Fields = z.infer<typeof schema>;

const ForgetPasswordButton = () => {
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<Fields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<Fields> = async (data) => {
    try {
      setIsLoading(true);
      const { message } = await requestResetPassword(data.email);
      toast.success("Yêu cầu đặt lại khẩu đã được gửi tới email của bạn");
      onClose();
    } catch (error: any) {
      toast.error(error.message ?? "Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <span
        className="hover:cursor-pointer hover:underline text-blue-500"
        onClick={onOpen}
      >
        Quên mật khẩu
      </span>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Yêu cầu đặt lại mật khẩu</ModalHeader>
          <ModalBody>
            <form
              className="flex flex-col gap-4 items-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <span className="font-medium">
                Vui lòng nhập email bạn đã đăng ký
              </span>
              <Input
                label="Email của bạn"
                placeholder="Nhập email của bạn"
                variant="bordered"
                radius="sm"
                {...register("email")}
              />
              <Button color="primary" radius="sm" fullWidth type="submit">
                Gửi yêu cầu
              </Button>

              <span
                className="hover:cursor-pointer hover:underline text-blue-500"
                onClick={onClose}
              >
                Quay lại đăng nhập
              </span>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ForgetPasswordButton;
