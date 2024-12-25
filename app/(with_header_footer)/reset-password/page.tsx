import ResetPasswordForm from "@/components/specific/reset-password/ResetPasswordForm";
import { Spinner } from "@nextui-org/react";
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
