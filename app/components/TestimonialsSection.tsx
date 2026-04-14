"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SiteContent } from "@/lib/data";
import { useInView } from "../hooks/useInView";
import { FaFilePdf, FaPlay, FaXmark } from "react-icons/fa6";

type Item = { title: string; type: "image" | "video" | "pdf"; url: string; caption: string };

function LightBox({ item, onClose }: { item: Item; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-gray-800 hover:bg-cyan-500 flex items-center justify-center text-white transition-colors">
          <FaXmark size={16} />
        </button>
        {item.type === "image" && (
          <Image src={item.url} alt={item.title} width={1200} height={900} className="w-full max-h-[80vh] object-contain rounded-xl" unoptimized />
        )}
        {item.type === "video" && <video src={item.url} controls autoPlay className="w-full max-h-[80vh] rounded-xl" />}
        {item.type === "pdf" && <iframe src={item.url} className="w-full h-[80vh] rounded-xl bg-white" />}
        {item.caption && <p className="text-gray-300 text-sm text-center mt-4">{item.caption}</p>}
      </div>
    </div>
  );
}

export default function TestimonialsSection({ content }: { content: SiteContent }) {
  const { ref, inView } = useInView();
  const [active, setActive] = useState<Item | null>(null);
  const testimonials = content.testimonials ?? [];

  return (
    <section ref={ref} id="testimonials" className="min-h-screen bg-[#0f172a] text-white px-8 md:px-20 py-20">
      <p className={`text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2 fade-up ${inView ? "in-view" : ""}`}>Gallery</p>
      <h2 className={`text-4xl font-bold mb-3 fade-up delay-100 ${inView ? "in-view" : ""}`}>Testimonials</h2>
      <div className={`title-bar mb-12 ${inView ? "in-view" : ""}`} />

      {testimonials.length === 0 ? (
        <div className="border-2 border-dashed border-gray-700 rounded-2xl p-16 text-center">
          <p className="text-gray-500 text-sm">No testimonials added yet.</p>
        </div>
      ) : (
        <div className={`fade-up delay-200 ${inView ? "in-view" : ""}`}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640:  { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((item, i) => (
              <SwiperSlide key={i}>
                <div
                  onClick={() => setActive(item)}
                  className="bg-[#111827] rounded-2xl overflow-hidden cursor-pointer group border border-gray-800 hover:border-cyan-400/50 transition-all duration-300 card-hover"
                >
                  <div className="relative h-48 bg-[#1e2a3a] flex items-center justify-center overflow-hidden">
                    {item.type === "image" && (
                      <Image src={item.url} alt={item.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    )}
                    {item.type === "video" && (
                      <>
                        <video src={item.url} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-cyan-500/90 flex items-center justify-center shadow-lg shadow-cyan-500/40 group-hover:scale-110 transition-transform">
                            <FaPlay className="text-black ml-1" size={18} />
                          </div>
                        </div>
                      </>
                    )}
                    {item.type === "pdf" && (
                      <div className="flex flex-col items-center gap-2">
                        <FaFilePdf className="text-red-400" size={52} />
                        <span className="text-gray-400 text-xs">PDF Document</span>
                      </div>
                    )}
                    {/* Type badge */}
                    <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold ${
                      item.type === "image" ? "bg-cyan-500/80 text-white" :
                      item.type === "video" ? "bg-purple-500/80 text-white" :
                      "bg-red-500/80 text-white"
                    }`}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                    {item.caption && <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.caption}</p>}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {active && <LightBox item={active} onClose={() => setActive(null)} />}
    </section>
  );
}
