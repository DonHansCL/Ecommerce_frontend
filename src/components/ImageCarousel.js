import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

function ImageCarousel({ images }) {
  return (
    <div className="w-full h-32 md:h-40 relative"> {/* Altura fija: 8rem en móviles, 10rem en escritorio */}
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        loop={true}
        className="w-full h-full rounded-lg"
      >
        {images.length > 0 ? (
          images.map((img, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center bg-gray-100">
              {/* Contenedor de la imagen */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={`http://localhost:5000/${img}`}
                  alt={`Imagen de Producto ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="flex items-center justify-center bg-gray-100">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/path-to-placeholder-image.jpg"
                alt="No Image Available"
                className="w-32 h-32 object-contain text-gray-500"
              />
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}

export default ImageCarousel;