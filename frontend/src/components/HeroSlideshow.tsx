import { useEffect, useState } from "react";
import { heroSlides } from "../data/products";

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hero-slideshow" aria-label="Hình ảnh thương hiệu Mộc Tâm">
      {heroSlides.map((slide, index) => (
        <img
          className={index === active ? "active" : ""}
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          aria-hidden={index !== active}
        />
      ))}
      <div className="hero-dots" aria-label="Chọn hình ảnh giới thiệu">
        {heroSlides.map((slide, index) => (
          <button
            aria-label={`Hiển thị hình ${index + 1}`}
            aria-current={index === active}
            className={index === active ? "active" : ""}
            key={slide.image}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  );
}
