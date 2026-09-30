import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BarChart3, AlertCircle } from 'lucide-react';

export default function AQI3DTerrainBars({ sensors = [] }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 45, 65);
    camera.lookAt(0, 5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Ground Plane with grid
    const grid = new THREE.GridHelper(100, 20, 0x1e2d4a, 0x131c2e);
    scene.add(grid);

    // Create 3D AQI Extruded Bars from Sensor Telemetry
    const displaySensors = sensors.slice(0, 12);
    const barMeshes = [];

    displaySensors.forEach((s, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);

      const posX = (col - 1.5) * 18;
      const posZ = (row - 1.0) * 18;

      // Bar height proportional to AQI (0 to 500 mapped to height 2 to 32)
      const barHeight = Math.max(2, (s.aqi / 500) * 32);

      // Color mapping
      let colorHex = 0x10b981; // Good
      if (s.aqi > 300) colorHex = 0xef4444; // Severe
      else if (s.aqi > 200) colorHex = 0xf97316; // Very Poor
      else if (s.aqi > 100) colorHex = 0xf59e0b; // Moderate

      // Micro vs Macro distinction (Micro bars are square, Macro bars are cylindrical)
      let barGeo;
      if (s.type === 'macro') {
        barGeo = new THREE.CylinderGeometry(2.5, 2.5, barHeight, 24);
      } else {
        barGeo = new THREE.BoxGeometry(3.8, barHeight, 3.8);
      }

      const barMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0.85 });
      const mesh = new THREE.Mesh(barGeo, barMat);
      mesh.position.set(posX, barHeight / 2, posZ);
      scene.add(mesh);

      // Wireframe outline
      const wireGeo = new THREE.WireframeGeometry(barGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
      const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
      wireMesh.position.set(posX, barHeight / 2, posZ);
      scene.add(wireMesh);

      barMeshes.push({ mesh, targetHeight: barHeight, baseAQI: s.aqi });
    });

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera gentle orbit rotation
      camera.position.x = Math.sin(time * 0.15) * 65;
      camera.position.z = Math.cos(time * 0.15) * 65;
      camera.lookAt(0, 8, 0);

      // Pulse high AQI bars
      barMeshes.forEach((item) => {
        if (item.baseAQI > 300) {
          const pulseScale = 1.0 + Math.sin(time * 4) * 0.05;
          item.mesh.scale.set(pulseScale, 1, pulseScale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const nw = mountRef.current.clientWidth;
      const nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [sensors]);

  return (
    <div className="relative w-full h-[460px] rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#0B0F17] to-[#131C2E] border border-[#1E2D4A] overflow-hidden shadow-2xl">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-lg">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            3D City Micro-Climate AQI Bar Height Visualizer
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">Macro vs Micro</span>
          </h3>
          <p className="text-xs text-slate-400">Square bars = Hyper-Local Micro Sensors | Cylinders = Distant CPCB Macro Stations</p>
        </div>
      </div>
    </div>
  );
}
