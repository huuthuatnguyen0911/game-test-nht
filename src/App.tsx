import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(0);
  const [randomPoints, setRandomPoints] = useState<number[]>([]);
  const [currentPoint, setCurrentPoint] = useState(1);
  const [clickedPoints, setClickedPoints] = useState<number[]>([]);
  const [hiddenPoints, setHiddenPoints] = useState<number[]>([]);
  const [fadingPoints, setFadingPoints] = useState<number[]>([]);
  const [pointPositions, setPointPositions] = useState<{
    [key: number]: { top: number; left: number };
  }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameStatus, setGameStatus] = useState<
    "idle" | "playing" | "won" | "lost"
  >("idle");

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (gameStatus === "playing") {
      timer = setInterval(() => setTime((prevTime) => prevTime + 100), 100);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [gameStatus]);

  const startGame = () => {
    const pointsArray = Array.from({ length: points }, (_, i) => i + 1).sort(
      () => Math.random() - 0.5
    );
    setRandomPoints(pointsArray);
    setCurrentPoint(1);
    setClickedPoints([]);
    setHiddenPoints([]);
    setFadingPoints([]);
    setTime(0);
    setGameStatus("playing");

    if (containerRef.current) {
      const { clientWidth: containerWidth, clientHeight: containerHeight } =
        containerRef.current;
      const newPointPositions = pointsArray.reduce((acc, point) => {
        acc[point] = {
          top: Math.random() * (containerHeight - 50),
          left: Math.random() * (containerWidth - 50),
        };
        return acc;
      }, {} as { [key: number]: { top: number; left: number } });
      setPointPositions(newPointPositions);
    }
  };

  const handlePointClick = (point: number) => {
    if (point === currentPoint) {
      setClickedPoints((prev) => [...prev, point]);
      setFadingPoints((prev) => [...prev, point]);
      setTimeout(() => setHiddenPoints((prev) => [...prev, point]), 2000);
      if (point === points) {
        setGameStatus("won");
      } else {
        setCurrentPoint((prev) => prev + 1);
      }
    } else {
      setGameStatus("lost");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 0 && !isNaN(value)) {
      setPoints(value);
    }
  };

  const disableButton = Boolean(points <= 0);

  return (
    <div className="game-container">
      {gameStatus === "won" && (
        <div className="status-success">ALL CLEARED</div>
      )}
      {gameStatus === "lost" && (
        <div className="status-gameover">GAME OVER</div>
      )}
      <h3>LET'S PLAY</h3>
      <div className="input-game">
        <span>Points:</span>
        <input
          type="text"
          value={points}
          onChange={handleInputChange}
          placeholder="Enter number of points"
        />
      </div>
      <div className="times-count">
        <span>Time:</span> <span>{(time / 1000).toFixed(1)}s</span>
      </div>
      <button
        disabled={disableButton}
        className="button-restart"
        onClick={startGame}
      >
        Restart
      </button>

      <div className="points-container" ref={containerRef}>
        {randomPoints.map(
          (point) =>
            !hiddenPoints.includes(point) && (
              <div
                key={point}
                className={`point ${
                  clickedPoints.includes(point) ? "clicked" : ""
                } ${fadingPoints.includes(point) ? "fading" : ""}`}
                onClick={() => handlePointClick(point)}
                style={{
                  position: "absolute",
                  top: pointPositions[point]?.top,
                  left: pointPositions[point]?.left,
                  zIndex: points - point,
                }}
              >
                {point}
              </div>
            )
        )}
      </div>
    </div>
  );
}

export default App;
