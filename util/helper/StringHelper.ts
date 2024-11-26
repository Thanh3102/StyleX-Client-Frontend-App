export const ISOStringToLocalDate = (
  input: string,
  options: { hideTime?: boolean }
) => {
  const { hideTime = false } = options;

  const newDate = new Date(input);

  if (isNaN(newDate.getTime())) return "";

  const vietnamTime = newDate.toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });

  const [date, time] = vietnamTime.split(", ");
  const [mm, dd, yyyy] = date.split("/");
  const [h, m] = time.split(".")[0].split(":");

  if (!hideTime) return `${dd}/${mm}/${yyyy} ${h}:${m}`;

  return `${dd}/${mm}/${yyyy}`;
};

export const isInteger = (str: string | undefined) => {
  if (!str) return false;
  const num = parseInt(str, 10);
  return !isNaN(num) && Number.isInteger(num) && String(num) === str;
};
