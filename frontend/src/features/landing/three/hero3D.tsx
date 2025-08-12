import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Euler } from 'three';
import { useGLTF } from '@react-three/drei';
import styled from '@emotion/styled';
import { Colors } from '@/features/constants';

function Model({ rotationY }: { rotationY: number }) {
  const gltf = useGLTF('/three_models/samsung_phone.glb');
  const euler = new Euler(-0.3, rotationY, 0, 'YXZ');

  return (
    <group rotation={euler} position={[0, 0, 0]} scale={0.1}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function RotatingModel({
  dragDeltaXRef,
}: {
  dragDeltaXRef: React.MutableRefObject<number>;
}) {
  const [rotationY, setRotationY] = useState(0);

  // On every frame, update rotationY by delta stored in ref, then decay delta
  useFrame(() => {
    if (dragDeltaXRef.current !== 0) {
      setRotationY((r) => r + dragDeltaXRef.current);
      // Decay the delta to smooth out rotation stop
      dragDeltaXRef.current *= 0.9;
      // If delta is tiny, zero it out
      if (Math.abs(dragDeltaXRef.current) < 0.001) {
        dragDeltaXRef.current = 0;
      }
    }
  });

  return <Model rotationY={rotationY} />;
}

function ZoomControl() {
  const { camera, gl } = useThree();

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.min(Math.max(camera.position.z, 12), 15);
      camera.updateProjectionMatrix();
    };

    gl.domElement.addEventListener('wheel', handleWheel);
    return () => gl.domElement.removeEventListener('wheel', handleWheel);
  }, [camera, gl]);

  return null;
}

export default function Hero3D({ className }: { className?: string }) {
  const dragDeltaXRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastX.current;
    lastX.current = e.clientX;
    // Instead of directly updating rotation, add to delta ref for frame-by-frame smooth rotation
    dragDeltaXRef.current += deltaX * 0.005; // adjust sensitivity here
  };

  return (
    <Container className={className}>
      <Canvas
        style={{ height: '100%', width: '100%' }}
        camera={{ position: [0, 2, 12], fov: 50 }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingModel dragDeltaXRef={dragDeltaXRef} />
        <ZoomControl />
      </Canvas>
    </Container>
  );
}

const Container = styled.section`
  @media (max-width: 768px) {
    .container {
      /* background-image: linear-gradient(
        to left,
        ${Colors.PrimaryLight[8]},
        ${Colors.PrimaryLight[5]},
        ${Colors.PrimaryLight[9]},
        ${Colors.PrimaryLight[8]},
        ${Colors.PrimaryLight[9]},
        ${Colors.PrimaryLight[4]},
        ${Colors.PrimaryLight[5]},
        ${Colors.PrimaryLight[9]},
      ); */
    }

    height: auto;
    min-height: auto;

    canvas {
      width: 100%;
      min-width: 100%;
      height: 500px;
      min-height: 500px;
    }
  }
`;
