import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Network, Cpu, ShieldCheck, RefreshCw } from 'lucide-react';

export default function Fed3DNetworkOrbiter({ fedState, onTriggerRound, isTraining }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 55);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Central Orchestrator Core (Glowing Orb)
    const coreGeo = new THREE.IcosahedronGeometry(6, 2);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Central Inner Solid Sphere
    const innerGeo = new THREE.SphereGeometry(3.8, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 3. Regional Client Nodes (4 Spheres positioned around orbit)
    const nodeConfigs = [
      { name: "Delhi-NCR Node", color: 0xef4444, radius: 22, angle: 0 },
      { name: "Punjab Agri Node", color: 0x881337, radius: 22, angle: Math.PI / 2 },
      { name: "Haryana Ind Node", color: 0xf59e0b, radius: 22, angle: Math.PI },
      { name: "Mumbai Port Node", color: 0x10b981, radius: 22, angle: (3 * Math.PI) / 2 }
    ];

    const nodeMeshes = [];
    const lineGeometries = [];
    const packetSystems = [];

    // Orbital ring line
    const ringGeo = new THREE.RingGeometry(21.8, 22.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x1e2d4a, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    scene.add(ringMesh);

    nodeConfigs.forEach((cfg, idx) => {
      // Node Mesh
      const nodeGeo = new THREE.SphereGeometry(2.8, 24, 24);
      const nodeMat = new THREE.MeshBasicMaterial({ color: cfg.color });
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);

      const x = Math.cos(cfg.angle) * cfg.radius;
      const z = Math.sin(cfg.angle) * cfg.radius;
      mesh.position.set(x, 0, z);
      scene.add(mesh);
      nodeMeshes.push({ mesh, cfg, baseAngle: cfg.angle });

      // Connection Line to Center
      const lineMat = new THREE.LineBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.45 });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, z),
        new THREE.Vector3(0, 0, 0)
      ]);
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      scene.add(lineMesh);

      // Glowing Weight Stream Packets along connection line
      const packetGeo = new THREE.BufferGeometry();
      const packetPos = new Float32Array(30 * 3);
      for (let p = 0; p < 30; p++) {
        const t = Math.random();
        packetPos[p * 3] = x * t;
        packetPos[p * 3 + 1] = 0;
        packetPos[p * 3 + 2] = z * t;
      }
      packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPos, 3));
      const packetMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.9, transparent: true, opacity: 0.9 });
      const packetPoints = new THREE.Points(packetGeo, packetMat);
      scene.add(packetPoints);
      packetSystems.push({ packetPoints, x, z });
    });

    // 4. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Rotate Central Core
      coreMesh.rotation.x = time * 0.3;
      coreMesh.rotation.y = time * 0.5;

      // Orbit Regional Client Nodes
      nodeMeshes.forEach((item, idx) => {
        const currentAngle = item.baseAngle + time * 0.15;
        const nx = Math.cos(currentAngle) * item.cfg.radius;
        const nz = Math.sin(currentAngle) * item.cfg.radius;
        item.mesh.position.set(nx, 0, nz);

        // Animate weight packet flow along dynamic coordinates
        const pkt = packetSystems[idx];
        const posAttr = pkt.packetPoints.geometry.attributes.position;
        const posArr = posAttr.array;

        for (let p = 0; p < 30; p++) {
          let t = (p / 30 + time * (isTraining ? 1.5 : 0.4)) % 1.0;
          posArr[p * 3] = nx * t;
          posArr[p * 3 + 1] = Math.sin(t * Math.PI) * 2;
          posArr[p * 3 + 2] = nz * t;
        }
        posAttr.needsUpdate = true;
      });

      // Tilt Scene slightly for 3D depth perspective
      scene.rotation.x = 0.35;
      scene.rotation.y = time * 0.05;

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
  }, [isTraining]);

  return (
    <div className="relative w-full h-[460px] rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#0B0F17] to-[#131C2E] border border-[#1E2D4A] overflow-hidden shadow-2xl">
      {/* Three.js 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Network Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 shadow-lg">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Network className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            3D Federated Learning Neural Orbiter
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">Differential Privacy</span>
          </h3>
          <p className="text-xs text-slate-400">Zero raw data centralization — privacy-preserving gradient aggregation</p>
        </div>
      </div>

      {/* Action Overlay: Trigger FL Training Round Button */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
        <button
          onClick={onTriggerRound}
          disabled={isTraining}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
          {isTraining ? 'Aggregating Round Weights...' : 'Execute FL Training Round'}
        </button>
      </div>
    </div>
  );
}
