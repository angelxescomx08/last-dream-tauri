import { useState, useEffect, useRef } from "react";

type SpriteLayout =
  | { type: "1D"; frames: number }
  | { type: "2D"; rows: number; columns: number };

interface SpriteAnimatorProps {
  spriteUrl: string;
  frameWidth: number;
  frameHeight: number;
  layout: SpriteLayout;
  fps?: number;
  scale?: number;
}

const SpriteAnimator = ({
  spriteUrl,
  frameWidth,
  frameHeight,
  layout,
  fps = 24,
  scale = 1,
}: SpriteAnimatorProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>();
  const previousTimeRef = useRef<number>(0);

  // Calcular dimensiones totales
  const totalFrames =
    layout.type === "1D" ? layout.frames : layout.rows * layout.columns;
  const columns = layout.type === "1D" ? layout.frames : layout.columns;
  const rows = layout.type === "1D" ? 1 : layout.rows;

  // Calcular posición actual del sprite
  const currentRow = Math.floor(currentFrame / columns);
  const currentColumn = currentFrame % columns;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      
      const elapsed = timestamp - previousTimeRef.current;
      const framesToAdvance = Math.floor(elapsed / (1000 / fps));

      if (framesToAdvance > 0) {
        setCurrentFrame((prev) => (prev + framesToAdvance) % totalFrames);
        previousTimeRef.current = timestamp - (elapsed % (1000 / fps));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [fps, totalFrames]);

  // Resetear animación cuando cambian los parámetros
  useEffect(() => {
    setCurrentFrame(0);
  }, [spriteUrl, layout]);

  // Estilos del contenedor
  const containerStyle: React.CSSProperties = {
    width: frameWidth,
    height: frameHeight,
    transform: `scale(${scale})`,
    transformOrigin: "0 0",
    overflow: "hidden",
    backgroundImage: `url(${spriteUrl})`,
    backgroundPosition: `-${currentColumn * frameWidth}px -${currentRow * frameHeight}px`,
    backgroundSize: `${columns * frameWidth}px ${rows * frameHeight}px`,
    backgroundRepeat: "no-repeat",
  };

  return <div style={containerStyle} />;
};

export default SpriteAnimator;