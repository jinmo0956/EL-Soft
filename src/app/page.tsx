'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// 원본 wave3d.js를 React로 완전 이식
function Wave3DCanvas({ onIntroComplete }: { onIntroComplete: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const modeRef = useRef(0); // 0=SEA, 1=WIND, 2=MESH

    useEffect(() => {
        const canvasRaw = canvasRef.current;
        if (!canvasRaw) return;
        const canvas = canvasRaw; // Store in const to satisfy TypeScript
        const ctxRaw = canvas.getContext('2d');
        if (!ctxRaw) return;
        const ctx = ctxRaw; // Store in const to satisfy TypeScript

        // Utils
        const TAU = Math.PI * 2;
        const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
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

        // Camera
        let FOCAL = 900, CAM_DIST = 1100;
        let FOCAL_BASE = 900, CAM_DIST_BASE = 1100;
        const NEAR_PLANE = 60;

        function project3DTo2D(x: number, y: number, z: number) {
            const zc = z + CAM_DIST;
            const vis = zc > NEAR_PLANE;
            const s = FOCAL / zc;
            return { x: innerWidth / 2 + x * s, y: innerHeight / 2 + y * s, vis, zc };
        }

        function tuneCamera() {
            const h = innerHeight;
            FOCAL_BASE = clamp(h * 1.0, 700, 1200);
            CAM_DIST_BASE = clamp(h * 1.2, 900, 1500);
            FOCAL = FOCAL_BASE;
            CAM_DIST = CAM_DIST_BASE;
        }

        // ===== SEA (Slide 1) =====
        let WCOLS = 0, WROWS = 0, WW = 0, WD = 0;
        let SEA_AMP = 40, SEA_FREQX = 0.008, SEA_FREQZ = 0.018, SEA_SPEED = 0.8;
        let SEA_ROTX = -0.9, SEA_ROTY = 0.20, tSea = 0;
        let SEA_VERTS: { bx: number; bz: number; wx: number; wy: number; wz: number; sx: number; sy: number; vis: boolean }[] = [];

        function buildSea() {
            const w = innerWidth, h = innerHeight, target = clamp(w / 28, 22, 42);
            WW = w * 2.3; WD = h * 2.6; WCOLS = Math.floor(WW / target) + 2; WROWS = Math.floor(WD / target) + 2;
            SEA_AMP = Math.min(72, h * 0.085);
            SEA_VERTS = [];
            const x0 = -WW / 2, z0 = 0, dx = WW / (WCOLS - 1), dz = WD / (WROWS - 1);
            for (let j = 0; j < WROWS; j++) {
                for (let i = 0; i < WCOLS; i++) {
                    const bx = x0 + i * dx, bz = z0 + j * dz;
                    SEA_VERTS.push({ bx, bz, wx: 0, wy: 0, wz: 0, sx: 0, sy: 0, vis: false });
                }
            }
        }

        function updateSea(dt: number, zoom: number) {
            const amp = lerp(SEA_AMP, SEA_AMP * 0.85, zoom);
            const speed = SEA_SPEED * lerp(1, 0.82, zoom);
            const rotx = lerp(SEA_ROTX, SEA_ROTX - 0.08, zoom * 0.6);
            const roty = lerp(SEA_ROTY, SEA_ROTY - 0.05, zoom * 0.6);

            tSea += dt * 0.001 * speed;
            for (let j = 0; j < WROWS; j++) {
                const fall = lerp(amp, amp * 0.55, j / (WROWS - 1));
                for (let i = 0; i < WCOLS; i++) {
                    const v = SEA_VERTS[j * WCOLS + i];
                    const phase = v.bx * SEA_FREQX + v.bz * SEA_FREQZ + tSea * TAU * 0.12;
                    const yy = Math.sin(phase) * fall + Math.cos(phase * 0.6) * fall * 0.25;
                    let rx = v.bx, ry = yy, rz = v.bz;
                    ({ x: rx, y: ry, z: rz } = rotateX(rx, ry, rz, rotx));
                    ({ x: rx, y: ry, z: rz } = rotateY(rx, ry, rz, roty));
                    const p = project3DTo2D(rx, ry, rz);
                    v.wx = rx; v.wy = ry; v.wz = rz; v.sx = p.x; v.sy = p.y; v.vis = p.vis;
                }
            }
        }

        function drawSea(alpha: number) {
            if (alpha <= 0) return;
            ctx.save(); ctx.globalAlpha *= alpha;
            ctx.lineWidth = 1; ctx.lineJoin = 'bevel';
            for (let j = WROWS - 2; j >= 0; j--) {
                for (let i = 0; i < WCOLS - 2; i++) {
                    const v00 = SEA_VERTS[j * WCOLS + i];
                    const v10 = SEA_VERTS[j * WCOLS + (i + 1)];
                    const v01 = SEA_VERTS[(j + 1) * WCOLS + i];
                    const depth = (v00.wz + CAM_DIST) / (CAM_DIST + WD);
                    const a = 0.28 - 0.20 * Math.min(1, Math.max(0, depth));
                    ctx.strokeStyle = `rgba(255,255,255,${a})`;
                    if (v00.vis && v10.vis) { ctx.beginPath(); ctx.moveTo(v00.sx, v00.sy); ctx.lineTo(v10.sx, v10.sy); ctx.stroke(); }
                    if (v00.vis && v01.vis) { ctx.beginPath(); ctx.moveTo(v00.sx, v00.sy); ctx.lineTo(v01.sx, v01.sy); ctx.stroke(); }
                }
            }
            ctx.fillStyle = 'rgba(255,255,255,0.22)';
            for (let j = 0; j < WROWS; j++) {
                for (let i = 0; i < WCOLS; i++) {
                    const v = SEA_VERTS[j * WCOLS + i];
                    if (!v.vis) continue;
                    ctx.beginPath(); ctx.arc(v.sx, v.sy, 0.9, 0, TAU); ctx.fill();
                }
            }
            ctx.restore();
        }

        // ===== WIND (Slide 2) =====
        let GW = 0, GD = 0, GH = 0;
        let WND_ROTX = -0.35, WND_ROTY = 0.88;
        let tWind = 0;
        type Spark = { x: number; y: number; z: number; s: number; spd: number; sx: number; sy: number; depth: number; vis: boolean };
        let SPARKS: Spark[] = [];

        function buildWind() {
            const w = innerWidth, h = innerHeight;
            GW = w * 2.6; GD = h * 1.7; GH = h * 0.85;
            const count = Math.round(clamp((w * h) / 12000, 120, 420)) * 15;
            SPARKS = [];
            for (let i = 0; i < count; i++) {
                SPARKS.push({
                    x: (Math.random() - 0.5) * GW * 0.9,
                    y: (Math.random() - 0.5) * GH * 0.9,
                    z: Math.random() * GD,
                    s: 0.6 + Math.random() * 1.2,
                    spd: 38 + Math.random() * 44,
                    sx: 0, sy: 0, depth: 1, vis: false
                });
            }
        }

        function windField(x: number, y: number, z: number, t: number) {
            const kx = 0.0013, ky = 0.0016, kz = 0.0011;
            let vx = 1.0 + 0.55 * Math.sin(z * kz * 1.2 + t * 0.65);
            let vy = 0.55 * Math.sin(x * kx * 0.6 + t * 0.70);
            let vz = 0.45 * Math.cos(y * ky * 1.1 - t * 0.50);
            const m = Math.hypot(vx, vy, vz) || 1;
            return { x: vx / m, y: vy / m, z: vz / m };
        }

        function updateWind(dt: number, zoom: number) {
            tWind += dt * 0.001;
            const rotx = lerp(WND_ROTX, WND_ROTX - 0.06, zoom);
            const roty = lerp(WND_ROTY, WND_ROTY + 0.08, zoom);

            for (const sp of SPARKS) {
                const f = windField(sp.x, sp.y, sp.z, tWind * TAU * 0.15);
                const step = sp.spd * (1 + 0.05 * zoom) * (dt / 1000);
                sp.x += f.x * step; sp.y += f.y * step; sp.z += f.z * step;
                if (sp.x < -GW / 2 - 220 || sp.x > GW / 2 + 220 || sp.z > GD + 220 || Math.abs(sp.y) > GH) {
                    sp.x = (Math.random() - 0.5) * GW * 0.9;
                    sp.y = (Math.random() - 0.5) * GH * 0.9;
                    sp.z = Math.random() * GD * 0.3;
                }
                let rx = sp.x, ry = sp.y, rz = sp.z;
                ({ x: rx, y: ry, z: rz } = rotateX(rx, ry, rz, rotx));
                ({ x: rx, y: ry, z: rz } = rotateY(rx, ry, rz, roty));
                const p = project3DTo2D(rx, ry, rz);
                sp.sx = p.x; sp.sy = p.y; sp.depth = (rz + CAM_DIST) / (CAM_DIST + GD); sp.vis = p.vis;
            }
        }

        function drawWind(alpha: number) {
            if (alpha <= 0) return;
            ctx.save(); ctx.globalCompositeOperation = 'lighter';
            for (const sp of SPARKS) {
                if (!sp.vis) continue;
                const near = 1 - clamp(sp.depth, 0, 1);
                const r = sp.s * (0.6 + 1.6 * near);
                const a = alpha * (0.10 + 0.45 * near);
                ctx.fillStyle = `rgba(255,255,255,${a})`;
                ctx.beginPath(); ctx.arc(sp.sx, sp.sy, r, 0, TAU); ctx.fill();
            }
            ctx.restore();
        }

        // ===== MESH + POLY (Slide 3) =====
        let M_RINGS = 64, M_SIDES = 24, M_R0 = 0, M_D = 0;
        let tMesh = 0;
        type MPoint = { sx: number; sy: number; vis: boolean; depth: number; wz: number };
        let M_POINTS: MPoint[][] = [];

        function buildMesh() {
            const w = innerWidth, h = innerHeight;
            M_RINGS = Math.round(clamp(h / 14, 44, 96));
            M_SIDES = Math.round(clamp(w / 38, 18, 40));
            M_R0 = Math.min(w, h) * 0.33;
            M_D = h * 2.1;
            M_POINTS = [];
            for (let j = 0; j < M_RINGS; j++) {
                M_POINTS[j] = [];
                for (let i = 0; i < M_SIDES; i++) M_POINTS[j][i] = { sx: 0, sy: 0, vis: false, depth: 1, wz: 0 };
            }
        }

        function updateMesh(dt: number) {
            tMesh += dt * 0.001;
            const dz = M_D / (M_RINGS - 1);
            const swirl = tMesh * 1.2;
            const twist = 0.06;

            for (let j = 0; j < M_RINGS; j++) {
                const z = j * dz;
                const r = M_R0 * (0.92 + 0.10 * Math.sin(j * 0.55 + tMesh * 1.8));
                const angOff = swirl + j * twist;

                for (let i = 0; i < M_SIDES; i++) {
                    const th = (i * TAU / M_SIDES) + angOff;
                    let x = Math.cos(th) * r;
                    let y = Math.sin(th) * r * 0.68;
                    let zz = z;
                    ({ x, y, z: zz } = rotateX(x, y, zz, -0.15));
                    ({ x, y, z: zz } = rotateY(x, y, zz, 0.0));
                    const p = project3DTo2D(x, y, zz);
                    const depth = (zz + CAM_DIST) / (CAM_DIST + M_D);
                    M_POINTS[j][i] = { sx: p.x, sy: p.y, vis: p.vis, depth, wz: zz };
                }
            }
        }

        function drawMesh(alpha: number) {
            if (alpha <= 0) return;
            ctx.save(); ctx.globalAlpha *= alpha;
            for (let j = M_RINGS - 2; j >= 0; j--) {
                for (let i = 0; i < M_SIDES; i++) {
                    const inext = (i + 1) % M_SIDES;
                    const A = M_POINTS[j][i], B = M_POINTS[j][inext];
                    const C = M_POINTS[j + 1][i];
                    const depth = (A.wz + CAM_DIST) / (CAM_DIST + M_D);
                    const near = 1 - clamp(depth, 0, 1);
                    const a = 0.24 - 0.16 * (1 - near);
                    ctx.strokeStyle = `rgba(255,255,255,${a})`;
                    ctx.lineWidth = 0.8 + 1.2 * near;
                    if (A.vis && B.vis) { ctx.beginPath(); ctx.moveTo(A.sx, A.sy); ctx.lineTo(B.sx, B.sy); ctx.stroke(); }
                    if (A.vis && C.vis) { ctx.beginPath(); ctx.moveTo(A.sx, A.sy); ctx.lineTo(C.sx, C.sy); ctx.stroke(); }
                }
            }
            ctx.fillStyle = 'rgba(255,255,255,0.18)';
            for (let j = 0; j < M_RINGS; j += 2) {
                for (let i = 0; i < M_SIDES; i += 2) {
                    const P = M_POINTS[j][i];
                    if (!P.vis) continue;
                    const near = 1 - clamp(P.depth, 0, 1);
                    const r = 0.8 + 1.1 * near;
                    ctx.beginPath(); ctx.arc(P.sx, P.sy, r, 0, TAU); ctx.fill();
                }
            }
            ctx.restore();
        }

        // POLY (geometric shapes)
        type PolyShape = { x: number; y: number; z: number; s: number; rx: number; ry: number; rz: number; vrx: number; vry: number; vrz: number };
        let POLYS: PolyShape[] = [];
        let PW = 0, PD = 0, PH = 0;

        const PHI = (1 + Math.sqrt(5)) / 2;
        const ICO_V = [
            [0, -1, -PHI], [0, 1, -PHI], [0, -1, PHI], [0, 1, PHI],
            [-1, -PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [1, PHI, 0],
            [-PHI, 0, -1], [PHI, 0, -1], [-PHI, 0, 1], [PHI, 0, 1]
        ];
        const ICO_EDGES: [number, number][] = [];
        let dmin = Infinity;
        for (let i = 0; i < ICO_V.length; i++) for (let j = i + 1; j < ICO_V.length; j++) {
            const dx = ICO_V[i][0] - ICO_V[j][0], dy = ICO_V[i][1] - ICO_V[j][1], dz = ICO_V[i][2] - ICO_V[j][2];
            const d = dx * dx + dy * dy + dz * dz; if (d < dmin) dmin = d;
        }
        for (let i = 0; i < ICO_V.length; i++) for (let j = i + 1; j < ICO_V.length; j++) {
            const dx = ICO_V[i][0] - ICO_V[j][0], dy = ICO_V[i][1] - ICO_V[j][1], dz = ICO_V[i][2] - ICO_V[j][2];
            const d = dx * dx + dy * dy + dz * dz; if (d <= dmin * 1.05) ICO_EDGES.push([i, j]);
        }

        function buildPoly() {
            const w = innerWidth, h = innerHeight;
            PW = w * 2.2; PD = h * 1.6; PH = h * 0.9;
            POLYS = [];
            const count = Math.round(clamp(w / 50, 18, 42));
            for (let i = 0; i < count; i++) {
                POLYS.push({
                    x: (Math.random() - 0.5) * PW * 0.8,
                    y: (Math.random() - 0.5) * PH * 0.6,
                    z: Math.random() * PD * 0.9,
                    s: 18 + Math.random() * 34,
                    rx: Math.random() * TAU, ry: Math.random() * TAU, rz: Math.random() * TAU,
                    vrx: (-0.5 + Math.random()) * 0.25,
                    vry: (-0.5 + Math.random()) * 0.25,
                    vrz: (-0.5 + Math.random()) * 0.25
                });
            }
        }

        function updatePoly(dt: number) {
            for (const p of POLYS) {
                p.rx += p.vrx * dt * 0.001;
                p.ry += p.vry * dt * 0.001;
                p.rz += p.vrz * dt * 0.001;
            }
        }

        function drawPoly(alpha: number) {
            if (alpha <= 0) return;
            const POLY_ROTX = -0.18, POLY_ROTY = 0.60;
            for (const p of POLYS) {
                const pts: { x: number; y: number; z: number; vis: boolean }[] = [];
                for (let i = 0; i < ICO_V.length; i++) {
                    let [x, y, z] = ICO_V[i];
                    ({ x, y, z } = rotateX(x, y, z, p.rx));
                    ({ x, y, z } = rotateY(x, y, z, p.ry));
                    x = x * p.s + p.x; y = y * p.s + p.y; z = z * p.s + p.z;
                    ({ x, y, z } = rotateX(x, y, z, POLY_ROTX));
                    ({ x, y, z } = rotateY(x, y, z, POLY_ROTY));
                    const pr = project3DTo2D(x, y, z);
                    pts.push({ x: pr.x, y: pr.y, z, vis: pr.vis });
                }
                for (const [a, b] of ICO_EDGES) {
                    const A = pts[a], B = pts[b];
                    if (!(A.vis && B.vis)) continue;
                    const depth = (Math.min(A.z, B.z) + CAM_DIST) / (CAM_DIST + PD);
                    const al = (0.24 - 0.16 * depth) * alpha;
                    ctx.strokeStyle = `rgba(255,255,255,${al})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
                }
            }
        }

        // Resize
        function fit() {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            tuneCamera();
            buildSea();
            buildWind();
            buildMesh();
            buildPoly();
        }

        fit();
        window.addEventListener('resize', fit);

        // Animation state
        let zoom = 0, zoomTarget = 0;
        let alpha = 1, alphaTarget = 1;
        let phase = 0; // 0=CROSS, 1=CONVERGE, 2=MAIN
        let t0 = performance.now();
        let prevTime = performance.now();

        // Intro dots
        let dots: { sx: number; sy: number; x: number; y: number; w: number }[] = [];
        function buildConvergeDots() {
            const w = innerWidth, h = innerHeight;
            const N = 100;
            const arr: { sx: number; sy: number }[] = [];
            for (let i = 0; i < N; i++) {
                const t = i / (N - 1);
                arr.push({ sx: lerp(0, w, t), sy: lerp(0, h, t) });
                arr.push({ sx: lerp(w, 0, t), sy: lerp(0, h, t) });
            }
            arr.push({ sx: 0, sy: 0 }, { sx: w, sy: 0 }, { sx: 0, sy: h }, { sx: w, sy: h });
            dots = arr.map(p => ({ sx: p.sx, sy: p.sy, x: p.sx, y: p.sy, w: Math.random() * 1.2 + 0.6 }));
        }

        function render(now: number) {
            let dt = now - prevTime;
            prevTime = now;
            if (dt > 80) dt = 80;

            const sec = dt / 1000;
            zoom += (zoomTarget - zoom) * (1 - Math.exp(-4 * sec));
            FOCAL = lerp(FOCAL_BASE, FOCAL_BASE * 0.88, zoom);
            CAM_DIST = lerp(CAM_DIST_BASE, CAM_DIST_BASE * 1.12, zoom);
            alpha += (alphaTarget - alpha) * (1 - Math.exp(-6 * sec));

            const w = innerWidth, h = innerHeight, cx = w / 2, cy = h / 2;

            if (phase === 0) { // CROSS
                const el = now - t0, p = Math.min(1, el / 1000), e = easeInOutCubic(p);
                ctx.clearRect(0, 0, w, h);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255,255,255,0.85)';
                ctx.beginPath();
                ctx.moveTo(0, 0); ctx.lineTo(lerp(0, w, e), lerp(0, h, e));
                ctx.moveTo(w, 0); ctx.lineTo(lerp(w, 0, e), lerp(0, h, e));
                ctx.stroke();
                ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.6 * e})`;
                ctx.beginPath(); ctx.arc(cx, cy, 3 + 8 * e, 0, TAU); ctx.fill();
                if (el > 1150) { phase = 1; t0 = now; buildConvergeDots(); }
            } else if (phase === 1) { // CONVERGE
                const el = now - t0, p = Math.min(1, el / 800), e = easeOutCubic(p);
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                for (const d of dots) {
                    d.x = lerp(d.sx, cx, e);
                    d.y = lerp(d.sy, cy, e);
                    ctx.beginPath(); ctx.arc(d.x, d.y, d.w * (1.2 - 0.8 * e), 0, TAU); ctx.fill();
                }
                if (p >= 1) {
                    phase = 2;
                    t0 = now;
                    setTimeout(() => onIntroComplete(), 350);
                }
            } else { // MAIN
                ctx.clearRect(0, 0, w, h);
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';

                const mode = modeRef.current;
                if (mode === 0) {
                    updateSea(dt, zoom);
                    drawSea(alpha);
                } else if (mode === 1) {
                    updateWind(dt, zoom);
                    drawWind(alpha);
                } else {
                    updateMesh(dt);
                    drawMesh(alpha);
                    updatePoly(dt);
                    drawPoly(alpha);
                }

                ctx.restore();
            }

            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

        // Expose mode setter
        (window as unknown as { setWaveMode: (m: number) => void }).setWaveMode = (m: number) => {
            modeRef.current = m;
            alpha = 0;
            alphaTarget = 1;
            if (m === 1) zoomTarget = 1;
            else zoomTarget = 0;
        };

        return () => {
            window.removeEventListener('resize', fit);
        };
    }, [onIntroComplete]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
}

export default function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroVisible, setHeroVisible] = useState(false);
    const [allowScroll, setAllowScroll] = useState(false);
    const lockRef = useRef(false);
    const slidesRef = useRef<HTMLDivElement>(null);
    const typeTargetRef = useRef<HTMLHeadingElement>(null);
    const fullText = 'EL SOFT';

    const handleIntroComplete = useCallback(() => {
        setHeroVisible(true);
        setAllowScroll(true);
    }, []);

    // Slide change handler
    const goto = useCallback((i: number) => {
        if (i < 0 || i > 2) return;
        setCurrentSlide(i);
        // Change wave mode
        if ((window as unknown as { setWaveMode: (m: number) => void }).setWaveMode) {
            (window as unknown as { setWaveMode: (m: number) => void }).setWaveMode(i);
        }
    }, []);

    // Wheel/keyboard handlers
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!allowScroll) return;
            e.preventDefault();
            if (lockRef.current) return;
            lockRef.current = true;
            setTimeout(() => (lockRef.current = false), 900);
            if (e.deltaY > 0) goto(currentSlide + 1);
            else goto(currentSlide - 1);
        };

        const handleKey = (e: KeyboardEvent) => {
            if (!allowScroll) return;
            if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goto(currentSlide + 1); }
            if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goto(currentSlide - 1); }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('keydown', handleKey);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKey);
        };
    }, [allowScroll, currentSlide, goto]);

    // Typing animation for slide 3
    useEffect(() => {
        if (currentSlide === 2 && typeTargetRef.current) {
            const target = typeTargetRef.current;
            target.textContent = '';
            target.style.width = '0';
            target.style.borderRight = '2px solid currentColor';

            let i = 0;
            const type = () => {
                if (i < fullText.length) {
                    target.style.width = `${i + 1}ch`;
                    target.textContent += fullText[i++];
                    setTimeout(type, 110);
                } else {
                    target.style.borderRight = 'none';
                }
            };
            type();
        }
    }, [currentSlide]);

    return (
        <>
            <style jsx global>{`
        html, body { height: 100%; overflow: hidden; scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
      `}</style>

            <style jsx>{`
        .slides {
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.7, 0, 0.3, 1);
          position: relative;
          z-index: 2;
        }
        .slide {
          position: relative;
          width: 100%;
          height: 100vh;
          padding-top: 64px;
          overflow: hidden;
          background: transparent;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .title-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          z-index: 10;
          pointer-events: none;
          opacity: 0;
          transform: translateY(30px);
          transition: transform 0.8s cubic-bezier(0.2, 0.7, 0, 1), opacity 0.8s ease;
        }
        .title-wrap.show {
          opacity: 1;
          transform: none;
        }
        .title-wrap h1 {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 900;
          margin-bottom: 0.5rem;
        }
        .title-wrap p {
          font-size: clamp(1rem, 2vw, 1.25rem);
          opacity: 0.85;
        }
        #software {
          flex-direction: column;
        }
        #software h2 {
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 900;
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.8s, transform 0.8s;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.35);
        }
        #software h2.visible {
          opacity: 1;
          transform: translateY(0);
        }
        #software p {
          margin-top: 1rem;
          opacity: 0.8;
          transition: opacity 0.8s;
        }
        #elcompany {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #elcompany h2 {
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 900;
          border-right: 2px solid currentColor;
          white-space: nowrap;
          overflow: hidden;
          width: 0;
        }
      `}</style>

            {/* 3D Canvas Background */}
            <Wave3DCanvas onIntroComplete={handleIntroComplete} />

            {/* Slides Container */}
            <div
                ref={slidesRef}
                className="slides"
                style={{ transform: `translateY(-${currentSlide * 100}vh)` }}
            >
                {/* Slide 1: Hero */}
                <section className="slide" id="hero">
                    <div className={`title-wrap ${heroVisible && currentSlide === 0 ? 'show' : ''}`}>
                        <h1>EL SOFT — 정품 프로그램 스토어</h1>
                        <p>정품 라이선스 · 즉시 다운로드 · 안전 결제</p>
                    </div>
                </section>

                {/* Slide 2: Software */}
                <section id="software" className="slide">
                    <h2 className={currentSlide === 1 ? 'visible' : ''}>
                        모든 프로그램의 새 기준
                    </h2>
                    <p style={{ opacity: currentSlide === 1 ? 0.8 : 0 }}>
                        제품 구매부터 제작 의뢰까지.
                    </p>
                </section>

                {/* Slide 3: Company */}
                <section id="elcompany" className="slide">
                    <h2 ref={typeTargetRef}>EL SOFT</h2>
                </section>
            </div>
        </>
    );
}
