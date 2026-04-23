"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface CustomCursorProps {
  children: React.ReactNode;
  cursorContent?: React.ReactNode;
  className?: string;
  cursorClassName?: string;
}

export function CustomCursorArea({
  children,
  cursorContent,
  className = "",
  cursorClassName = "",
}: CustomCursorProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the cursor position
  const springX = useSpring(mouseX, { stiffness: 500, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 28, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    if (isHovered) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered, mouseX, mouseY]);

  return (
    <div
      className={`relative ${className} ${isHovered ? 'cursor-none' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Set cursor-none globally when hovered to ensure it overrides children except pointer elements if desired */}
      {isHovered && (
        <style dangerouslySetInnerHTML={{ __html: `
          .${className.replace(/\s+/g, '.')} * {
            cursor: none !important;
          }
        `}} />
      )}
      
      {children}

      {/* The Custom Cursor */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center ${cursorClassName}`}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {cursorContent || (
          <div className="w-16 h-16 bg-brand-600/90 backdrop-blur-sm text-white rounded-full flex items-center justify-center font-outfit font-semibold text-xs shadow-xl tracking-wider">
            VIEW
          </div>
        )}
      </motion.div>
    </div>
  );
}
