// App.js
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
// import { Vector3 } from "three";

// Helper function to get a random velocity
const getRandomVelocity = () => (Math.random() - 0.5) * 0.2;

// Helper function to get a random color
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

// Create a Node component that bounces off the walls
const Node = ({ position, velocity, color }) => {
  const meshRef = useRef();
  const [vel, setVel] = useState(velocity);

  useFrame(() => {
    const mesh = meshRef.current;
    mesh.position.x += vel[0];
    mesh.position.y += vel[1];

    // Define boundaries
    const halfWidth = window.innerWidth / 360;
    const halfHeight = window.innerHeight / 360;

    // Check for collision with the edges and reverse velocity
    if (mesh.position.x <= -halfWidth || mesh.position.x >= halfWidth) {
      setVel([vel[0] * -1, vel[1]]);
    }
    if (mesh.position.y <= -halfHeight || mesh.position.y >= halfHeight) {
      setVel([vel[0], vel[1] * -1]);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Create a NodeGraph component to manage nodes
const NodeGraph = ({ nodeCount }) => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const newNodes = Array.from({ length: nodeCount }, () => ({
      position: [Math.random() * 30 - 5, Math.random() * 30 - 5, 0],
      velocity: [getRandomVelocity(), getRandomVelocity()],
      color: getRandomColor(),
    }));
    setNodes(newNodes);
  }, [nodeCount]);

  return (
    <>
      {nodes.map((node, idx) => (
        <Node
          key={idx}
          position={node.position}
          velocity={node.velocity}
          color={node.color}
        />
      ))}
    </>
  );
};

const AdjustAspectRatio = () => {
  const { camera, size } = useThree();

  useEffect(() => {
    const handleResize = () => {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    };

    handleResize(); // Initial call to set the aspect ratio
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [camera, size]);

  return null;
};

const AnimationBackground = ({ nodeCount }) => (
  <Canvas
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
    }}
  >
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
    <NodeGraph nodeCount={nodeCount} />
    <OrbitControls />
    <AdjustAspectRatio />
  </Canvas>
);

const Landing = () => (
  <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
    <AnimationBackground nodeCount={30} />
    <div
      style={{
        position: "absolute",
        zIndex: 1,
        color: "#fff",
        padding: "20px",
      }}
    >
      <h1>Welcome to Our Service</h1>
      <p>Subscribe to get updates</p>
      <input type="email" placeholder="Enter your email" />
      <button>Subscribe</button>
    </div>
  </div>
);

export default Landing;
