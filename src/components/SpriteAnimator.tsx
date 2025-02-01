import { useState, useEffect, useRef, useMemo } from "react";

type SpriteLayout =
  | { type: "1D"; frames: number }
  | { type: "2D"; rows: number; columns: number };

type Animation2DMode =
  | { mode: "row"; index: number }
  | { mode: "column"; index: number }
  | { mode: "all" };

interface SpriteAnimatorProps {
  spriteUrl: string;
  frameWidth: number;
  frameHeight: number;
  layout: SpriteLayout;
  fps?: number;
  scale?: number;
  animation2D?: Animation2DMode;
}

const SpriteAnimator = ({
  spriteUrl,
  frameWidth,
  frameHeight,
  layout,
  fps = 24,
  scale = 1,
  animation2D,
}: SpriteAnimatorProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>();
  const previousTimeRef = useRef<number>(0);

  const totalFrames = useMemo(() => {
    if (layout.type === "1D") return layout.frames;
    
    if (!animation2D) return layout.rows * layout.columns;
    
    switch (animation2D.mode) {
      case "row": return layout.columns;
      case "column": return layout.rows;
      default: return layout.rows * layout.columns;
    }
  }, [layout, animation2D]);

  const { currentRow, currentColumn } = useMemo(() => {
    let row = 0;
    let column = 0;

    if (layout.type === "2D") {
      if (animation2D) {
        switch (animation2D.mode) {
          case "row":
            row = Math.min(Math.max(animation2D.index, 0), layout.rows - 1);
            column = currentFrame % layout.columns;
            break;
          
          case "column":
            column = Math.min(Math.max(animation2D.index, 0), layout.columns - 1);
            row = currentFrame % layout.rows;
            break;
          
          default:
            row = Math.floor(currentFrame / layout.columns);
            column = currentFrame % layout.columns;
        }
      } else {
        row = Math.floor(currentFrame / layout.columns);
        column = currentFrame % layout.columns;
      }
    } else {
      column = currentFrame;
    }

    return { currentRow: row, currentColumn: column };
  }, [currentFrame, layout, animation2D]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!previousTimeRef.current) previousTimeRef.current = timestamp;
      
      const elapsed = timestamp - previousTimeRef.current;
      const framesToAdvance = Math.floor(elapsed / (1000 / fps));

      if (framesToAdvance > 0) {
        setCurrentFrame(prev => (prev + framesToAdvance) % totalFrames);
        previousTimeRef.current = timestamp - (elapsed % (1000 / fps));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [fps, totalFrames]);

  useEffect(() => {
    setCurrentFrame(0);
  }, [spriteUrl, layout, animation2D]);

  const containerStyle: React.CSSProperties = {
    width: frameWidth,
    height: frameHeight,
    transform: `scale(${scale})`,
    transformOrigin: "0 0",
    overflow: "hidden",
    backgroundImage: `url(${spriteUrl})`,
    backgroundPosition: `-${currentColumn * frameWidth}px -${currentRow * frameHeight}px`,
    backgroundSize: `${
      (layout.type === "2D" ? layout.columns : layout.frames) * frameWidth
    }px ${(layout.type === "2D" ? layout.rows : 1) * frameHeight}px`,
  };

  return <div style={containerStyle} />;
};

export default SpriteAnimator;