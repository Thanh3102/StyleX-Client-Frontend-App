import { InputProps, Input as NextuiInput } from "@nextui-org/react";
import { forwardRef } from "react";

export interface Props extends InputProps {}

const Input = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return (
    <NextuiInput
      ref={ref}
      labelPlacement="outside"
      variant="underlined"
      radius="none"
      classNames={{
        label: "label",
      }}
      {...props}
    />
  );
});
export default Input;
