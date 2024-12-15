"use client";
import DOMPurify from "isomorphic-dompurify";

type Props = {
  description: string | null;
};
const ProductDescription = (props: Props) => {
  const cleanHtmlDescription = DOMPurify.sanitize(props.description ?? "");

  return (
    <div className="flex flex-col">
      {cleanHtmlDescription && (
        <div dangerouslySetInnerHTML={{ __html: cleanHtmlDescription }} />
      )}
      {!cleanHtmlDescription && <span>Không có</span>}
    </div>
  );
};
export default ProductDescription;
