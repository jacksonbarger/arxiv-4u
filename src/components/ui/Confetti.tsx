'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
  duration?: number;
  particleCount?: number;
}

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

const COLORS = ['#9EDCE1', '#C0E5E8', '#DAF4EF', '#DEEBEB', '#EFE4CB', '#F59E0B', '#10B981', '#3B82F6'];

export function Confetti({ active, onComplete, duration = 3000, particleCount = 50 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        size: 6 + Math.random() * 8,
      }));

      setParticles(newParticles);

      // Clear particles after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, duration, particleCount, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: '-10%',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            animation: `confetti-fall ${2 + Math.random()}s linear ${particle.delay}s`,
            animationFillMode: 'forwards',
          }}
        />
      ))}
    </div>
  );
}

// Success celebration with confetti
export function SuccessCelebration({
  show,
  message,
  onClose
}: {
  show: boolean;
  message: string;
  onClose: () => void;
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className="p-8 rounded-3xl shadow-2xl max-w-md text-center animate-scaleIn pointer-events-auto"
          style={{
            backgroundColor: '#FFFFFF',
            border: '3px solid #10B981',
          }}
        >
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: '#065F46' }}>
            Success!
          </h3>
          <p className="text-base" style={{ color: '#4A5568' }}>
            {message}
          </p>
        </div>
      </div>
    </>
  );
}

// Quick celebration for micro-interactions
export function QuickCelebration({ onComplete }: { onComplete?: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div
        className="text-8xl animate-scaleIn"
        style={{
          animation: 'scaleIn 0.5s ease-out, fadeOut 0.5s ease-out 0.5s',
          animationFillMode: 'forwards',
        }}
      >
        ✓
      </div>
    </div>
  );
}
