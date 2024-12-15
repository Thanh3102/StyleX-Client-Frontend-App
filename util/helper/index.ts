export const clearParams = (
  urlSearchParams: URLSearchParams,
  params: string | string[],
  pathname: string
) => {
  // Nếu giá trị rỗng thì sẽ xóa nếu đang có giá trị
  if (typeof params === "string") {
    urlSearchParams.delete(params);
  }

  if (Array.isArray(params)) {
    for (let param of params) {
      urlSearchParams.delete(param);
    }
  }

  // Chuyển về dạng string
  const search = urlSearchParams.toString();
  const query = search ? `?${search}` : "";
  return `${pathname}${query}`;
};

export const updateSearchParams = (
  urlSearchParams: URLSearchParams,
  params: { name: string; value: string | null | undefined }[],
  pathname: string
) => {
  // Nếu giá trị rỗng thì sẽ xóa nếu đang có giá trị
  for (let param of params) {
    if (!param.value) {
      if (urlSearchParams.has(param.name)) urlSearchParams.delete(param.name);
    } else {
      // Nếu có giá trị thì sẽ cập nhật nếu có, thêm vào nếu không có param
      if (urlSearchParams.has(param.name)) {
        urlSearchParams.set(param.name, param.value);
      } else {
        urlSearchParams.append(param.name, param.value);
      }
    }
  }

  // Chuyển về dạng string
  const search = urlSearchParams.toString();
  const query = search ? `?${search}` : "";
  return `${pathname}${query}`;
};
