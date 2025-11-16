import { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";
  className?: string;
  delay?: number;
}

export const AnimatedSection = ({ 
  children, 
  animation = "fade-up",
  className = "",
  delay = 0
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getAnimationClass = () => {
    const baseTransition = "transition-all duration-700 ease-out";
    
    switch (animation) {
      case "fade-up":
        return `${baseTransition} ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`;
      case "fade-in":
        return `${baseTransition} ${
          isVisible ? "opacity-100" : "opacity-0"
        }`;
      case "scale-in":
        return `${baseTransition} ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`;
      case "slide-left":
        return `${baseTransition} ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-8"
        }`;
      case "slide-right":
        return `${baseTransition} ${
          isVisible
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-8"
        }`;
      default:
        return baseTransition;
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
