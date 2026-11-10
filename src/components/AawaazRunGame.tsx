import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  CloudRain,
  RotateCcw,
  ArrowLeft,
  Pause,
  Play,
  Heart,
  Sparkles,
  Award,
  Sliders,
  X,
  WifiOff,
  Wifi,
  Gauge,
  Layers,
  UserCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import {
  SpriteRenderer,
  PlayerState,
  DogeCompanion,
  Obstacle,
  Collectible,
  Particle,
  LevelTheme,
  CharacterSkin,
} from '../game/spriteRenderer';
import { asmrAudio } from '../game/asmrAudio';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export type GameDifficulty = 'easy' | 'moderate' | 'challenging';

interface AawaazRunGameProps {
  onBackToWebsite: () => void;
}

const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Serene Breeze (Easy)',
    shortLabel: 'Easy',
    baseSpeed: 4.8,
    maxSpeed: 6.0,
    speedScale: 0.0006,
    minObsDist: 540,
    maxObsDist: 780,
    scoreMultiplier: 1,
    desc: 'Ultra-calm stroll with wide obstacle spacing, floaty jumps, and very forgiving hitboxes.',
    badgeBg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
  },
  moderate: {
    label: 'Peaceful Stride (Moderate)',
    shortLabel: 'Moderate',
    baseSpeed: 9.5,
    maxSpeed: 12.5,
    speedScale: 0.0035,
    minObsDist: 260,
    maxObsDist: 380,
    scoreMultiplier: 1.5,
    desc: 'Lively, responsive runner pace with balanced obstacles and quick dodging.',
    badgeBg: 'bg-sky-950/60 border-sky-500/40 text-sky-300',
  },
  challenging: {
    label: 'Swift Ascent (Challenging)',
    shortLabel: 'Challenging',
    baseSpeed: 12.5,
    maxSpeed: 16.0,
    speedScale: 0.005,
    minObsDist: 200,
    maxObsDist: 300,
    scoreMultiplier: 2.5,
    desc: 'High-speed Subway Surfers style sprint for quick reflexes and high scores!',
    badgeBg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
  },
};

const LEVELS: { id: LevelTheme; name: string; desc: string; icon: string }[] = [
  { id: 'twilight', name: 'Twilight Lotus Garden', desc: 'Calm midnight lavender skies, glowing moon & fireflies', icon: '🌸' },
  { id: 'sunset', name: 'Sunset Sakura Valley', desc: 'Warm peach glow with drifting cherry blossoms & pagodas', icon: '🌅' },
  { id: 'bamboo', name: 'Midnight Bamboo Sanctuary', desc: 'Misty emerald bamboo stalks and moonlit lanterns', icon: '🎋' },
];

const SKINS: { id: CharacterSkin; name: string; desc: string; icon: string }[] = [
  { id: 'wanderer', name: 'Lotus Wanderer', desc: 'Anime runner with flowing scarf & teal athletic headband', icon: '🏃' },
  { id: 'shiba_hoodie', name: 'Shiba Hoodie Mascot', desc: 'Cozy golden doge hoodie with cute puppy ears', icon: '🐶' },
  { id: 'zen_cloud', name: 'Zen Cloud Robe', desc: 'Serene lavender monk robes with floating petals', icon: '🧘' },
];

export const AawaazRunGame: React.FC<AawaazRunGameProps> = ({ onBackToWebsite }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isOnline = useOnlineStatus();

  // Settings & Mods State
  const [difficulty, setDifficulty] = useState<GameDifficulty>(() => {
    try {
      const saved = localStorage.getItem('aawaaz_run_difficulty') as GameDifficulty;
      if (saved && DIFFICULTY_CONFIG[saved]) return saved;
    } catch {}
    return 'moderate';
  });

  const [currentLevel, setCurrentLevel] = useState<LevelTheme>('twilight');
  const [currentSkin, setCurrentSkin] = useState<CharacterSkin>('wanderer');

  // React state for HUD
  const [score, setScore] = useState(0);
  const [petalsCollected, setPetalsCollected] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('aawaaz_run_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameover'>('playing');
  const [isMuted, setIsMuted] = useState(false);
  const [isRainActive, setIsRainActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.65);
  const [isSlidingActiveUI, setIsSlidingActiveUI] = useState(false);

  // Core Game Engine Refs
  const engineRef = useRef({
    renderer: new SpriteRenderer(),
    animationFrameId: 0,
    scrollOffset: 0,
    speed: DIFFICULTY_CONFIG[difficulty].baseSpeed,
    distanceMeters: 0,
    petals: 0,
    isPaused: false,
    isGameOver: false,
    groundY: 0,
    isHoldingSlide: false,

    level: 'twilight' as LevelTheme,
    difficulty: 'moderate' as GameDifficulty,

    player: {
      x: 140,
      y: 0,
      width: 44,
      height: 66,
      vy: 0,
      isGrounded: true,
      isJumping: false,
      isSliding: false,
      slideTimer: 0,
      runFrame: 0,
      skin: 'wanderer' as CharacterSkin,
    } as PlayerState,

    doge: {
      x: 25,
      y: 0,
      stride: 0,
      tailWag: 0,
      isHappy: true,
    } as DogeCompanion,

    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    rainDrops: [] as { x: number; y: number; speed: number; len: number }[],

    nextObstacleDist: 280,
    nextCollectibleDist: 140,
    stepTimer: 0,
  });

  // Sync state into ref
  useEffect(() => {
    engineRef.current.level = currentLevel;
  }, [currentLevel]);

  useEffect(() => {
    engineRef.current.player.skin = currentSkin;
  }, [currentSkin]);

  useEffect(() => {
    engineRef.current.difficulty = difficulty;
    try {
      localStorage.setItem('aawaaz_run_difficulty', difficulty);
    } catch {}
  }, [difficulty]);

  // Jump action
  const triggerJump = useCallback(() => {
    const eng = engineRef.current;
    if (eng.isGameOver) {
      restartGame();
      return;
    }
    if (eng.isPaused) return;

    asmrAudio.ensureRunning();

    // If currently sliding, exit slide to jump immediately!
    if (eng.player.isSliding) {
      eng.player.isSliding = false;
      eng.isHoldingSlide = false;
      eng.player.height = 66;
      eng.player.y = eng.groundY - 66;
      setIsSlidingActiveUI(false);
    }

    if (eng.player.isGrounded) {
      // Floaty, forgiving jump in Easy mode; snappy and agile in Moderate/Challenging
      eng.player.vy = eng.difficulty === 'easy' ? -14.4 : -15.4;
      eng.player.isGrounded = false;
      eng.player.isJumping = true;
      asmrAudio.playJump();

      // Jump sparkle particles
      for (let i = 0; i < 6; i++) {
        eng.particles.push({
          x: eng.player.x + 10 + Math.random() * 20,
          y: eng.groundY + 8,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2,
          radius: 2 + Math.random() * 2,
          alpha: 0.85,
          color: '#EAE5F5',
          life: 25,
        });
      }
    }
  }, []);

  // Slide action (Guaranteed instant response & zero desync)
  const startSlide = useCallback((hold: boolean = false) => {
    const eng = engineRef.current;
    if (eng.isGameOver || eng.isPaused) return;

    asmrAudio.ensureRunning();

    // Instant slide crouch
    eng.player.isSliding = true;
    eng.isHoldingSlide = hold;
    // Generous ~820ms slide duration in Easy mode so you never get caught!
    eng.player.slideTimer = eng.difficulty === 'easy' ? 48 : 34;
    eng.player.height = 34; // Low crouch hitbox
    eng.player.y = eng.groundY - 34; // Align to ground
    eng.player.vy = 0;
    eng.player.isGrounded = true;
    eng.player.isJumping = false;

    setIsSlidingActiveUI(true);
    asmrAudio.playSlide();

    // Slide dust trail
    for (let i = 0; i < 5; i++) {
      eng.particles.push({
        x: eng.player.x - 4 - Math.random() * 12,
        y: eng.groundY + 8,
        vx: -2 - Math.random() * 4,
        vy: -Math.random() * 2,
        radius: 2.5 + Math.random() * 2,
        alpha: 0.85,
        color: '#EAE5F5',
        life: 22,
      });
    }
  }, []);

  const stopSlide = useCallback(() => {
    const eng = engineRef.current;
    eng.isHoldingSlide = false;
  }, []);

  // Restart run with current difficulty settings
  const restartGame = useCallback(() => {
    const eng = engineRef.current;
    const cfg = DIFFICULTY_CONFIG[eng.difficulty];

    eng.isGameOver = false;
    eng.isPaused = false;
    eng.speed = cfg.baseSpeed;
    eng.distanceMeters = 0;
    eng.petals = 0;
    eng.scrollOffset = 0;
    eng.obstacles = [];
    eng.collectibles = [];
    eng.particles = [];
    eng.nextObstacleDist = 260;
    eng.nextCollectibleDist = 130;
    eng.isHoldingSlide = false;

    eng.player.y = eng.groundY - 66;
    eng.player.height = 66;
    eng.player.vy = 0;
    eng.player.isGrounded = true;
    eng.player.isJumping = false;
    eng.player.isSliding = false;
    eng.player.slideTimer = 0;

    eng.doge.x = 25;
    eng.doge.y = eng.groundY - 32;

    setScore(0);
    setPetalsCollected(0);
    setIsSlidingActiveUI(false);
    setGameState('playing');
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    const eng = engineRef.current;
    if (eng.isGameOver) return;

    eng.isPaused = !eng.isPaused;
    setGameState(eng.isPaused ? 'paused' : 'playing');
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    asmrAudio.setMuted(newMuted);
  };

  const toggleRain = () => {
    const newRain = !isRainActive;
    setIsRainActive(newRain);
    asmrAudio.toggleRain(newRain);
  };

  const handleVolumeChange = (v: number) => {
    setAudioVolume(v);
    asmrAudio.setVolume(v);
  };

  // Keyboard controls listener (instant response)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyS'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        triggerJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        startSlide(true); // Holding down keeps slide active!
      } else if (e.code === 'KeyP') {
        togglePause();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyR' && engineRef.current.isGameOver) {
        restartGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        stopSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerJump, startSlide, stopSlide, togglePause, restartGame]);

  // Touch Swipe controls
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length > 0) {
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX);

        if (Math.abs(deltaY) > 26 && Math.abs(deltaY) > deltaX) {
          if (deltaY < 0) {
            triggerJump();
          } else {
            startSlide(false);
          }
        }
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [triggerJump, startSlide]);

  // Main 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const eng = engineRef.current;

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.scale(dpr, dpr);

      eng.groundY = rect.height * 0.76;
      if (eng.player.isGrounded && !eng.player.isSliding) {
        eng.player.y = eng.groundY - eng.player.height;
      }
      eng.doge.y = eng.groundY - 32;

      if (eng.rainDrops.length === 0) {
        for (let i = 0; i < 70; i++) {
          eng.rainDrops.push({
            x: Math.random() * rect.width,
            y: Math.random() * rect.height,
            speed: 6 + Math.random() * 4,
            len: 12 + Math.random() * 8,
          });
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const rect = containerRef.current?.getBoundingClientRect();
    const width = rect?.width || 800;
    const height = rect?.height || 500;
    eng.groundY = height * 0.76;
    eng.player.y = eng.groundY - eng.player.height;
    eng.doge.y = eng.groundY - 32;

    const loop = (timestamp: number) => {
      const currentW = canvas.width / (window.devicePixelRatio || 1);
      const currentH = canvas.height / (window.devicePixelRatio || 1);
      eng.groundY = currentH * 0.76;

      const cfg = DIFFICULTY_CONFIG[eng.difficulty];

      if (!eng.isPaused && !eng.isGameOver) {
        // 1. Advance scroll & distance
        eng.scrollOffset += eng.speed;
        eng.distanceMeters += eng.speed * 0.055;

        // Speed progression per difficulty setting
        eng.speed = Math.min(cfg.maxSpeed, cfg.baseSpeed + eng.distanceMeters * cfg.speedScale);

        // 2. Player Animation & Physics
        eng.player.runFrame += 0.85;

        // Footstep ASMR sound
        if (eng.player.isGrounded && !eng.player.isSliding) {
          eng.stepTimer += 1;
          if (eng.stepTimer >= Math.max(8, 15 - Math.floor(eng.speed * 0.8))) {
            asmrAudio.playFootstep();
            eng.stepTimer = 0;
          }
        }

        // Gravity & Jump Physics (Floaty & soothing in Easy mode)
        if (!eng.player.isGrounded && !eng.player.isSliding) {
          const gravity = eng.difficulty === 'easy' ? 0.48 : 0.65;
          eng.player.vy += gravity;
          eng.player.y += eng.player.vy;

          if (eng.player.y >= eng.groundY - eng.player.height) {
            eng.player.y = eng.groundY - eng.player.height;
            eng.player.vy = 0;
            eng.player.isGrounded = true;
            eng.player.isJumping = false;
          }
        }

        // Slide State Management (100% bug-free)
        if (eng.player.isSliding) {
          eng.player.height = 34;
          eng.player.y = eng.groundY - 34;
          eng.player.vy = 0;
          eng.player.isGrounded = true;

          if (!eng.isHoldingSlide) {
            eng.player.slideTimer -= 1;
            if (eng.player.slideTimer <= 0) {
              eng.player.isSliding = false;
              eng.player.height = 66;
              eng.player.y = eng.groundY - 66;
              setIsSlidingActiveUI(false);
            }
          }
        }

        // 3. Cute Doge Companion
        eng.doge.stride += 0.45;
        eng.doge.x = Math.max(20, eng.player.x - 100 + Math.sin(timestamp * 0.003) * 12);
        eng.doge.y = eng.groundY - 32;

        // 4. Spawn Obstacles based on Difficulty
        eng.nextObstacleDist -= eng.speed;
        if (eng.nextObstacleDist <= 0) {
          const rand = Math.random();
          let type: 'stone' | 'bush' | 'lantern' | 'wisteria' | 'bamboo_sprout' = 'stone';
          let obsW = 44;
          let obsH = 28;
          let obsY = eng.groundY - obsH;

          // In Easy mode, 85% ground obstacles, rare overhead obstacles
          if (eng.difficulty === 'easy') {
            if (rand < 0.5) {
              type = 'stone';
              obsW = 38;
              obsH = 22;
              obsY = eng.groundY - obsH + 4;
            } else if (rand < 0.85) {
              type = eng.level === 'bamboo' ? 'bamboo_sprout' : 'bush';
              obsW = 44;
              obsH = 28;
              obsY = eng.groundY - obsH + 4;
            } else {
              type = 'lantern';
              obsW = 30;
              obsH = 40;
              obsY = eng.groundY - 84;
            }
          } else {
            // Standard variety for Moderate & Challenging
            if (rand < 0.3) {
              type = 'stone';
              obsW = 42;
              obsH = 26;
              obsY = eng.groundY - obsH + 4;
            } else if (rand < 0.55) {
              type = eng.level === 'bamboo' ? 'bamboo_sprout' : 'bush';
              obsW = 50;
              obsH = 32;
              obsY = eng.groundY - obsH + 4;
            } else if (rand < 0.78) {
              type = 'lantern';
              obsW = 34;
              obsH = 46;
              obsY = eng.groundY - 84;
            } else {
              type = 'wisteria';
              obsW = 62;
              obsH = 38;
              obsY = eng.groundY - 86;
            }
          }

          eng.obstacles.push({
            x: currentW + 40,
            y: obsY,
            width: obsW,
            height: obsH,
            type,
          });

          eng.nextObstacleDist = cfg.minObsDist + Math.random() * (cfg.maxObsDist - cfg.minObsDist);
        }

        // 5. Spawn Collectibles (More frequent in Easy mode)
        eng.nextCollectibleDist -= eng.speed;
        if (eng.nextCollectibleDist <= 0) {
          const isHigh = Math.random() > 0.5;
          const colY = isHigh ? eng.groundY - 85 : eng.groundY - 45;
          eng.collectibles.push({
            x: currentW + 30,
            y: colY,
            radius: 10,
            type: Math.random() > 0.4 ? 'petal' : 'star',
            rotation: 0,
          });
          eng.nextCollectibleDist =
            eng.difficulty === 'easy'
              ? 80 + Math.random() * 100
              : 110 + Math.random() * 160;
        }

        // 6. Move & Check Obstacles
        for (let i = eng.obstacles.length - 1; i >= 0; i--) {
          const obs = eng.obstacles[i];
          obs.x -= eng.speed;

          const p = eng.player;

          // Forgiving hitboxes in Easy mode so near-misses never stumble
          const inset = eng.difficulty === 'easy' ? 14 : 8;
          const obsInset = eng.difficulty === 'easy' ? 8 : 4;
          const playerHitbox = {
            left: p.x + inset,
            right: p.x + p.width - inset,
            top: p.y + (eng.difficulty === 'easy' ? 12 : 6),
            bottom: p.y + p.height - (eng.difficulty === 'easy' ? 3 : 0),
          };

          const obsHitbox = {
            left: obs.x + obsInset,
            right: obs.x + obs.width - obsInset,
            top: obs.y + obsInset,
            bottom: obs.y + obs.height - (eng.difficulty === 'easy' ? 3 : 0),
          };

          // Slide crouch allows ducking cleanly under high obstacles (lantern & wisteria)
          const isColliding =
            playerHitbox.right > obsHitbox.left &&
            playerHitbox.left < obsHitbox.right &&
            playerHitbox.bottom > obsHitbox.top &&
            playerHitbox.top < obsHitbox.bottom;

          if (isColliding) {
            // Peaceful rest stop with Doge hug
            eng.isGameOver = true;
            asmrAudio.playDogeHug();

            for (let k = 0; k < 16; k++) {
              eng.particles.push({
                x: p.x + p.width / 2,
                y: p.y + p.height / 2,
                vx: (Math.random() - 0.5) * 4,
                vy: -Math.random() * 4 - 1,
                radius: 3 + Math.random() * 3,
                alpha: 1.0,
                color: '#FF7B8E',
                life: 45,
              });
            }

            const rawScore = Math.floor((eng.distanceMeters + eng.petals * 10) * cfg.scoreMultiplier);
            setScore(rawScore);
            setPetalsCollected(eng.petals);

            if (rawScore > highScore) {
              setHighScore(rawScore);
              try {
                localStorage.setItem('aawaaz_run_highscore', rawScore.toString());
              } catch {}
            }

            setGameState('gameover');
            break;
          }

          if (obs.x + obs.width < -50) {
            eng.obstacles.splice(i, 1);
          }
        }

        // 7. Move & Collect Items
        for (let i = eng.collectibles.length - 1; i >= 0; i--) {
          const col = eng.collectibles[i];
          col.x -= eng.speed;
          col.rotation += 0.05;

          const px = eng.player.x + eng.player.width / 2;
          const py = eng.player.y + eng.player.height / 2;
          const dist = Math.hypot(px - col.x, py - col.y);

          if (dist < col.radius + 28) {
            eng.petals += 1;
            asmrAudio.playCollect();

            for (let k = 0; k < 8; k++) {
              eng.particles.push({
                x: col.x,
                y: col.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                radius: 2 + Math.random() * 2,
                alpha: 1.0,
                color: '#FFE082',
                life: 30,
              });
            }

            eng.collectibles.splice(i, 1);
            setPetalsCollected(eng.petals);
            continue;
          }

          if (col.x < -40) {
            eng.collectibles.splice(i, 1);
          }
        }

        // 8. Rain Particles
        if (eng.rainDrops.length > 0) {
          for (const drop of eng.rainDrops) {
            drop.y += drop.speed;
            drop.x -= 1.4;
            if (drop.y > currentH) {
              drop.y = -10;
              drop.x = Math.random() * currentW;
            }
          }
        }

        // 9. Floating Particles
        for (let i = eng.particles.length - 1; i >= 0; i--) {
          const p = eng.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1;
          p.alpha = p.life / 40;
          if (p.life <= 0) {
            eng.particles.splice(i, 1);
          }
        }

        const currentTotal = Math.floor((eng.distanceMeters + eng.petals * 10) * cfg.scoreMultiplier);
        setScore(currentTotal);
      }

      // Render Frame
      ctx.clearRect(0, 0, currentW, currentH);

      eng.renderer.drawBackground(
        ctx,
        currentW,
        currentH,
        eng.scrollOffset,
        isRainActive,
        eng.rainDrops,
        timestamp,
        eng.level
      );

      for (const obs of eng.obstacles) {
        eng.renderer.drawObstacle(ctx, obs);
      }

      for (const col of eng.collectibles) {
        eng.renderer.drawCollectible(ctx, col, timestamp);
      }

      eng.renderer.drawDoge(ctx, eng.doge, eng.groundY, timestamp);
      eng.renderer.drawPlayer(ctx, eng.player, eng.groundY);
      eng.renderer.drawParticles(ctx, eng.particles);

      eng.animationFrameId = requestAnimationFrame(loop);
    };

    eng.animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(eng.animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isRainActive, highScore]);

  // Change difficulty on the fly
  const handleSelectDifficulty = (diff: GameDifficulty) => {
    setDifficulty(diff);
    engineRef.current.difficulty = diff;
    restartGame();
  };

  // Change level environment on the fly
  const handleSelectLevel = (lvl: LevelTheme) => {
    setCurrentLevel(lvl);
    engineRef.current.level = lvl;
  };

  // Change character skin/mod
  const handleSelectSkin = (sk: CharacterSkin) => {
    setCurrentSkin(sk);
    engineRef.current.player.skin = sk;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#17243A] text-white select-none flex flex-col font-sans"
    >
      {/* 1. Top HUD Bar */}
      <header className="relative z-30 w-full px-4 sm:px-6 py-3 bg-[#17243A]/90 backdrop-blur-md border-b border-[#5B8F8A]/25 flex items-center justify-between gap-3">
        
        {/* Left: Back to website & Game title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              asmrAudio.stopAll();
              onBackToWebsite();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-[#EEF3F8] transition-colors cursor-pointer border border-white/10 shadow-xs"
            title="Return to Aawaaz Setu website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Website</span>
            <span className="sm:hidden">Exit</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base sm:text-lg text-[#EAE5F5] tracking-tight">
              Aawaaz Run
            </span>
            <span className="hidden md:inline-block text-[11px] font-semibold text-[#5B8F8A] bg-[#5B8F8A]/20 px-2 py-0.5 rounded-md">
              A Peaceful Escape 🌸
            </span>
          </div>
        </div>

        {/* Center: Live Score, Petals & Difficulty Indicator */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          {/* Difficulty Quick Badge / Dropdown Toggle */}
          <button
            onClick={() => setShowSettings(true)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${DIFFICULTY_CONFIG[difficulty].badgeBg}`}
            title="Click to change difficulty or mods"
          >
            <Gauge className="w-3 h-3" />
            <span>{DIFFICULTY_CONFIG[difficulty].shortLabel}</span>
          </button>

          <div className="flex items-center gap-1.5 font-semibold text-[#FFF5E4]">
            <Award className="w-4 h-4 text-[#FFE082]" />
            <span className="text-[#687385] hidden sm:inline">Score:</span>
            <span className="text-sm sm:text-base font-bold text-white font-mono">{score}m</span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-[#FFAAAA]">
            <Sparkles className="w-4 h-4 text-[#FFD54F]" />
            <span className="text-[#687385] hidden sm:inline">Petals:</span>
            <span className="font-mono text-white">{petalsCollected}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#8E9CB2]">
            <span>Best:</span>
            <span className="font-mono font-semibold text-[#EAE5F5]">{highScore}m</span>
          </div>
        </div>

        {/* Right: Audio, Levels & Settings Controls */}
        <div className="flex items-center gap-2">
          {/* Offline Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border ${
              isOnline
                ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/30 text-amber-300'
            }`}
            title={
              isOnline
                ? 'Online — Cached for offline gameplay via Service Worker'
                : 'Offline Mode active — 100% playable without internet'
            }
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? 'Offline Ready' : 'Offline'}</span>
          </div>

          {/* Rain Ambience Toggle */}
          <button
            onClick={toggleRain}
            className={`p-2 rounded-xl transition-all cursor-pointer border ${
              isRainActive
                ? 'bg-[#5B8F8A] text-white border-[#5B8F8A]'
                : 'bg-white/10 text-[#8E9CB2] hover:text-white border-white/10'
            }`}
            title={isRainActive ? 'Mute Rain Ambience' : 'Enable Soft Rain Ambience'}
          >
            <CloudRain className="w-4 h-4" />
          </button>

          {/* Mute Audio */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#8E9CB2] hover:text-white transition-colors cursor-pointer border border-white/10"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pause */}
          <button
            onClick={togglePause}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#8E9CB2] hover:text-white transition-colors cursor-pointer border border-white/10"
            title={gameState === 'paused' ? 'Resume' : 'Pause (P)'}
          >
            {gameState === 'paused' ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Settings & Mods Menu */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl bg-[#5B8F8A]/20 hover:bg-[#5B8F8A]/35 text-[#EAE5F5] transition-colors cursor-pointer border border-[#5B8F8A]/40"
            title="Difficulty, Levels & Character Mods"
          >
            <Sliders className="w-4 h-4 text-[#5B8F8A]" />
          </button>
        </div>
      </header>

      {/* 2. Main HTML5 Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Quick Help Toast on initial launch */}
        {score < 14 && gameState === 'playing' && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none z-20 px-4 py-2 bg-[#17243A]/85 backdrop-blur-md rounded-2xl border border-white/15 text-center shadow-lg">
            <p className="text-xs sm:text-sm text-[#EAE5F5] font-medium">
              <span className="font-bold text-[#FFE082]">Space / ⬆</span> to Jump ·{' '}
              <span className="font-bold text-[#FFE082]">⬇</span> to Slide · Doge is your friendly running companion!
            </p>
          </div>
        )}

        {/* Live Active Sliding HUD Badge */}
        {isSlidingActiveUI && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-[#5B8F8A] text-white text-[11px] font-bold uppercase tracking-wider rounded-full shadow-lg border border-white/30 animate-pulse pointer-events-none">
            ⚡ Sliding Low
          </div>
        )}

        {/* Pause Overlay with In-Game Difficulty & Level Switcher */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 z-30 bg-[#17243A]/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-[#17243A] border border-[#5B8F8A]/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-[#5B8F8A]/20 text-[#5B8F8A] flex items-center justify-center mx-auto border border-[#5B8F8A]/30">
                <Pause className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#EAE5F5]">Game Paused</h3>
              
              {/* Difficulty Quick Switcher */}
              <div className="text-left space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E9CB2] block">
                  Select Difficulty
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'moderate', 'challenging'] as GameDifficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => handleSelectDifficulty(d)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                        difficulty === d
                          ? 'bg-[#5B8F8A] text-white border-[#5B8F8A] shadow-xs'
                          : 'bg-white/5 border-white/10 text-[#8E9CB2] hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {DIFFICULTY_CONFIG[d].shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={togglePause}
                  className="px-6 py-2.5 rounded-xl bg-[#5B8F8A] hover:bg-[#48756F] text-white font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Resume Run</span>
                </button>
                <button
                  onClick={restartGame}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#EAE5F5] font-medium text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cozy Doge Hug / Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 bg-[#17243A]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="max-w-md w-full bg-[#17243A] border border-[#5B8F8A]/40 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl relative overflow-hidden">
              
              <div className="w-14 h-14 rounded-full bg-[#FFAAAA]/20 text-[#FF7B8E] flex items-center justify-center mx-auto border border-[#FF7B8E]/30 animate-bounce">
                <Heart className="w-7 h-7 fill-current" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B8F8A] block mb-1">
                  A Gentle Rest Stop
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Doge Caught Up With a Hug! 🐾
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#8E9CB2] leading-relaxed">
                You took a peaceful pause. The runner and friendly Doge are resting on the stone path.
              </p>

              {/* Score Recap Card */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#687385] block">Distance</span>
                  <span className="text-lg font-bold font-mono text-white">{score} meters</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#687385] block">Lotus Petals</span>
                  <span className="text-lg font-bold font-mono text-[#FFE082]">{petalsCollected} collected</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-[#8E9CB2]">Current Mode:</span>
                  <span className="font-bold text-[#EAE5F5]">{DIFFICULTY_CONFIG[difficulty].label}</span>
                </div>
                <div className="col-span-2 flex justify-between items-center text-xs">
                  <span className="text-[#8E9CB2]">All-Time Best Distance:</span>
                  <span className="font-bold text-[#EAE5F5] font-mono">{highScore}m</span>
                </div>
              </div>

              {/* Quick Difficulty Switcher Before Next Run */}
              <div className="flex gap-2">
                {(['easy', 'moderate', 'challenging'] as GameDifficulty[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => handleSelectDifficulty(d)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                      difficulty === d
                        ? 'bg-[#5B8F8A] text-white border-[#5B8F8A]'
                        : 'bg-white/5 border-white/10 text-[#8E9CB2] hover:bg-white/10'
                    }`}
                  >
                    {DIFFICULTY_CONFIG[d].shortLabel}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <button
                  onClick={restartGame}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#5B8F8A] hover:bg-[#48756F] text-white font-bold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Run Again (Space / Tap)</span>
                </button>
                <button
                  onClick={() => {
                    asmrAudio.stopAll();
                    onBackToWebsite();
                  }}
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer border border-white/10"
                >
                  Back to Website
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Difficulty, Level Environments & Character Mods Drawer */}
        {showSettings && (
          <div className="absolute top-16 right-4 z-40 w-92 max-w-[calc(100vw-32px)] max-h-[85vh] overflow-y-auto bg-[#17243A]/95 backdrop-blur-xl border border-[#5B8F8A]/40 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#EAE5F5]">
                <Sliders className="w-4 h-4 text-[#5B8F8A]" />
                <span>Difficulty, Levels & Mods</span>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 rounded-lg text-[#8E9CB2] hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Difficulty Selection */}
            <div>
              <span className="font-bold text-[#EAE5F5] uppercase tracking-wider text-[11px] block mb-2">
                🎮 Difficulty Selection
              </span>
              <div className="space-y-2">
                {(['easy', 'moderate', 'challenging'] as GameDifficulty[]).map((d) => (
                  <div
                    key={d}
                    onClick={() => handleSelectDifficulty(d)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      difficulty === d
                        ? 'bg-[#5B8F8A]/20 border-[#5B8F8A] text-white shadow-2xs'
                        : 'bg-white/5 border-white/10 text-[#8E9CB2] hover:bg-white/10'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${difficulty === d ? 'border-[#5B8F8A]' : 'border-white/30'}`}>
                        {difficulty === d && <div className="w-2 h-2 rounded-full bg-[#5B8F8A]" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-white text-xs">{DIFFICULTY_CONFIG[d].label}</span>
                        <span className="text-[10px] font-mono font-semibold text-[#FFE082]">{DIFFICULTY_CONFIG[d].scoreMultiplier}x Score</span>
                      </div>
                      <p className="text-[11px] text-[#8E9CB2] leading-relaxed">
                        {DIFFICULTY_CONFIG[d].desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Level Themes (Environments) */}
            <div className="pt-2 border-t border-white/10">
              <span className="font-bold text-[#EAE5F5] uppercase tracking-wider text-[11px] block mb-2">
                🗺️ Scenic Level Themes
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => handleSelectLevel(lvl.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      currentLevel === lvl.id
                        ? 'bg-[#5B8F8A]/25 border-[#5B8F8A] text-white'
                        : 'bg-white/5 border-white/10 text-[#8E9CB2] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{lvl.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs block text-white truncate">{lvl.name}</span>
                      <span className="text-[10px] text-[#8E9CB2] block truncate">{lvl.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Character Skin Mods */}
            <div className="pt-2 border-t border-white/10">
              <span className="font-bold text-[#EAE5F5] uppercase tracking-wider text-[11px] block mb-2">
                👕 Character Avatar Mods
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SKINS.map((sk) => (
                  <button
                    key={sk.id}
                    onClick={() => handleSelectSkin(sk.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      currentSkin === sk.id
                        ? 'bg-[#5B8F8A]/25 border-[#5B8F8A] text-white'
                        : 'bg-white/5 border-white/10 text-[#8E9CB2] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{sk.icon}</span>
                    <span className="text-[10px] font-bold truncate w-full">{sk.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. ASMR Audio Settings */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="font-bold text-[#EAE5F5] uppercase tracking-wider text-[11px] block">
                🎧 Sound Ambience
              </span>

              <div>
                <div className="flex justify-between mb-1 text-[#8E9CB2]">
                  <span>Volume</span>
                  <span className="font-mono text-white">{Math.round(audioVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#5B8F8A] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[#8E9CB2]">Soft Rain Ambience</span>
                  <input
                    type="checkbox"
                    checked={isRainActive}
                    onChange={toggleRain}
                    className="rounded text-[#5B8F8A] focus:ring-0"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[#8E9CB2]">Songbirds Chirping</span>
                  <input
                    type="checkbox"
                    checked={asmrAudio.isBirdsEnabled}
                    onChange={(e) => {
                      asmrAudio.isBirdsEnabled = e.target.checked;
                    }}
                    className="rounded text-[#5B8F8A] focus:ring-0"
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Mobile Dedicated Jump & Slide Touch Buttons (Instant, Reliable & Hold-Friendly) */}
      <div className="sm:hidden relative z-30 w-full px-4 py-3 bg-[#17243A]/95 border-t border-white/15 flex items-center justify-between gap-3">
        {/* SLIDE BUTTON: Handles both tap and hold! */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            startSlide(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopSlide();
          }}
          onMouseDown={() => startSlide(true)}
          onMouseUp={stopSlide}
          className={`flex-1 py-4 rounded-2xl text-center text-xs font-bold text-white shadow-md active:scale-95 transition-all select-none cursor-pointer border ${
            isSlidingActiveUI
              ? 'bg-[#5B8F8A] border-[#5B8F8A] shadow-lg scale-98'
              : 'bg-white/15 active:bg-white/25 border-white/20'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm">⬇</span>
            <span>SLIDE / DUCK</span>
          </div>
          <span className="text-[10px] text-white/70 block font-normal">Tap or Hold to duck</span>
        </button>

        {/* JUMP BUTTON */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            triggerJump();
          }}
          onClick={triggerJump}
          className="flex-1 py-4 bg-[#5B8F8A] active:bg-[#48756F] border border-[#5B8F8A] rounded-2xl text-center text-xs font-bold text-white shadow-lg active:scale-95 transition-transform select-none cursor-pointer"
        >
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-sm">⬆</span>
            <span>JUMP</span>
          </div>
          <span className="text-[10px] text-white/70 block font-normal">Leap over rocks & bushes</span>
        </button>
      </div>

      {/* 4. Desktop Bottom Quick Help Bar */}
      <footer className="hidden sm:flex relative z-30 px-6 py-2.5 bg-[#17243A]/90 border-t border-white/10 items-center justify-between text-[11px] text-[#8E9CB2]">
        <div className="flex items-center gap-4">
          <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono">⬆</kbd> Jump</span>
          <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono">⬇</kbd> Slide (Hold to stay low)</span>
          <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono">P</kbd> Pause</span>
          <span><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white font-mono">M</kbd> Mute</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium text-[#EAE5F5]">Level: {LEVELS.find(l => l.id === currentLevel)?.name}</span>
          <span className="text-[#687385]">·</span>
          <span className="font-medium text-[#FFE082]">Mode: {DIFFICULTY_CONFIG[difficulty].label}</span>
        </div>
      </footer>
    </div>
  );
};
