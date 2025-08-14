import { useState, useEffect } from "react";

const Carousel = () => {
  const slides = [
    "/card1.png",
    "/card2.png",
    "/card3.png",
    "/card4.png",
    "/card5.png",
    "/card6.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[400px]  rounded-lg overflow-hidden">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 h-[400px] flex justify-center items-center"
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
