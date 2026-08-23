'use client';

import React from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

export function ShaderGradient() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <MeshGradient
        width={1280}
        height={720}
        colors={["#ffffff", "#fef9c3", "#fef08a", "#fffbeb"]}
        distortion={0.55}
        swirl={0.14}
        grainMixer={0}
        grainOverlay={0}
        speed={0.7}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
