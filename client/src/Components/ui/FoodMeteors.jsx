import React from "react";

// Food Meteors Component (replacing the regular Meteors)
export const FoodMeteors = ({ number = 20 }) => {
  // Generate random food emoji for each meteor
  const foodEmojis = ["🍎", "🍌", "🥖", "🥗", "🥕", "🍅", "🥔", "🥪", "🥦", "🥑", "🌽", "🍞", "🥐", "🍇", "🥭"];
  
  const meteors = [...Array(number)].map((_, index) => {
    // Get random values for the animation
    const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    const size = 10 + Math.random() * 40; // Size between 10px and 50px
    const left = Math.random() * 100; // Random horizontal position (0-100%)
    const top = Math.random() * 100; // Starting vertical position (0-100%)
    const duration = 2 + Math.random() * 8; // Animation duration 2-10s
    const delay = Math.random() * 10; // Random start delay 0-10s
    
    return (
      <div
        key={index}
        className="absolute z-0 animate-meteor"
        style={{
          left: `${left}%`,
          top: `${top}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          opacity: 0.7,
        }}
      >
        {randomEmoji}
      </div>
    );
  });

  return (
    <div className="absolute inset-0 overflow-hidden">
      {meteors}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(120vh) rotate(180deg);
            opacity: 0;
          }
        }
        
        .animate-meteor {
          animation: float linear infinite;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};