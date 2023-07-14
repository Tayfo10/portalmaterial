import {
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  useTexture,
  Text,
  CameraControls,
} from "@react-three/drei";
import Lights from "./Lights.jsx";
import * as THREE from "three";
import { Ninja } from "./components/Ninja.jsx";
import { Yeti } from "./components/Yeti.jsx";
import { BlueDemon } from "./components/BlueDemon.jsx";
import { useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";

export default function Experience() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <Lights />
      <CameraControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
      />
      <MonsterStage
        name="Sunset"
        color={"yellow"}
        texture={"textures/flametexture.jpg"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Ninja scale={0.4} position-y={-1} hovered={hovered === "Ninja"} />
      </MonsterStage>
      <MonsterStage
        name="Thunder"
        color={"Blue"}
        texture={"textures/raintexture.jpg"}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <BlueDemon
          scale={0.4}
          position-y={-1}
          hovered={hovered === "BlueDemon"}
        />
      </MonsterStage>
      <MonsterStage
        name="Yeti"
        color={"White"}
        texture={"textures/snowtexture.jpg"}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Yeti scale={0.4} position-y={-1} hovered={hovered === "Yeti"} />
      </MonsterStage>
    </>
  );
}

const MonsterStage = ({
  hovered,
  setHovered,
  active,
  setActive,
  name,
  texture,
  color,
  children,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();

  useFrame((state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });

  return (
    <group {...props}>
      <Text
        font="fonts/Caprasimo-Regular.ttf"
        fontSize={0.3}
        position={[0, -1.3, 0.051]}
        anchorY={"bottom"}
      >
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onPointerEnter={() => {
          setHovered(name);
        }}
        onPointerLeave={() => {
          setHovered(null);
        }}
        onDoubleClick={() => {
          setActive(active === name ? null : name);
        }}
      >
        <MeshPortalMaterial side={THREE.DoubleSide} ref={portalMaterial}>
          <Lights />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
