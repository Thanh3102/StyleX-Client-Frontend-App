import {
  DatePicker as NextuiDatePicker,
  DatePickerProps,
} from "@nextui-org/react";

interface Props extends DatePickerProps {}

const DatePicker = (props: Props) => {
  return (
    <NextuiDatePicker
      radius="none"
      labelPlacement="outside"
      variant="underlined"
      classNames={{
        base: "[&>[data-slot='label']]:label",
      }}
      {...props}
    />
  );
};
export default DatePicker;
