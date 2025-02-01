import "./App.css";
import SpriteAnimator from "./components/SpriteAnimator";

function App() {
  return (
    <main className="bg-gray-800 w-dvw h-dvh">
      <SpriteAnimator
        spriteUrl="/characters/heroes/hero_girl.png"
        frameWidth={32}
        frameHeight={32}
        layout={{ type: "2D", rows: 10, columns: 10 }}
        animation2D={{ mode: "row", index: 0 }}
        fps={10}
        scale={3}
      />

      <SpriteAnimator
        spriteUrl="/characters/enemies/1.png"
        frameWidth={122}
        frameHeight={110}
        layout={{ type: "2D", rows: 2, columns: 4 }}
        animation2D={{ mode: "all" }}
        fps={10}
        scale={2}
      />

    </main>
  );
}

export default App;
