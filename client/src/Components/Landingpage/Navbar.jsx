import TemporaryDrawer from "./Temporarydrawer";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const Navbar = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const element = sectionRef.current;

    gsap.fromTo(
      element,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.9,
        delay: 5,
        ease: "bounce",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);
  return (
    <div
      ref={sectionRef}
      className="sticky top-3 z-50 flex place-content-between mx-4  p-2  font-Birthstone"
    >
      <div className="rounded-full flex items-center  ">
        <div className="w-[110px] h-auto">
          <img src="logo.png" />
        </div>
      </div>
      <div className="toggle">
        <TemporaryDrawer />
      </div>
    </div>
  );
};

export default Navbar;
