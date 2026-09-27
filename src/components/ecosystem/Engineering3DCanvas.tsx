import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Engineering3DCanvasProps {
  mode?: 'hero' | 'cad-showcase' | 'ambient';
  className?: string;
  accentColor?: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  p1: number;
  p2: number;
  accent?: boolean;
}

interface DimensionLabel {
  p1: Point3D;
  p2: Point3D;
  label: string;
  axis: 'x' | 'y' | 'z' | 'dia';
}

export const Engineering3DCanvas: React.FC<Engineering3DCanvasProps> = ({
  mode = 'hero',
  className = '',
  accentColor = '#06b6d4',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeModel, setActiveModel] = useState<'turbine' | 'bracket' | 'gear'>('turbine');
  const [isInteracting, setIsInteracting] = useState(false);
  const [telemetry, setTelemetry] = useState({ rotX: 25, rotY: 45, zoom: 1.0, fps: 60 });

  // Physics & rotation state
  const stateRef = useRef({
    angleX: 0.35,
    angleY: 0.65,
    angleZ: 0.05,
    autoRotate: true,
    lastTime: performance.now(),
    frameCount: 0,
    fpsTimer: performance.now(),
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    isVisible: true,
  });

  // Generate 3D Models
  const getModelData = useCallback((modelType: 'turbine' | 'bracket' | 'gear') => {
    const vertices: Point3D[] = [];
    const edges: Edge[] = [];
    const dimensions: DimensionLabel[] = [];

    if (modelType === 'turbine') {
      const sectors = 12;
      const baseRadius = 85;

      for (let z of [-35, 0, 35]) {
        for (let i = 0; i < sectors; i++) {
          const angle = (i / sectors) * Math.PI * 2;
          const r = 26 + (z === 0 ? 4 : 0);
          vertices.push({
            x: Math.cos(angle) * r,
            y: Math.sin(angle) * r,
            z: z
          });
        }
      }

      const bladeTipRadius = baseRadius;
      for (let i = 0; i < sectors; i++) {
        const angle = (i / sectors) * Math.PI * 2;
        const angleOffset = 0.45;
        const rootIdx = i;
        const tipIdx = vertices.length;
        vertices.push({
          x: Math.cos(angle + angleOffset) * bladeTipRadius,
          y: Math.sin(angle + angleOffset) * bladeTipRadius,
          z: 22
        });
        vertices.push({
          x: Math.cos(angle + angleOffset + 0.15) * (bladeTipRadius * 0.95),
          y: Math.sin(angle + angleOffset + 0.15) * (bladeTipRadius * 0.95),
          z: -25
        });

        edges.push({ p1: rootIdx, p2: tipIdx, accent: i % 2 === 0 });
        edges.push({ p1: tipIdx, p2: tipIdx + 1, accent: true });
        edges.push({ p1: tipIdx + 1, p2: (rootIdx + sectors), accent: false });
      }

      for (let ring = 0; ring < 3; ring++) {
        const offset = ring * sectors;
        for (let i = 0; i < sectors; i++) {
          const next = (i + 1) % sectors;
          edges.push({ p1: offset + i, p2: offset + next, accent: ring === 1 });
          if (ring < 2) {
            edges.push({ p1: offset + i, p2: offset + sectors + i, accent: false });
          }
        }
      }

      const shroudStart = sectors * 3;
      for (let i = 0; i < sectors; i++) {
        const curr = shroudStart + i * 2;
        const next = shroudStart + ((i + 1) % sectors) * 2;
        edges.push({ p1: curr, p2: next, accent: true });
      }

      dimensions.push({
        p1: { x: -baseRadius, y: 0, z: 0 },
        p2: { x: baseRadius, y: 0, z: 0 },
        label: 'Ø 170.00 mm [CAD_DATUM_A]',
        axis: 'dia'
      });
      dimensions.push({
        p1: { x: 0, y: baseRadius, z: -35 },
        p2: { x: 0, y: baseRadius, z: 35 },
        label: 'H: 70.00 ±0.02 mm',
        axis: 'z'
      });

    } else if (modelType === 'bracket') {
      const bW = 60;
      const bH = 70;
      const bD = 50;

      const pts = [
        { x: -bW, y: -bH / 2, z: -bD },
        { x: bW, y: -bH / 2, z: -bD },
        { x: bW, y: -bH / 2, z: bD },
        { x: -bW, y: -bH / 2, z: bD },
        { x: -bW * 0.4, y: 0, z: -bD },
        { x: bW * 0.4, y: 0, z: -bD },
        { x: bW * 0.4, y: 0, z: bD },
        { x: -bW * 0.4, y: 0, z: bD },
        { x: -bW * 0.4, y: bH, z: -bD * 0.5 },
        { x: bW * 0.4, y: bH, z: -bD * 0.5 },
        { x: bW * 0.4, y: bH, z: bD * 0.5 },
        { x: -bW * 0.4, y: bH, z: bD * 0.5 },
      ];
      pts.forEach(p => vertices.push(p));

      edges.push({ p1: 0, p2: 1, accent: true });
      edges.push({ p1: 1, p2: 2, accent: true });
      edges.push({ p1: 2, p2: 3, accent: true });
      edges.push({ p1: 3, p2: 0, accent: true });

      edges.push({ p1: 4, p2: 5, accent: false });
      edges.push({ p1: 5, p2: 6, accent: false });
      edges.push({ p1: 6, p2: 7, accent: false });
      edges.push({ p1: 7, p2: 4, accent: false });

      edges.push({ p1: 8, p2: 9, accent: true });
      edges.push({ p1: 9, p2: 10, accent: true });
      edges.push({ p1: 10, p2: 11, accent: true });
      edges.push({ p1: 11, p2: 8, accent: true });

      edges.push({ p1: 0, p2: 4 });
      edges.push({ p1: 1, p2: 5 });
      edges.push({ p1: 2, p2: 6 });
      edges.push({ p1: 3, p2: 7 });

      edges.push({ p1: 4, p2: 8, accent: true });
      edges.push({ p1: 5, p2: 9, accent: true });
      edges.push({ p1: 6, p2: 10, accent: true });
      edges.push({ p1: 7, p2: 11, accent: true });

      const boreRadius = 18;
      const bSteps = 10;
      const boreStart = vertices.length;
      for (let i = 0; i < bSteps; i++) {
        const a = (i / bSteps) * Math.PI * 2;
        vertices.push({
          x: Math.cos(a) * boreRadius,
          y: bH * 0.65 + Math.sin(a) * boreRadius,
          z: -bD * 0.5
        });
        vertices.push({
          x: Math.cos(a) * boreRadius,
          y: bH * 0.65 + Math.sin(a) * boreRadius,
          z: bD * 0.5
        });
      }
      for (let i = 0; i < bSteps; i++) {
        const next = (i + 1) % bSteps;
        edges.push({ p1: boreStart + i * 2, p2: boreStart + next * 2, accent: true });
        edges.push({ p1: boreStart + i * 2 + 1, p2: boreStart + next * 2 + 1, accent: true });
        edges.push({ p1: boreStart + i * 2, p2: boreStart + i * 2 + 1, accent: false });
      }

      dimensions.push({
        p1: { x: -bW, y: -bH / 2, z: bD },
        p2: { x: bW, y: -bH / 2, z: bD },
        label: 'W: 120.00 mm',
        axis: 'x'
      });
      dimensions.push({
        p1: { x: bW * 0.4, y: -bH / 2, z: -bD },
        p2: { x: bW * 0.4, y: bH, z: -bD },
        label: 'H: 105.00 mm [ISO 2768-m]',
        axis: 'y'
      });

    } else {
      const teeth = 18;
      const rDed = 58;
      const rAdd = 80;
      const width = 24;

      for (let z of [-width / 2, width / 2]) {
        for (let i = 0; i < teeth; i++) {
          const a0 = (i / teeth) * Math.PI * 2;
          const a1 = a0 + (Math.PI / teeth) * 0.35;
          const a2 = a0 + (Math.PI / teeth) * 0.65;
          const a3 = a0 + (Math.PI / teeth);

          vertices.push({ x: Math.cos(a0) * rDed, y: Math.sin(a0) * rDed, z });
          vertices.push({ x: Math.cos(a1) * rAdd, y: Math.sin(a1) * rAdd, z });
          vertices.push({ x: Math.cos(a2) * rAdd, y: Math.sin(a2) * rAdd, z });
          vertices.push({ x: Math.cos(a3) * rDed, y: Math.sin(a3) * rDed, z });
        }
      }

      const ptsPerSide = teeth * 4;
      for (let side = 0; side < 2; side++) {
        const off = side * ptsPerSide;
        for (let i = 0; i < ptsPerSide; i++) {
          const next = (i + 1) % ptsPerSide;
          edges.push({ p1: off + i, p2: off + next, accent: i % 4 === 1 || i % 4 === 2 });
          if (side === 0 && (i % 2 === 0)) {
            edges.push({ p1: i, p2: i + ptsPerSide, accent: false });
          }
        }
      }

      const boreSteps = 12;
      const boreR = 24;
      const boreStart = vertices.length;
      for (let z of [-width / 2, width / 2]) {
        for (let i = 0; i < boreSteps; i++) {
          const a = (i / boreSteps) * Math.PI * 2;
          vertices.push({ x: Math.cos(a) * boreR, y: Math.sin(a) * boreR, z });
        }
      }
      for (let i = 0; i < boreSteps; i++) {
        const next = (i + 1) % boreSteps;
        edges.push({ p1: boreStart + i, p2: boreStart + next, accent: true });
        edges.push({ p1: boreStart + boreSteps + i, p2: boreStart + boreSteps + next, accent: true });
        edges.push({ p1: boreStart + i, p2: boreStart + boreSteps + i, accent: false });
      }

      dimensions.push({
        p1: { x: -rAdd, y: 0, z: 0 },
        p2: { x: rAdd, y: 0, z: 0 },
        label: 'DA: 160.00 mm [MOD 2.5, Z=18]',
        axis: 'dia'
      });
      dimensions.push({
        p1: { x: 0, y: rDed, z: -width / 2 },
        p2: { x: 0, y: rDed, z: width / 2 },
        label: 'B: 24.00 mm [DIN 867]',
        axis: 'z'
      });
    }

    return { vertices, edges, dimensions };
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const state = stateRef.current;

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const observer = new IntersectionObserver(([entry]) => {
      state.isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (containerRef.current) observer.observe(containerRef.current);

    const { vertices, edges, dimensions } = getModelData(activeModel);

    const particleNodes = Array.from({ length: 14 }).map((_, i) => ({
      angle: (i / 14) * Math.PI * 2,
      orbitR: 110 + (i % 3) * 18,
      speed: 0.004 + (i % 4) * 0.002,
      zOffset: ((i % 5) - 2) * 22,
      label: ['CAD_NODE', 'BOM_LINK', 'STEP_AP242', 'TOL_0.02', 'MESH_G3', 'CAM_5AXIS', 'PARASOLID'][i % 7]
    }));

    const render = (time: number) => {
      if (!state.isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      state.frameCount++;
      if (time - state.fpsTimer > 500) {
        const curFps = Math.round((state.frameCount * 1000) / (time - state.fpsTimer));
        setTelemetry(prev => ({
          ...prev,
          rotX: Math.round(state.angleX * (180 / Math.PI)) % 360,
          rotY: Math.round(state.angleY * (180 / Math.PI)) % 360,
          fps: Math.min(curFps, 60),
        }));
        state.frameCount = 0;
        state.fpsTimer = time;
      }

      if (state.autoRotate && !state.isDragging) {
        state.angleY += 0.006;
        state.angleX = 0.28 + Math.sin(time * 0.0006) * 0.08;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 500;
      const height = rect?.height || 500;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = mode === 'hero' ? Math.min(width, height) * 0.42 : Math.min(width, height) * 0.46;

      const cosX = Math.cos(state.angleX);
      const sinX = Math.sin(state.angleX);
      const cosY = Math.cos(state.angleY);
      const sinY = Math.sin(state.angleY);

      const project = (p: Point3D): { x: number; y: number; z: number } => {
        const x1 = p.x * cosY + p.z * sinY;
        const y1 = p.y;
        const z1 = -p.x * sinY + p.z * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const fov = 420;
        const factor = fov / (fov + z2);
        return {
          x: cx + x2 * factor * (scale / 100),
          y: cy - y2 * factor * (scale / 100),
          z: z2,
        };
      };

      // 1. Draw Technical Coordinate Grid Floor (Light theme)
      ctx.save();
      ctx.lineWidth = 1;
      const gridSize = 160;
      const gridSteps = 8;
      const step = gridSize / gridSteps;
      const floorY = -65;

      for (let i = -gridSteps; i <= gridSteps; i++) {
        const pA = project({ x: i * step, y: floorY, z: -gridSize });
        const pB = project({ x: i * step, y: floorY, z: gridSize });
        const isCenter = i === 0;

        ctx.strokeStyle = isCenter ? 'rgba(6, 182, 212, 0.55)' : 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();

        const pC = project({ x: -gridSize, y: floorY, z: i * step });
        const pD = project({ x: gridSize, y: floorY, z: i * step });
        ctx.strokeStyle = isCenter ? 'rgba(37, 99, 235, 0.55)' : 'rgba(148, 163, 184, 0.2)';
        ctx.beginPath();
        ctx.moveTo(pC.x, pC.y);
        ctx.lineTo(pD.x, pD.y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Project vertices
      const projVertices = vertices.map(v => project(v));

      // 3. Draw Model Edges (Sharp contrast on white)
      edges.forEach(edge => {
        const v1 = projVertices[edge.p1];
        const v2 = projVertices[edge.p2];
        if (!v1 || !v2) return;

        const avgZ = (v1.z + v2.z) / 2;
        const depthAlpha = Math.max(0.35, Math.min(1.0, 0.65 + avgZ / 260));

        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);

        if (edge.accent) {
          ctx.strokeStyle = `rgba(8, 145, 178, ${depthAlpha})`;
          ctx.lineWidth = 1.9;
        } else {
          ctx.strokeStyle = `rgba(51, 65, 85, ${depthAlpha * 0.65})`;
          ctx.lineWidth = 1.0;
        }
        ctx.stroke();
      });

      // 4. Draw Vertex Nodes
      projVertices.forEach((pv, idx) => {
        if (idx % 3 === 0) {
          ctx.beginPath();
          ctx.arc(pv.x, pv.y, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = idx % 6 === 0 ? '#0284c7' : '#475569';
          ctx.fill();
        }
      });

      // 5. Draw Dynamic Engineering Dimensions
      dimensions.forEach(dim => {
        const p1 = project(dim.p1);
        const p2 = project(dim.p2);

        ctx.save();
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(217, 119, 6, 1)';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 2.5, 0, Math.PI * 2);
        ctx.arc(p2.x, p2.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2 - 8;

        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#92400e';
        ctx.textAlign = 'center';
        ctx.fillText(dim.label, midX, midY);
        ctx.restore();
      });

      // 6. Draw Orbiting Data Nodes
      particleNodes.forEach(node => {
        node.angle += node.speed;
        const nodePos: Point3D = {
          x: Math.cos(node.angle) * node.orbitR,
          y: Math.sin(node.angle * 0.45) * 45 + node.zOffset,
          z: Math.sin(node.angle) * (node.orbitR * 0.75),
        };
        const pNode = project(nodePos);

        ctx.beginPath();
        ctx.arc(pNode.x, pNode.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.2)';
        ctx.lineWidth = 0.8;
        ctx.moveTo(cx, cy);
        ctx.lineTo(pNode.x, pNode.y);
        ctx.stroke();

        if (pNode.z > -40) {
          ctx.font = 'bold 8px "JetBrains Mono", monospace';
          ctx.fillStyle = '#475569';
          ctx.fillText(node.label, pNode.x + 6, pNode.y + 3);
        }
      });

      // 7. Coordinate Triad [X, Y, Z]
      const triadOrigin: Point3D = { x: -110, y: -65, z: -110 };
      const triadX: Point3D = { x: -80, y: -65, z: -110 };
      const triadY: Point3D = { x: -110, y: -35, z: -110 };
      const triadZ: Point3D = { x: -110, y: -65, z: -80 };

      const oP = project(triadOrigin);
      const xP = project(triadX);
      const yP = project(triadY);
      const zP = project(triadZ);

      ctx.beginPath();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2;
      ctx.moveTo(oP.x, oP.y);
      ctx.lineTo(xP.x, xP.y);
      ctx.stroke();
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('X', xP.x + 4, xP.y);

      ctx.beginPath();
      ctx.strokeStyle = '#16a34a';
      ctx.moveTo(oP.x, oP.y);
      ctx.lineTo(yP.x, yP.y);
      ctx.stroke();
      ctx.fillStyle = '#16a34a';
      ctx.fillText('Y', yP.x, yP.y - 4);

      ctx.beginPath();
      ctx.strokeStyle = '#2563eb';
      ctx.moveTo(oP.x, oP.y);
      ctx.lineTo(zP.x, zP.y);
      ctx.stroke();
      ctx.fillStyle = '#2563eb';
      ctx.fillText('Z', zP.x + 4, zP.y + 4);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [activeModel, mode, accentColor, getModelData]);

  const handleMouseDown = (e: React.MouseEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.dragStartX = e.clientX;
    stateRef.current.dragStartY = e.clientY;
    stateRef.current.autoRotate = false;
    setIsInteracting(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!stateRef.current.isDragging) return;
    const dx = e.clientX - stateRef.current.dragStartX;
    const dy = e.clientY - stateRef.current.dragStartY;
    stateRef.current.dragStartX = e.clientX;
    stateRef.current.dragStartY = e.clientY;

    stateRef.current.angleY += dx * 0.008;
    stateRef.current.angleX += dy * 0.008;
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
    setIsInteracting(false);
    setTimeout(() => {
      if (!stateRef.current.isDragging) {
        stateRef.current.autoRotate = true;
      }
    }, 2800);
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/90 shadow-sm ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isInteracting ? 'grabbing' : 'grab' }}
    >
      {/* Top Engineering Telemetry HUD */}
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] font-mono text-slate-500 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-600"></span>
          </span>
          <span className="text-cyan-700 font-bold tracking-wider">CAD_VIEWPORT_3D</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">{telemetry.fps} FPS</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-500">
          <span>ROT_X: {telemetry.rotX}°</span>
          <span>ROT_Y: {telemetry.rotY}°</span>
          <span className="text-emerald-600 font-bold">TOL: ±0.015mm</span>
        </div>
      </div>

      {/* Model Selection Switcher */}
      <div className="absolute top-3 right-3 sm:right-4 z-20 flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-[11px] font-medium shadow-xs">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveModel('turbine');
          }}
          className={`px-2 py-1 rounded transition-colors ${activeModel === 'turbine' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Impeller
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveModel('bracket');
          }}
          className={`px-2 py-1 rounded transition-colors ${activeModel === 'bracket' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Bracket
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveModel('gear');
          }}
          className={`px-2 py-1 rounded transition-colors ${activeModel === 'gear' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Gear
        </button>
      </div>

      {/* Main Vector 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />

      {/* Bottom Status */}
      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] font-mono text-slate-500 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-blue-700 border border-slate-200 font-bold shadow-xs">
            {activeModel.toUpperCase()}_REV_4.2
          </span>
          <span className="hidden md:inline text-slate-400 text-[10px]">
            ISO 128 TECHNICAL CAD WIREFRAME
          </span>
        </div>

        <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 animate-pulse" />
          <span>Click & Drag to Orbit 3D</span>
        </div>
      </div>
    </div>
  );
};
