import React from 'react';
import './Header.css';
import MyComponent from './MyComponent';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FoodModel from '../FoodModel';

const Header = () => {
  return (
    <div className='header'>
      {/* Other Header Contents */}
      <div className="header-contents">
        <MyComponent />
        {/* Add the class here */}
        <button className="view-menu-btn">
  <a href="#explore-menu" style={{}}>
    View Menu
  </a>
</button>
      </div>

      {/* 3D Model Canvas */}
      <div className='header-3d-model'>
      <Canvas camera={{ position: [3, 12, 3], fov: 50 }}>
      <ambientLight intensity={1.5} />
          <FoodModel />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
  );
};

export default Header;
