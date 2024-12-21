"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import { ReactNode } from "react";
import Link from "next/link";

type Banner = {
  image: string;
  href?: string;
  description?: ReactNode;
};

const BannerSlider = () => {
  const items: Banner[] = [
    {
      image: "/images/banner-nam-3.jpg",
      href: "/collections/nam",
      description: <></>,
    },
    {
      image: "/images/banner-nu-2.jpg",
      href: "/collections/nu",
      description: <></>,
    },
    {
      image: "/images/banner1.jpg",
      href: "/collections/nam",
      description: <></>,
    },
    {
      image: "/images/banner-nu-1.jpg",
      href: "/collections/nu",
      description: <></>,
    },
    {
      image: "/images/banner2.jpg",
      href: "/collections/nam",
      description: <></>,
    },
    {
      image: "/images/banner-nu-3.jpg",
      href: "/collections/nu",
      description: <></>,
    },
    {
      image: "/images/banner-nam-4.jpg",
      href: "/collections/nam",
      description: <></>,
    },
    {
      image: "/images/banner-nu-4.jpg",
      href: "/collections/nam",
      description: <></>,
    },
  ];

  return (
    <Swiper
      direction={"vertical"}
      pagination={{
        clickable: true,
      }}
      autoplay={{
        pauseOnMouseEnter: true,
      }}
      mousewheel
      modules={[Pagination, Mousewheel, Autoplay]}
      className="w-full h-full"
    >
      {items.map((banner, index) => (
        <SwiperSlide key={index}>
          <Link href={banner.href ?? "#"}>
            <div className="relative w-full h-full">
              <Image
                width={0}
                height={0}
                sizes="100vw"
                className=" w-full h-full object-cover"
                alt=""
                src={banner.image}
              />
              <div className="absolute inset-x-[8%] bottom-[23%] m-auto">
                {banner.description}
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default BannerSlider;
