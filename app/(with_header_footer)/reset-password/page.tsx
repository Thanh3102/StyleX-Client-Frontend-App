import ResetPasswordForm from "@/components/specific/reset-password/ResetPasswordForm";
import { Spinner } from "@heroui/react";
import { Suspense } from "react";

type Props = {
  searchParams: { token: string };
};
const Page = ({ searchParams: { token } }: Props) => {
  return (
    <div className="flex items-center justify-center h-full">
      <Suspense fallback={<Spinner />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};
export default Page;
