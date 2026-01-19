'use client';

import { useEffect, useRef } from 'react';

interface Canvas3DEffectProps {
    mode?: 'sea' | 'wind' | 'mesh';
    onIntroComplete?: () => void;
}

export default function Canvas3DEffect({
    mode = 'sea',
    onIntroComplete
}: Canvas3DEffectProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const timeRef = useRef(0);
    const phaseRef = useRef<'cross' | 'converge' | 'main'>('cross');
    const introStartRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Store refs to avoid null issues in nested functions
        const cvs = canvas;
        const context = ctx;

        const DPR = Math.max(1, window.devicePixelRatio || 1);
        const TAU = Math.PI * 2;

        // Camera settings
        let FOCAL = 900, CAM_DIST = 1100;
        const NEAR_PLANE = 60;

        // Sea wave settings
        let WCOLS = 0, WROWS = 0, WW = 0, WD = 0;
        const SEA_AMP = 40, SEA_FREQX = 0.008, SEA_FREQZ = 0.018, SEA_SPEED = 0.8;
        const SEA_ROTX = -0.9, SEA_ROTY = 0.20;
        let SEA_VERTS: { bx: number; bz: number; sx: number; sy: number; vis: boolean; wz: number }[] = [];

        // Intro dots
        let dots: { sx: number; sy: number; x: number; y: number; w: number }[] = [];

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
        const easeInOutCubic = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

        function rotateY(x: number, y: number, z: number, a: number) {
            const c = Math.cos(a), s = Math.sin(a);
            return { x: c * x + s * z, y, z: -s * x + c * z };
        }
        function rotateX(x: number, y: number, z: number, a: number) {
            const c = Math.cos(a), s = Math.sin(a);
            return { x, y: c * y - s * z, z: s * y + c * z };
        }

        function project3DTo2D(x: number, y: number, z: number) {
            const zc = z + CAM_DIST;
            const vis = zc > NEAR_PLANE;
            const s = FOCAL / zc;
            return { x: innerWidth / 2 + x * s, y: innerHeight / 2 + y * s, vis, zc };
        }

        function fit() {
            const w = innerWidth, h = innerHeight;
            cvs.width = Math.floor(w * DPR);
            cvs.height = Math.floor(h * DPR);
            cvs.style.width = w + 'px';
            cvs.style.height = h + 'px';
            context.setTransform(DPR, 0, 0, DPR, 0, 0);

            FOCAL = clamp(h * 1.0, 700, 1200);
            CAM_DIST = clamp(h * 1.2, 900, 1500);

            buildSea();
        }

        function buildSea() {
            const w = innerWidth, h = innerHeight;
            const target = clamp(w / 28, 22, 42);
            WW = w * 2.3;
            WD = h * 2.6;
            WCOLS = Math.floor(WW / target) + 2;
            WROWS = Math.floor(WD / target) + 2;

            SEA_VERTS = [];
            const x0 = -WW / 2, z0 = 0, dx = WW / (WCOLS - 1), dz = WD / (WROWS - 1);
            for (let j = 0; j < WROWS; j++) {
                for (let i = 0; i < WCOLS; i++) {
                    const bx = x0 + i * dx, bz = z0 + j * dz;
                    SEA_VERTS.push({ bx, bz, sx: 0, sy: 0, vis: false, wz: 0 });
                }
            }
        }

        function updateSea(dt: number) {
            const amp = clamp(Math.min(72, innerHeight * 0.085), 20, 80);
            timeRef.current += dt * 0.001 * SEA_SPEED;

            for (let j = 0; j < WROWS; j++) {
                const fall = lerp(amp, amp * 0.55, j / (WROWS - 1));
                for (let i = 0; i < WCOLS; i++) {
                    const v = SEA_VERTS[j * WCOLS + i];
                    const phase = v.bx * SEA_FREQX + v.bz * SEA_FREQZ + timeRef.current * TAU * 0.12;
                    const y = Math.sin(phase) * fall + Math.cos(phase * 0.6) * fall * 0.25;

                    let rx = v.bx, ry = y, rz = v.bz;
                    ({ x: rx, y: ry, z: rz } = rotateX(rx, ry, rz, SEA_ROTX));
                    ({ x: rx, y: ry, z: rz } = rotateY(rx, ry, rz, SEA_ROTY));

                    const p = project3DTo2D(rx, ry, rz);
                    v.sx = p.x; v.sy = p.y; v.vis = p.vis; v.wz = rz;
                }
            }
        }

        function drawSea(alpha: number) {
            if (alpha <= 0) return;
            context.save();
            context.globalAlpha *= alpha;
            context.lineWidth = 1;
            context.lineJoin = 'bevel';

            for (let j = WROWS - 2; j >= 0; j--) {
                for (let i = 0; i < WCOLS - 2; i++) {
                    const i00 = j * WCOLS + i;
                    const i10 = j * WCOLS + (i + 1);
                    const i01 = (j + 1) * WCOLS + i;
                    const v00 = SEA_VERTS[i00], v10 = SEA_VERTS[i10], v01 = SEA_VERTS[i01];

                    const depth = (v00.wz + CAM_DIST) / (CAM_DIST + WD);
                    const a = 0.28 - 0.20 * clamp(depth, 0, 1);
                    context.strokeStyle = `rgba(255,255,255,${a})`;

                    if (v00.vis && v10.vis) {
                        context.beginPath();
                        context.moveTo(v00.sx, v00.sy);
                        context.lineTo(v10.sx, v10.sy);
                        context.stroke();
                    }
                    if (v00.vis && v01.vis) {
                        context.beginPath();
                        context.moveTo(v00.sx, v00.sy);
                        context.lineTo(v01.sx, v01.sy);
                        context.stroke();
                    }
                }
            }

            // Draw dots
            context.fillStyle = 'rgba(255,255,255,0.22)';
            for (let j = 0; j < WROWS; j += 2) {
                for (let i = 0; i < WCOLS; i += 2) {
                    const v = SEA_VERTS[j * WCOLS + i];
                    if (!v.vis) continue;
                    context.beginPath();
                    context.arc(v.sx, v.sy, 0.9, 0, TAU);
                    context.fill();
                }
            }
            context.restore();
        }

        function buildConvergeDots() {
            const w = innerWidth, h = innerHeight;
            const N = 100;
            dots = [];
            for (let i = 0; i < N; i++) {
                const t = i / (N - 1);
                dots.push({ sx: lerp(0, w, t), sy: lerp(0, h, t), x: 0, y: 0, w: Math.random() * 1.2 + 0.6 });
                dots.push({ sx: lerp(w, 0, t), sy: lerp(0, h, t), x: 0, y: 0, w: Math.random() * 1.2 + 0.6 });
            }
            dots.push({ sx: 0, sy: 0, x: 0, y: 0, w: 1 });
            dots.push({ sx: w, sy: 0, x: 0, y: 0, w: 1 });
            dots.push({ sx: 0, sy: h, x: 0, y: 0, w: 1 });
            dots.push({ sx: w, sy: h, x: 0, y: 0, w: 1 });
        }

        const DUR_CROSS = 1000, DUR_CONV = 800, DUR_GAP = 150;
        let prevTime = 0;

        function render(now: number) {
            if (!animationRef.current) return;

            const dt = Math.min(80, now - prevTime);
            prevTime = now;

            const w = innerWidth, h = innerHeight, cx = w / 2, cy = h / 2;

            if (phaseRef.current === 'cross') {
                const el = now - introStartRef.current;
                const p = Math.min(1, el / DUR_CROSS);
                const e = easeInOutCubic(p);

                context.clearRect(0, 0, w, h);
                context.lineWidth = 2;
                context.strokeStyle = 'rgba(255,255,255,0.85)';
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(lerp(0, w, e), lerp(0, h, e));
                context.moveTo(w, 0);
                context.lineTo(lerp(w, 0, e), lerp(0, h, e));
                context.stroke();

                context.fillStyle = `rgba(255,255,255,${0.4 + 0.6 * e})`;
                context.beginPath();
                context.arc(cx, cy, 3 + 8 * e, 0, TAU);
                context.fill();

                if (el > DUR_CROSS + DUR_GAP) {
                    phaseRef.current = 'converge';
                    introStartRef.current = now;
                    buildConvergeDots();
                }
            } else if (phaseRef.current === 'converge') {
                const el = now - introStartRef.current;
                const p = Math.min(1, el / DUR_CONV);
                const e = easeOutCubic(p);

                context.clearRect(0, 0, w, h);
                context.fillStyle = '#000';
                context.fillRect(0, 0, w, h);
                context.fillStyle = 'rgba(255,255,255,0.85)';

                for (const d of dots) {
                    d.x = lerp(d.sx, cx, e);
                    d.y = lerp(d.sy, cy, e);
                    context.beginPath();
                    context.arc(d.x, d.y, d.w * (1.2 - 0.8 * e), 0, TAU);
                    context.fill();
                }

                if (p >= 1) {
                    phaseRef.current = 'main';
                    setTimeout(() => onIntroComplete?.(), 350);
                }
            } else {
                context.clearRect(0, 0, w, h);
                context.save();
                context.globalCompositeOperation = 'lighter';

                updateSea(dt);
                drawSea(1);

                context.restore();
            }

            animationRef.current = requestAnimationFrame(render);
        }

        fit();
        introStartRef.current = performance.now();
        prevTime = performance.now();
        animationRef.current = requestAnimationFrame(render);

        window.addEventListener('resize', fit);

        return () => {
            window.removeEventListener('resize', fit);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = 0;
            }
        };
    }, [mode, onIntroComplete]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
}
