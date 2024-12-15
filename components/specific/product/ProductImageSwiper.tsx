"use client";
import React, { useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { ProductDetail } from "@/app/api/product/product.type";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";

type Props = {
  images: ProductDetail["images"];
};
const ProductImageSwiper = ({ images }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        //@ts-ignore
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        direction="vertical"
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-1/5"
      >
        {images.map((img) => (
          <SwiperSlide
            className="w-full h-full hover:cursor-pointer"
            key={img.publicId}
          >
            <Image
              quality={100}
              alt=""
              src={img.url}
              sizes="100vw"
              fill={true}
              className="w-full h-full object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        direction="vertical"
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Zoom]}
        zoom={{
          toggle: true,
        }}
        className="w-3/4 h-full"
      >
        {images.map((img) => (
          <SwiperSlide className="w-full flex aspect-[3/4]" key={img.publicId}>
            <Image
              quality={100}
              alt=""
              src={img.url}
              sizes="100vw"
              fill={true}
              className="w-full h-full object-cover rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
export default ProductImageSwiper;
