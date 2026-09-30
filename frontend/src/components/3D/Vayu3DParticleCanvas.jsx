import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Wind, Gauge, Flame, Layers, RotateCcw } from 'lucide-react';

export default function Vayu3DParticleCanvas({ sensorData = [] }) {
  const mountRef = useRef(null);
  const [windSpeed, setWindSpeed] = useState(12.0);
  const [windAngle, setWindAngle] = useState(315); // North-Westerly
  const [inversionHeight, setInversionHeight] = useState(300);
  const [stubbleIntensity, setStubbleIntensity] = useState(1.5);

  const sceneRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0f17, 0.008);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 35, 75);
    camera.lookAt(0, 5, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 4. Ground Grid & Economic Corridor Paths
    const gridHelper = new THREE.GridHelper(160, 40, 0x1e2d4a, 0x131c2e);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Add glowing corridor lines (GT Road & Expressway)
    const lineMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 });
    const corridorGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-60, 0.2, -50),
      new THREE.Vector3(-20, 0.2, -20),
      new THREE.Vector3(20, 0.2, 10),
      new THREE.Vector3(60, 0.2, 40)
    ]);
    const corridorLine = new THREE.Line(corridorGeo, lineMat);
    scene.add(corridorLine);

    // 5. Create 3D Particulate Plume Systems (5,000 particles)
    const particleCount = 4500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const emitterOrigins = [
      { x: -50, y: 1, z: -40, rate: 1.8, color: new THREE.Color(0xef4444) }, // Sangrur Stubble Fire
      { x: -15, y: 1, z: -10, rate: 1.2, color: new THREE.Color(0xf97316) }, // Panipat Dyeing Stacks
      { x: 10, y: 1, z: 15, rate: 1.0, color: new THREE.Color(0xf59e0b) },  // Anand Vihar Transit
      { x: 40, y: 1, z: 35, rate: 0.9, color: new THREE.Color(0x8b5cf6) },  // Taloja Chemical Flares
    ];

    for (let i = 0; i < particleCount; i++) {
      const emitter = emitterOrigins[i % emitterOrigins.length];
      positions[i * 3] = emitter.x + (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = emitter.y + Math.random() * 4;
      positions[i * 3 + 2] = emitter.z + (Math.random() - 0.5) * 8;

      colors[i * 3] = emitter.color.r;
      colors[i * 3 + 1] = emitter.color.g;
      colors[i * 3 + 2] = emitter.color.b;

      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = 0.15 + Math.random() * 0.25;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, pMaterial);
    particlesRef.current = particleSystem;
    scene.add(particleSystem);

    // 6. Emitter 3D Mesh Pillars
    emitterOrigins.forEach(em => {
      const pillarGeo = new THREE.CylinderGeometry(1.2, 1.8, 6, 16);
      const pillarMat = new THREE.MeshBasicMaterial({ color: em.color, wireframe: true });
      const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
      pillarMesh.position.set(em.x, 3, em.z);
      scene.add(pillarMesh);
    });

    // 7. Animation Loop with Physics Simulation
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera Orbit gentle drift
      camera.position.x = Math.sin(time * 0.08) * 80;
      camera.position.z = Math.cos(time * 0.08) * 80;
      camera.lookAt(0, 5, 0);

      // Wind Vector Physics Calculation
      const rad = (windAngle * Math.PI) / 180;
      const windVx = Math.cos(rad) * (windSpeed * 0.035);
      const windVz = Math.sin(rad) * (windSpeed * 0.035);
      const invCap = (inversionHeight / 300) * 22;

      const posAttr = particleSystem.geometry.attributes.position;
      const posArr = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const emitter = emitterOrigins[i % emitterOrigins.length];

        // Apply wind velocity + turbulence
        posArr[idx] += windVx + (Math.sin(time * 2 + i) * 0.08);
        posArr[idx + 1] += velocities[idx + 1] * (stubbleIntensity * 0.8);
        posArr[idx + 2] += windVz + (Math.cos(time * 2 + i) * 0.08);

        // Temperature Inversion Layer Cap (Particles bounce/spread horizontally when hitting inversion cap)
        if (posArr[idx + 1] > invCap) {
          posArr[idx + 1] = invCap;
          posArr[idx] += (Math.random() - 0.5) * 0.4;
          posArr[idx + 2] += (Math.random() - 0.5) * 0.4;
        }

        // Reset particles exiting boundary back to emitter source
        if (Math.abs(posArr[idx]) > 85 || posArr[idx + 1] > 40 || Math.abs(posArr[idx + 2]) > 85) {
          posArr[idx] = emitter.x + (Math.random() - 0.5) * 6;
          posArr[idx + 1] = emitter.y;
          posArr[idx + 2] = emitter.z + (Math.random() - 0.5) * 6;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [windSpeed, windAngle, inversionHeight, stubbleIntensity]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl bg-gradient-to-b from-[#0F172A] to-[#0B0F17] border border-[#1E2D4A] overflow-hidden shadow-2xl">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-lg">
        <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          <Wind className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            3D Atmospheric Particle & Smoke Plume Simulator
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/30">WebGL Live</span>
          </h3>
          <p className="text-xs text-slate-400">Real-time particulate advection & temperature inversion cap physics</p>
        </div>
      </div>

      {/* Interactive Physics Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 glass-panel p-4 rounded-xl border border-slate-700/80 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Wind Speed Control */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-cyan-400" /> Wind Velocity</span>
            <span className="text-cyan-400 font-mono font-bold">{windSpeed} km/h</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="30.0"
            step="1.0"
            value={windSpeed}
            onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Wind Vector Direction */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-amber-400" /> Vector Angle</span>
            <span className="text-amber-400 font-mono font-bold">{windAngle}° (NW)</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="15"
            value={windAngle}
            onChange={(e) => setWindAngle(parseInt(e.target.value))}
            className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Inversion Layer Height */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-purple-400" /> Inversion Cap</span>
            <span className="text-purple-400 font-mono font-bold">{inversionHeight}m</span>
          </div>
          <input
            type="range"
            min="100"
            max="600"
            step="25"
            value={inversionHeight}
            onChange={(e) => setInversionHeight(parseInt(e.target.value))}
            className="w-full accent-purple-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Stubble Fire Rate Multiplier */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-rose-400" /> Biomass Emission</span>
            <span className="text-rose-400 font-mono font-bold">{stubbleIntensity}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.25"
            value={stubbleIntensity}
            onChange={(e) => setStubbleIntensity(parseFloat(e.target.value))}
            className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
