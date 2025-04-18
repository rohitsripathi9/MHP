import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const FoodModel = ({ position = [1, -1.2, 0] }) => {
  const { scene } = useGLTF('/models/burger.glb');
  const modelRef = useRef();

  // Floating Animation
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
      modelRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.2 + position[1]; // Floating with base offset
    }
  });

  return <primitive object={scene} ref={modelRef} scale={0.9} position={position} />;
};

// ✅ Make sure to export it correctly
export default FoodModel;
