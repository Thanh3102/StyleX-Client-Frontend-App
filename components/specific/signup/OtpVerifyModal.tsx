import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/InputOTP";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from "@nextui-org/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SignupData } from "./FormSignup";
import { SIGN_UP_URL, VERIFY_SIGN_UP_URL } from "@/util/constaint/api-routes";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SignInRoute, SignUpRoute } from "@/util/constaint/route";

interface Props extends Omit<ModalProps, "children"> {
  data: SignupData;
}
const OtpVerifyModal = ({ data, ...props }: Props) => {
  const [countDown, setCountdown] = useState(10 * 60);
  const [countDownReSend, setCountdownReSend] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [isCountDownReSend, setIsCountDownReSend] = useState(false);
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const renderCountDown = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60); //
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const handleResend = async () => {
    setIsCountDownReSend(true);
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
        return;
      }

      toast(response.message ?? "Đã xảy ra lỗi", { type: "error" });
    } catch (error: any) {
      toast(error.message ?? "Đã xảy ra lỗi", { type: "error" });
      setIsLoading(false);
    }
  };

  const handleVerify = async (onClose: () => void) => {
    try {
      setIsLoading(true);
      const res = await fetch(VERIFY_SIGN_UP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: otp,
          email: data.email,
        }),
      });
      setIsLoading(false);

      const response = await res.json();

      if (res.ok) {
        toast(response.message ?? "Đã xảy ra lỗi", { type: "success" });
        onClose();
        router.push(SignInRoute)
        return;
      }

      toast(response.message ?? "Đã xảy ra lỗi", { type: "error" });
    } catch (error: any) {
      toast(error.message ?? "Đã xảy ra lỗi", { type: "error" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (countDown === 0) return;

    const interval = setInterval(() => {
      setCountdown((countDown) => countDown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  useEffect(() => {
    if (!isCountDownReSend || countDownReSend === 0) {
      setIsCountDownReSend(false);
      setCountdownReSend(60);
      return;
    }

    const interval = setInterval(() => {
      setCountdownReSend((countDownReSend) => countDownReSend - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountDownReSend, countDownReSend]);

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Xác thực OTP</ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-2">
                <span>
                  Mã OTP đã gửi tới{" "}
                  <span className="font-medium">{data.email}</span>
                </span>
                <span>Mã OTP hết hạn sau {renderCountDown(countDown)}</span>
                <div className="flex items-center justify-center py-4">
                  <InputOTP
                    pattern="^[0-9\s]+$"
                    maxLength={6}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex gap-4">
              <Button
                isDisabled={isCountDownReSend}
                color="warning"
                onClick={handleResend}
              >
                {isCountDownReSend
                  ? renderCountDown(countDownReSend)
                  : "Gửi lại"}
              </Button>
              <Button
                color="primary"
                onClick={() => handleVerify(onClose)}
                isDisabled={otp.length < 6}
              >
                Xác thực
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default OtpVerifyModal;
function setShowOtpVerify(arg0: boolean) {
  throw new Error("Function not implemented.");
}
