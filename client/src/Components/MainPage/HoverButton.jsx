import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
export default function ButtonWithAvatar() {
  
  // State for the HoverBorderGradient component
  const [hovered, setHovered] = useState(false);
 
  const [direction, setDirection] = useState("TOP");
const navigate = useNavigate();
 
  // Rotate direction function
  const rotateDirection = (currentDirection) => {
    const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };
  
  const handleAvatarClick = () => {
    navigate('/joyloop');
  };
  // Gradient maps
  const movingMap = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
  };
  
  const highlight = "radial-gradient(75% 181.16% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";
  
  // Effect for animation when not hovered
  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);
  
  return (
    <div className="flex flex-col items-center gap-8 p-1">
           
      {/* HoverBorderGradient button */}
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleAvatarClick}
       
        className="relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition duration-500 items-center flex-col gap-10 h-min justify-center overflow-visible p-px w-fit"
      >
        <div className="w-auto text-white z-10 bg-black px-4 py-2 rounded-full">
        Loops of Joy ❤️
        </div>
        
        <div
          className="flex-none inset-0 overflow-hidden absolute z-0 rounded-full"
          style={{
            filter: "blur(2px)",
            position: "absolute",
            width: "100%",
            height: "100%",
            background: hovered ? highlight : movingMap[direction],
            transition: "background 1s linear"
          }}
        />
        
        <div className="bg-black absolute z-1 flex-none inset-2 rounded-full" />
      </button>
    </div>
  );
}