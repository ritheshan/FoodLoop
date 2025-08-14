import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

const LiveImpactCounter = ({ target = 1000, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    if (!counterRef.current) return;

    let counterValue = { val: 0 };

    const tween = gsap.to(counterValue, {
      val: target,
      duration,
      ease: "power3.out",
      scrollTrigger: {
        trigger: counterRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        setCount(Math.floor(counterValue.val));
      },
    });

    return () => {
      tween.kill();
    };
  }, [target, duration]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = counterRef.current;

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            confetti({
              particleCount: 100,
              spread: 60,
              origin: { y: 1 },
            });

            // observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.9,
      }
    );

    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  return (
    <div
      ref={counterRef}
      className="bg-green-300 font-merriweather w-full py-3  px-6 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center text-center mx-auto"
    >
      <h3 className="text-5xl md:text-4xl font-semibold  text-green-700 mb-2 md:mb-0">
        ❤️Live Impact❤️
      </h3>
      <p className="text-5xl md:text-6xl font-merriweather text-green-900">
        {count.toLocaleString()}
      </p>
      <p className="text-3xl  md:text-4xl font-semibold  text-black mt-2 md:mt-0">
        Meals Donated Through FoodLoop
      </p>
    </div>
  );
};

export default LiveImpactCounter;
