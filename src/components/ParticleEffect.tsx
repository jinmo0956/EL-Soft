'use client';

import { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
}

interface ParticleEffectProps {
    trigger: boolean;
    onComplete?: () => void;
    colors?: string[];
}

export default function ParticleEffect({
    trigger,
    onComplete,
    colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899']
}: ParticleEffectProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        if (!trigger) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create particles
        const particles: Particle[] = [];
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        for (let i = 0; i < 100; i++) {
            const angle = (Math.PI * 2 * i) / 100 + Math.random() * 0.5;
            const speed = 3 + Math.random() * 8;

            particles.push({
                x: centerX,
                y: centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - Math.random() * 3,
                life: 1,
                maxLife: 60 + Math.random() * 60,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 3 + Math.random() * 5,
            });
        }

        particlesRef.current = particles;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let activeParticles = 0;

            particlesRef.current.forEach((p) => {
                if (p.life <= 0) return;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.15; // gravity
                p.life -= 1 / p.maxLife;

                if (p.life > 0) {
                    activeParticles++;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    const alpha = Math.floor(p.life * 255).toString(16).padStart(2, '0');
                    ctx.fillStyle = p.color + alpha;
                    ctx.fill();
                }
            });

            if (activeParticles > 0) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                onComplete?.();
            }
        };

        animate();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [trigger, colors, onComplete]);

    if (!trigger) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
}
