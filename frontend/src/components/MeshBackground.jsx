/**
 * src/components/MeshBackground.jsx
 * Component for background mesh gradient / glow effect.
 * Characterized by subtle emerald and neon green "spills" in screen corners.
 */

import React from 'react'

const MeshBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-50 pointer-events-none select-none bg-white">
      {/* Mesh Blob - Top Right (Vibrant Emerald) */}
      <div
        className="absolute w-[1000px] h-[1000px] rounded-full blur-[140px] opacity-[0.65] animate-mesh"
        style={{
          top: '-25%',
          right: '-15%',
          background: 'radial-gradient(circle, #059669 0%, transparent 75%)',
          animationDelay: '0s'
        }}
      />

      {/* Mesh Blob - Bottom Left (Electric Green) */}
      <div
        className="absolute w-[900px] h-[900px] rounded-full blur-[120px] opacity-[0.55] animate-mesh"
        style={{
          bottom: '-20%',
          left: '-10%',
          background: 'radial-gradient(circle, #10b981 0%, transparent 75%)',
          animationDelay: '-5s'
        }}
      />

      {/* Mesh Blob - Center Left (Mint Glow) */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full blur-[110px] opacity-[0.45] animate-mesh"
        style={{
          top: '20%',
          left: '-15%',
          background: 'radial-gradient(circle, #34d399 0%, transparent 70%)',
          animationDelay: '-2s'
        }}
      />

      {/* Mesh Blob - Bottom Right (Deep Forest) */}
      <div
        className="absolute w-[950px] h-[950px] rounded-full blur-[160px] opacity-[0.5] animate-mesh"
        style={{
          bottom: '-10%',
          right: '-10%',
          background: 'radial-gradient(circle, #064e3b 0%, transparent 75%)',
          animationDelay: '-8s'
        }}
      />

      {/* Mesh Blob - Top Left Corner (Soft Neon) */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full blur-[100px] opacity-[0.45] animate-mesh"
        style={{
          top: '-5%',
          left: '-10%',
          background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)',
          animationDelay: '-12s'
        }}
      />

      {/* Subtle Noise/Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  )
}

export default MeshBackground
