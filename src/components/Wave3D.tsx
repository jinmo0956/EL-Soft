'use client';

import { useEffect, useRef } from 'react';

interface Wave3DProps {
    opacity?: number;
    speed?: number;
    color?: string;
}

export default function Wave3D({
    opacity = 0.3,
    speed = 0.002,
    color = '#8b5cf6'
}: Wave3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const draw = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cols = 50;
            const rows = 30;
            const cellW = canvas.width / cols;
            const cellH = canvas.height / rows;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * cellW;
                    const y = j * cellH;

                    // Wave calculation
                    const wave = Math.sin(i * 0.3 + time) * Math.cos(j * 0.3 + time) * 20;
                    const alpha = (Math.sin(i * 0.1 + j * 0.1 + time) + 1) * 0.25 * opacity;

                    ctx.beginPath();
                    ctx.arc(x + cellW / 2, y + cellH / 2 + wave, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
                    ctx.fill();
                }
            }

            time += speed;
            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [opacity, speed, color]);

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
                zIndex: 0,
            }}
        />
    );
}
