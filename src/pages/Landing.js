import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Helper function to get a random velocity
const getRandomVelocity = () => (Math.random() - 0.5) * 0.2;

// Helper function to get a random vibrant color
const getRandomVibrantColor = () => {
  const hue = Math.random() * 360;
  const saturation = Math.random() * 50 + 50; // 50-100%
  const lightness = Math.random() * 20 + 50; // 50-70%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Create a Node component that bounces off the walls
const Node = ({ position, velocity }) => {
  const meshRef = useRef();
  const [vel, setVel] = useState(velocity);

  const color = getRandomVibrantColor();

  useFrame(({ clock }) => {
    const mesh = meshRef.current;

    // Update position based on velocity
    mesh.position.x += vel[0];
    mesh.position.y += vel[1];

    // Define boundaries
    const halfWidth = window.innerWidth / 2 - 1;
    const halfHeight = window.innerHeight / 2 - 1;

    // Check for collision with the walls and reverse velocity
    if (mesh.position.x <= -halfWidth || mesh.position.x >= halfWidth) {
      setVel([vel[0] * -1, vel[1]]);
    }
    if (mesh.position.y <= -halfHeight || mesh.position.y >= halfHeight) {
      setVel([vel[0], vel[1] * -1]);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 30, 30]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Create a NodeGraph component to manage nodes
const NodeGraph = ({ nodeCount }) => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const newNodes = Array.from({ length: nodeCount }, () => ({
      position: [Math.random() * 30 - 5, Math.random() * 30 - 8, 0],
      velocity: [getRandomVelocity(), getRandomVelocity()],
    }));
    setNodes(newNodes);
  }, [nodeCount]);

  return (
    <>
      {nodes.map((node, idx) => (
        <Node
          key={idx}
          position={nodes[idx].position}
          velocity={nodes[idx].velocity}
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

const SignUpForm = (props) => (
  <>
    <form>
      <div>
        <label>
          Email:
          <input
            type="email"
            placeholder="jwebber@example.com"
            value={props.userEmail}
            onChange={props.handleEmailChange}
            style={{ marginLeft: "35px", border: "1px solid black" }}
          />
        </label>
      </div>
      <div>
        <label>
          Password:{" "}
          <input
            type="password"
            placeholder="enter password here"
            value={props.userPassword}
            onChange={props.handlePasswordChange}
            style={{ border: "1px solid black" }}
          />
        </label>
      </div>
      <br />
      <div>
        <button
          style={{ background: "#999", padding: "9px" }}
          onClick={() => {
            /* TODO: Implement me */
          }}
        >
          Sign up
        </button>
      </div>
      <br />
      <p>
        Already a user?{" "}
        <span
          onClick={() => props.setIsARegisteredUser(true)}
          style={{ textDecoration: "underline" }}
        >
          Sign In
        </span>
      </p>
    </form>
  </>
);

const SignInForm = (props) => (
  <form>
    <div>
      <label>
        Email:
        <input
          type="email"
          name="userEmail"
          placeholder="jwebber@example.com"
          value={props.userEmail}
          onChange={props.handleEmailChange}
          style={{ marginLeft: "35px", border: "1px solid black" }}
        />
      </label>
    </div>
    <div>
      <label>
        Password:{" "}
        <input
          type="password"
          placeholder="enter password here"
          value={props.userPassword}
          onChange={props.handlePasswordChange}
          style={{ border: "1px solid black" }}
        />
      </label>
    </div>
    <br />
    <div>
      <button
        style={{ background: "#999", padding: "9px" }}
        onClick={(event) => {
          event.preventDefault();
          props.setUserEmail("");
          // TODO: Lookup user in database and redirect them to home page (to the graph)
          // ? Maybe indicate that sign in was successful with a toast...
        }}
      >
        Sign in
      </button>
    </div>
    <br />
    <p>
      Not registered?{" "}
      <span
        onClick={() => props.setIsARegisteredUser(false)}
        style={{ textDecoration: "underline" }}
      >
        Sign up instead
      </span>
    </p>
  </form>
);

const OnboardingForm = (props) => {
  const [isARegisteredUser, setIsARegisteredUser] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [userPassword, setUserPassword] = React.useState("");

  const handleEmailChange = (event) => setUserEmail(event.target.value);
  const handlePasswordChange = (event) => setUserPassword(event.target.value);

  return isARegisteredUser ? (
    <SignInForm
      setIsARegisteredUser={setIsARegisteredUser}
      userEmail={userEmail}
      setUserEmail={setUserEmail}
      handleEmailChange={handleEmailChange}
      password={userPassword}
      setPassword={setUserPassword}
      handlePasswordChange={handlePasswordChange}
    />
  ) : (
    <SignUpForm
      setIsARegisteredUser={setIsARegisteredUser}
      userEmail={userEmail}
      setUserEmail={setUserEmail}
      handleEmailChange={handleEmailChange}
      password={userPassword}
      setPassword={setUserPassword}
      handlePasswordChange={handlePasswordChange}
    />
  );
};

const Landing = () => {
  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      <AnimationBackground nodeCount={300} />
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "65px",
          fontFamily: "monospace, fantasy",
        }}
      >
        Welcome to Folio Graph
      </h1>
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          color: "#33ff33",
          padding: "20px",
          backgroundColor: "gray",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <OnboardingForm />
      </div>
    </div>
  );
};

export default Landing;
