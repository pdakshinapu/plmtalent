import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const Architecture3DCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [telemetry, setTelemetry] = useState({ fps: 60, orbitAngle: 0 });

  const stateRef = useRef({
    angleX: 0.35,
    angleY: 0.5,
    autoRotate: true,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    isVisible: true,
    lastTime: performance.now(),
    frameCount: 0,
    fpsTimer: performance.now(),
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const state = stateRef.current;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const observer = new IntersectionObserver(([entry]) => {
      state.isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (containerRef.current) observer.observe(containerRef.current);

    // Orbiting Architecture Satellite Nodes
    const satelliteNodes = [
      { label: 'PLM', color: '#06b6d4', angle: 0, radius: 105, speed: 0.007 },
      { label: 'CAD', color: '#3b82f6', angle: (Math.PI * 2) / 8, radius: 110, speed: 0.007 },
      { label: 'AI', color: '#f97316', angle: (Math.PI * 4) / 8, radius: 115, speed: 0.007 },
      { label: 'CLOUD', color: '#a855f7', angle: (Math.PI * 6) / 8, radius: 105, speed: 0.007 },
      { label: 'JOBS', color: '#10b981', angle: (Math.PI * 8) / 8, radius: 110, speed: 0.007 },
      { label: 'SKILLS', color: '#0ea5e9', angle: (Math.PI * 10) / 8, radius: 115, speed: 0.007 },
      { label: 'EMPLOYERS', color: '#14b8a6', angle: (Math.PI * 12) / 8, radius: 105, speed: 0.007 },
      { label: 'GOVERNANCE', color: '#f59e0b', angle: (Math.PI * 14) / 8, radius: 110, speed: 0.007 },
    ];

    // Central 3D wireframe lattice
    const coreSize = 36;
    const vertices: Point3D[] = [
      { x: -coreSize, y: -coreSize, z: -coreSize },
      { x: coreSize, y: -coreSize, z: -coreSize },
      { x: coreSize, y: coreSize, z: -coreSize },
      { x: -coreSize, y: coreSize, z: -coreSize },
      { x: -coreSize, y: -coreSize, z: coreSize },
      { x: coreSize, y: -coreSize, z: coreSize },
      { x: coreSize, y: coreSize, z: coreSize },
      { x: -coreSize, y: coreSize, z: coreSize },
      // Inner diamond
      { x: 0, y: -coreSize * 1.3, z: 0 },
      { x: 0, y: coreSize * 1.3, z: 0 },
      { x: -coreSize * 1.3, y: 0, z: 0 },
      { x: coreSize * 1.3, y: 0, z: 0 },
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
      // Connect inner diamond
      [8, 0], [8, 1], [8, 4], [8, 5],
      [9, 2], [9, 3], [9, 6], [9, 7],
      [10, 0], [10, 3], [10, 4], [10, 7],
      [11, 1], [11, 2], [11, 5], [11, 6],
    ];

    const render = (time: number) => {
      if (!state.isVisible) {
        animationId = requestAnimationFrame(render);
        return;
      }

      state.frameCount++;
      if (time - state.fpsTimer > 500) {
        setTelemetry({
          fps: Math.min(Math.round((state.frameCount * 1000) / (time - state.fpsTimer)), 60),
          orbitAngle: Math.round(state.angleY * (180 / Math.PI)) % 360,
        });
        state.frameCount = 0;
        state.fpsTimer = time;
      }

      if (state.autoRotate && !state.isDragging) {
        state.angleY += 0.005;
        state.angleX = 0.25 + Math.sin(time * 0.0005) * 0.08;
      }

      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 400;
      const height = rect?.height || 400;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.44;

      const cosX = Math.cos(state.angleX);
      const sinX = Math.sin(state.angleX);
      const cosY = Math.cos(state.angleY);
      const sinY = Math.sin(state.angleY);

      const project = (p: Point3D) => {
        const x1 = p.x * cosY + p.z * sinY;
        const y1 = p.y;
        const z1 = -p.x * sinY + p.z * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const factor = 380 / (380 + z2);
        return {
          x: cx + x2 * factor * (scale / 100),
          y: cy - y2 * factor * (scale / 100),
          z: z2,
        };
      };

      // 1. Draw Orbital Rings
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);

      // Elliptical projected orbit
      for (const r of [85, 110]) {
        ctx.beginPath();
        for (let i = 0; i <= 36; i++) {
          const a = (i / 36) * Math.PI * 2;
          const pt = project({ x: Math.cos(a) * r, y: 0, z: Math.sin(a) * r });
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw Central 3D Lattice
      const projVertices = vertices.map(v => project(v));

      edges.forEach(([p1, p2]) => {
        const v1 = projVertices[p1];
        const v2 = projVertices[p2];
        if (!v1 || !v2) return;

        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });

      // Central core badge
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#081120';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('PLM+CAD', cx, cy - 2);
      ctx.font = '7px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('CORE', cx, cy + 7);
      ctx.restore();

      // 3. Draw Orbiting Satellite Nodes
      satelliteNodes.forEach(node => {
        node.angle += node.speed;
        const pos: Point3D = {
          x: Math.cos(node.angle) * node.radius,
          y: Math.sin(node.angle * 1.5) * 18,
          z: Math.sin(node.angle) * node.radius,
        };
        const pt = project(pos);

        // Ray to center
        ctx.beginPath();
        ctx.strokeStyle = `${node.color}30`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(cx, cy);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();

        // Glowing node
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = 'bold 8px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(node.label, pt.x + 6, pt.y + 3);
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.dragStartX = e.clientX;
    stateRef.current.dragStartY = e.clientY;
    stateRef.current.autoRotate = false;
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
    setTimeout(() => {
      if (!stateRef.current.isDragging) stateRef.current.autoRotate = true;
    }, 2500);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative select-none overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/70 backdrop-blur-xl ${className}`}
      style={{ cursor: 'grab' }}
    >
      <div className="absolute top-3 left-4 right-4 z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>ARCHITECTURE_3D_CORE</span>
        </div>
        <span>{telemetry.fps} FPS</span>
      </div>

      <canvas ref={canvasRef} className="w-full h-full block" />

      <div className="absolute bottom-2.5 left-4 right-4 z-10 flex items-center justify-between text-[9px] font-mono text-slate-500 pointer-events-none">
        <span>CENTER: PLM + CAD</span>
        <span>Drag to Orbit</span>
      </div>
    </div>
  );
};
