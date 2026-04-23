import React, { useState, useEffect, useRef, useCallback } from 'react';

// ── Tunable constants ─────────────────────────────────────────────
const GRAVITY = 0.6;
const FLAP_STRENGTH = -9;
const PIPE_SPEED = 4;
const PIPE_WIDTH_RATIO = 0.15;   // fraction of game width
const GAP_RATIO = 0.36;          // fraction of game height
const BIRD_SIZE_RATIO = 0.075;   // fraction of game width

/**
 * Reusable Flappy Paging game component.
 * Accepts width & height props so it can be embedded anywhere.
 */
export function FlappyGame({ width = 400, height = 500, compact = false }) {
  const GAME_WIDTH = width;
  const GAME_HEIGHT = height;
  const PIPE_WIDTH = Math.round(GAME_WIDTH * PIPE_WIDTH_RATIO);
  const PIPE_GAP = Math.round(GAME_HEIGHT * GAP_RATIO);
  const BIRD_SIZE = Math.max(22, Math.round(GAME_WIDTH * BIRD_SIZE_RATIO));

  const [gameState, setGameState] = useState('START');
  const [birdPos, setBirdPos] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);

  const requestRef = useRef();
  const lastTimeRef = useRef();
  const gameRef = useRef(null);
  const stateRef = useRef({ gameState, birdPos, birdVelocity, pipes, score });

  useEffect(() => {
    stateRef.current = { gameState, birdPos, birdVelocity, pipes, score };
  }, [gameState, birdPos, birdVelocity, pipes, score]);

  const jump = useCallback((e) => {
    if (e && e.type === 'keydown' && e.code !== 'Space') return;
    if (e && e.code === 'Space') e.preventDefault();

    if (stateRef.current.gameState === 'START' || stateRef.current.gameState === 'GAME_OVER') {
      setGameState('PLAYING');
      setBirdPos(GAME_HEIGHT / 2);
      setBirdVelocity(FLAP_STRENGTH);
      setPipes([]);
      setScore(0);
      lastTimeRef.current = performance.now();
    } else if (stateRef.current.gameState === 'PLAYING') {
      setBirdVelocity(FLAP_STRENGTH);
    }
  }, [GAME_HEIGHT]);

  const updateGame = useCallback((timestamp) => {
    const { gameState, birdPos, birdVelocity, pipes } = stateRef.current;
    if (gameState !== 'PLAYING') return;

    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    const dtRatio = Math.min(deltaTime / 16.666, 3);

    let newVelocity = birdVelocity + (GRAVITY * dtRatio);
    let newPos = birdPos + (newVelocity * dtRatio);

    if (newPos > GAME_HEIGHT - BIRD_SIZE || newPos < 0) {
      setGameState('GAME_OVER');
      return;
    }

    let newPipes = pipes.map(pipe => ({ ...pipe, x: pipe.x - (PIPE_SPEED * dtRatio) }));

    if (newPipes.length > 0 && newPipes[0].x + PIPE_WIDTH < 0) {
      newPipes.shift();
      setScore(s => s + 1);
    }

    if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 250) {
      const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
      newPipes.push({ x: GAME_WIDTH, topHeight });
    }

    const hitboxReduction = 4;
    for (let pipe of newPipes) {
      if (
        (GAME_WIDTH / 2 + BIRD_SIZE - hitboxReduction > pipe.x && GAME_WIDTH / 2 + hitboxReduction < pipe.x + PIPE_WIDTH) &&
        (newPos + hitboxReduction < pipe.topHeight || newPos + BIRD_SIZE - hitboxReduction > pipe.topHeight + PIPE_GAP)
      ) {
        setGameState('GAME_OVER');
        return;
      }
    }

    setBirdPos(newPos);
    setBirdVelocity(newVelocity);
    setPipes(newPipes);
    requestRef.current = requestAnimationFrame(updateGame);
  }, [GAME_WIDTH, GAME_HEIGHT, PIPE_WIDTH, PIPE_GAP, BIRD_SIZE]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      lastTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState, updateGame]);

  return (
    <div
      ref={gameRef}
      tabIndex={0}
      className="relative bg-deep rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer select-none outline-none focus:border-cyber transition-colors"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      onMouseDown={jump}
      onTouchStart={jump}
      onKeyDown={jump}
    >
      {/* Score */}
      <div className="absolute top-4 left-0 right-0 text-center z-20 pointer-events-none">
        <span className={`font-black text-white/20 font-mono drop-shadow-md ${compact ? 'text-3xl' : 'text-6xl'}`}>{score}</span>
      </div>

      {/* Start Screen */}
      {gameState === 'START' && (
        <div className="absolute inset-0 bg-void/80 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
          <div className={`text-cyber font-black mb-2 tracking-tighter ${compact ? 'text-base' : 'text-2xl'}`}>READY TO TRANSLATE?</div>
          <div className={`text-white/60 font-mono text-center leading-relaxed ${compact ? 'text-[9px]' : 'text-xs'}`}>
            CLICK OR PRESS SPACE<br/>AVOID PAGE FAULTS
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 bg-[#D13814]/90 flex flex-col items-center justify-center z-30 backdrop-blur-sm">
          <div className={`text-white font-black mb-2 tracking-tighter uppercase ${compact ? 'text-xl' : 'text-4xl'}`}>Page Fault!</div>
          <div className={`text-white/80 font-mono mb-4 bg-void/20 px-3 py-1 rounded-full ${compact ? 'text-[10px]' : 'text-sm'}`}>
            Evicted. Score: {score}
          </div>
          <div className={`bg-white text-[#D13814] px-4 py-1.5 rounded-full font-bold tracking-widest hover:scale-105 transition-transform shadow-lg ${compact ? 'text-[9px]' : 'text-xs'}`}>
            CLICK TO RESTART
          </div>
        </div>
      )}

      {/* Bird (Page) */}
      <div
        className="absolute rounded-lg bg-white border-2 border-void flex items-center justify-center shadow-[0_4px_12px_rgba(163,255,0,0.4)] z-10"
        style={{
          width: BIRD_SIZE,
          height: BIRD_SIZE,
          top: birdPos,
          left: GAME_WIDTH / 2,
          transform: `rotate(${Math.min(Math.max(birdVelocity * 4, -45), 90)}deg)`,
          transition: 'transform 0.1s linear'
        }}
      >
        <span className="text-[8px] font-black font-mono text-void">PG</span>
      </div>

      {/* Pipes (Frames) */}
      {pipes.map((pipe, i) => (
        <React.Fragment key={i}>
          <div
            className="absolute bg-white/10 border border-white/20 rounded-b-xl overflow-hidden"
            style={{ width: PIPE_WIDTH, height: pipe.topHeight, left: pipe.x, top: 0 }}
          >
            {!compact && <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] font-black text-white/30 tracking-widest">RAM</div>}
          </div>
          <div
            className="absolute bg-white/10 border border-white/20 rounded-t-xl overflow-hidden"
            style={{ width: PIPE_WIDTH, height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP, left: pipe.x, bottom: 0 }}
          >
            {!compact && <div className="absolute top-2 left-0 right-0 text-center text-[8px] font-black text-white/30 tracking-widest">DISK</div>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * Standalone full-section wrapper (kept for backward compat but no longer used in App).
 */
export default function FlappyPaging() {
  return (
    <section id="minigame" className="min-h-screen bg-void flex flex-col items-center justify-center py-24 px-4 font-sans relative">
      <div className="flex flex-col items-center gap-8 z-10 w-full max-w-[1100px]">
        <div className="text-center flex flex-col items-center">
          <div className="text-cyber bg-deep px-4 py-1 rounded-full font-bold tracking-[0.3em] text-[10px] uppercase mb-4 shadow-lg border border-void/10">03 / Interactive</div>
          <h2 className="text-4xl md:text-6xl font-black leading-none tracking-tighter text-white">FLAPPY PAGING.</h2>
          <p className="text-white/60 text-sm mt-4 font-mono leading-relaxed max-w-md">
            Navigate the logical Page through the physical Frames. Avoid page faults. Click or press Space.
          </p>
        </div>
        <FlappyGame width={400} height={500} />
      </div>
    </section>
  );
}
