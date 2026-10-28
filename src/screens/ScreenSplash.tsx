import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

export const ScreenSplash: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate 28 circular sparkles bursting outwards from the logo
    const generated: Sparkle[] = Array.from({ length: 28 }).map((_, i) => {
      const angle = (i / 28) * Math.PI * 2 + (Math.random() * 0.15 - 0.075);
      const distance = 65 + Math.random() * 65;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance * 0.8, // account for logo 100:60 aspect
        size: 2 + Math.random() * 3,
        color: i % 4 === 0 ? '#FFFFFF' : i % 2 === 0 ? '#FF3B47' : '#E30613',
        delay: Math.random() * 0.2,
      };
    });
    setSparkles(generated);

    // Transition to welcome screen smoothly (1.2s)
    const timer = setTimeout(() => {
      navigate('/welcome', { replace: true });
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate]);

  // Canvas animation: Smooth flowing blue smoke waves & floating bokeh particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Bokeh particles: gentle blue drifting spheres
    interface Particle {
      x: number;
      y: number;
      radius: number;
      baseAlpha: number;
      vx: number;
      vy: number;
      color: string;
    }

    const particleCount = 40;
    const particles: Particle[] = [];
    const blueTones = [
      'rgba(56, 189, 248,',  // electric sky blue
      'rgba(96, 165, 250,',  // soft sapphire
      'rgba(37, 99, 235,',   // deep cobalt
      'rgba(14, 165, 233,',  // oceanic cyan
      'rgba(147, 197, 253,', // light crystalline blue
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 7 + 2.5,
        baseAlpha: Math.random() * 0.35 + 0.12,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.35 - 0.1, // slow upward drift
        color: blueTones[Math.floor(Math.random() * blueTones.length)],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep radial banking gradient in background
      const bgGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.46,
        40,
        width * 0.5,
        height * 0.46,
        Math.max(width, height) * 0.7
      );
      bgGlow.addColorStop(0, 'rgba(12, 34, 76, 0.7)');
      bgGlow.addColorStop(0.5, 'rgba(6, 18, 42, 0.88)');
      bgGlow.addColorStop(1, 'rgba(2, 4, 10, 1)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Flowing blue smoke wave ribbons
      const waveConfigs = [
        { yRatio: 0.64, amp: 48, freq: 0.0032, speed: 0.95, topColor: 'rgba(14, 116, 224, 0.15)' },
        { yRatio: 0.52, amp: 36, freq: 0.0045, speed: 0.8,  topColor: 'rgba(37, 99, 235, 0.18)' },
        { yRatio: 0.74, amp: 54, freq: 0.0026, speed: 0.65, topColor: 'rgba(56, 189, 248, 0.12)' },
        { yRatio: 0.38, amp: 30, freq: 0.004,  speed: 1.15, topColor: 'rgba(30, 64, 175, 0.14)' },
      ];

      waveConfigs.forEach((w) => {
        ctx.beginPath();
        const baseY = height * w.yRatio;
        ctx.moveTo(0, height);
        ctx.lineTo(0, baseY);

        for (let x = 0; x <= width; x += 14) {
          const y =
            baseY +
            Math.sin(x * w.freq + time * w.speed) * w.amp +
            Math.cos(x * w.freq * 0.65 + time * w.speed * 0.6) * (w.amp * 0.45);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - w.amp, 0, height);
        grad.addColorStop(0, w.topColor);
        grad.addColorStop(1, 'rgba(2, 6, 18, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Render floating blue bokeh particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;

        const pulseAlpha = Math.max(0.05, Math.min(0.6, p.baseAlpha + Math.sin(time * 2.2 + p.x) * 0.08));

        // Soft outer glow
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        radGrad.addColorStop(0, `${p.color} ${pulseAlpha})`);
        radGrad.addColorStop(0.55, `${p.color} ${pulseAlpha * 0.4})`);
        radGrad.addColorStop(1, `${p.color} 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // Delicate luminous core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${pulseAlpha * 0.9})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleSkip = () => {
    navigate('/welcome', { replace: true });
  };

  return (
    <div
      onClick={handleSkip}
      className="splash-screen-container relative w-full min-h-screen overflow-hidden select-none cursor-pointer flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #030814 0%, #061128 40%, #030816 75%, #010307 100%)',
      }}
    >
      {/* Dynamic Keyframe Animations */}
      <style>{`
        /* 0-0.5s: Background fade in */
        @keyframes splashBgFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        /* 0.5-1.2s: Logo scale from 0.5 to 1.1 to 1.0 with glowing burst */
        @keyframes splashLogoScaleBurst {
          0% {
            transform: scale(0.5);
            opacity: 0;
            filter: drop-shadow(0 0 10px rgba(227, 6, 19, 0.3));
          }
          15% {
            opacity: 1;
          }
          55% {
            transform: scale(1.1);
            filter: drop-shadow(0 0 35px rgba(227, 6, 19, 0.95)) drop-shadow(0 0 70px rgba(227, 6, 19, 0.55));
          }
          100% {
            transform: scale(1.0);
            opacity: 1;
            filter: drop-shadow(0 0 24px rgba(227, 6, 19, 0.8)) drop-shadow(0 0 50px rgba(227, 6, 19, 0.35));
          }
        }

        /* Shockwave ping at 0.5s */
        @keyframes splashShockwave {
          0% {
            transform: scale(0.4);
            opacity: 0;
          }
          30% {
            opacity: 0.85;
          }
          100% {
            transform: scale(2.2);
            opacity: 0;
          }
        }

        /* 0.5-1.2s: Red sparkles burst */
        @keyframes splashSparkleBurst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: var(--sparkle-target) scale(1);
            opacity: 0;
          }
        }

        /* 1.2-1.8s: Text "H S B C" fade in with letter spacing expanding from 5px to 15px */
        @keyframes splashTextReveal {
          0% {
            opacity: 0;
            letter-spacing: 5px;
            padding-left: 5px;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            letter-spacing: 15px;
            padding-left: 15px;
            transform: translateY(0);
          }
        }

        /* 1.8-2.5s: Hold - logo pulsing glow */
        @keyframes splashLogoPulse {
          0%, 100% {
            filter: drop-shadow(0 0 22px rgba(227, 6, 19, 0.75)) drop-shadow(0 0 45px rgba(227, 6, 19, 0.35));
            transform: scale(1.0);
          }
          50% {
            filter: drop-shadow(0 0 32px rgba(227, 6, 19, 0.95)) drop-shadow(0 0 65px rgba(227, 6, 19, 0.5));
            transform: scale(1.02);
          }
        }

        /* 2.5-3.0s: Fade out everything to existing login page */
        @keyframes splashFadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .splash-screen-container {
          animation: splashBgFadeIn 0.5s ease-out 0s forwards;
        }

        .splash-logo-animated {
          opacity: 0;
          animation: splashLogoScaleBurst 0.7s cubic-bezier(0.34, 1.35, 0.64, 1) 0.5s forwards,
                     splashLogoPulse 1.4s ease-in-out 1.2s infinite;
        }

        .splash-shockwave {
          opacity: 0;
          animation: splashShockwave 0.8s ease-out 0.5s forwards;
        }

        .splash-sparkle {
          opacity: 0;
          animation: splashSparkleBurst 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.55s forwards;
        }

        .splash-text-animated {
          opacity: 0;
          animation: splashTextReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards;
        }
      `}</style>

      {/* Background Animated Canvas (Blue smoke waves + bokeh particles) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Subtle Radial Vignette for Cinematic Immersion */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#02050E]/40 to-[#010307]/90 pointer-events-none z-1" />

      {/* Center Content Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center -translate-y-2">
        {/* Soft Red Ambient Light Aura behind Logo */}
        <div className="absolute w-56 h-40 -top-6 rounded-full bg-red-600/35 blur-3xl pointer-events-none" />

        {/* Shockwave Burst Ring at 0.5s */}
        <div className="splash-shockwave absolute w-44 h-28 rounded-full border border-red-500/80 pointer-events-none" />

        {/* Red Sparkles around Logo during 0.5s - 1.2s */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {sparkles.map((s) => (
            <div
              key={s.id}
              className="splash-sparkle absolute rounded-full pointer-events-none"
              style={
                {
                  '--sparkle-target': `translate(${s.x}px, ${s.y}px)`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  backgroundColor: s.color,
                  boxShadow: `0 0 8px ${s.color}, 0 0 16px ${s.color}`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Red HSBC Hexagon Logo:
            - Size: Medium-large (160px x 96px, 100:60 aspect)
            - Glowing with soft red outer glow
            - Exact 6 geometric triangles
        */}
        <div className="splash-logo-animated relative">
          <div className="w-[160px] h-[96px] relative">
            <svg
              viewBox="0 0 100 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
              aria-label="HSBC Red Hexagon Logo"
            >
              {/* Left Red Triangle */}
              <polygon points="0,30 35,6 35,54" fill="#E30613" />

              {/* Right Red Triangle */}
              <polygon points="100,30 65,6 65,54" fill="#E30613" />

              {/* Top Red Triangle */}
              <polygon points="50,30 35,6 65,6" fill="#E30613" />

              {/* Bottom Red Triangle */}
              <polygon points="50,30 35,54 65,54" fill="#E30613" />

              {/* Central Left White Triangle */}
              <polygon points="50,30 35,6 35,54" fill="#FFFFFF" />

              {/* Central Right White Triangle */}
              <polygon points="50,30 65,6 65,54" fill="#FFFFFF" />
            </svg>
          </div>
        </div>

        {/* Exact 20px gap below logo */}
        <div className="h-[20px]" />

        {/* Text "H S B C"
            - Font: Thin elegant modern sans-serif, stylish minimal
            - Weight: 300 (light)
            - Size: 24px small - about 40% of logo width (logo is 160px wide)
            - Letter spacing: 15px wide gap between letters (expands from 5px to 15px at 1.2s - 1.8s)
            - Color: Silver white with slight gradient, elegant
            - Style: Stylish, premium, minimalist
        */}
        <div className="splash-text-animated flex items-center justify-center">
          <span
            className="text-[24px] font-light select-none text-transparent bg-clip-text"
            style={{
              fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
              fontWeight: 300,
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 50%, #B8C7D9 100%)',
              textShadow: '0 2px 12px rgba(255, 255, 255, 0.25)',
              display: 'inline-block',
            }}
          >
            HSBC
          </span>
        </div>
      </div>

      {/* Discreet Skip Button (for quick testing without waiting) */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-[11px] uppercase tracking-widest text-slate-400/50 hover:text-white transition px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 backdrop-blur-sm"
        >
          Skip
        </button>
      </div>
    </div>
  );
};
