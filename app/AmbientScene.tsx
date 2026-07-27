"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AmbientScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 4.4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.55, 5);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uPointer;
        varying vec3 vNormalWorld;
        varying vec3 vWorldPosition;
        varying float vWave;

        void main() {
          vec3 p = position;
          float waveA = sin(p.x * 3.2 + uTime * .48);
          float waveB = sin(p.y * 4.1 - uTime * .36);
          float waveC = cos(p.z * 3.7 + uTime * .29 + uScroll * .7);
          float pointerField = exp(-length(p.xy - uPointer * .95) * 1.5);
          float displacement = (waveA + waveB + waveC) * .065 + pointerField * .11;
          p += normal * displacement;

          vec4 world = modelMatrix * vec4(p, 1.0);
          vWorldPosition = world.xyz;
          vNormalWorld = normalize(mat3(modelMatrix) * normal);
          vWave = displacement;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        varying vec3 vNormalWorld;
        varying vec3 vWorldPosition;
        varying float vWave;

        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormalWorld)), 0.0), 2.15);
          vec3 deep = vec3(.018, .026, .09);
          vec3 violet = vec3(.24, .13, .66);
          vec3 cyan = vec3(.15, .78, 1.0);
          vec3 color = mix(deep, violet, smoothstep(-.15, .16, vWave));
          color = mix(color, cyan, fresnel * .72);
          float alpha = .24 + fresnel * .62;
          gl_FragColor = vec4(color, alpha);
        }
      `,
    });

    const orb = new THREE.Mesh(geometry, material);
    orb.rotation.set(-0.18, 0.35, 0.12);
    scene.add(orb);

    const wireframe = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        color: 0x7e9cff,
        transparent: true,
        opacity: 0.055,
        wireframe: true,
        depthWrite: false,
      }),
    );
    wireframe.scale.setScalar(1.008);
    scene.add(wireframe);

    const starCount = 360;
    const starPositions = new Float32Array(starCount * 3);
    for (let index = 0; index < starCount; index += 1) {
      const radius = 2.4 + Math.random() * 7;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 7;
      starPositions[index * 3] = Math.cos(angle) * radius;
      starPositions[index * 3 + 1] = elevation;
      starPositions[index * 3 + 2] = Math.sin(angle) * radius - 1.5;
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        color: 0xcbd3ff,
        size: 0.014,
        transparent: true,
        opacity: 0.48,
        sizeAttenuation: true,
      }),
    );
    scene.add(stars);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    let scrollTarget = window.scrollY;
    let scrollCurrent = scrollTarget;

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };
    const onScroll = () => {
      scrollTarget = window.scrollY;
    };
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      frame = window.requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      pointer.lerp(pointerTarget, prefersReducedMotion ? 0.025 : 0.055);
      scrollCurrent += (scrollTarget - scrollCurrent) * 0.06;

      material.uniforms.uTime.value = prefersReducedMotion ? time * 0.12 : time;
      material.uniforms.uScroll.value = scrollCurrent / window.innerHeight;
      material.uniforms.uPointer.value.copy(pointer);

      if (!prefersReducedMotion) {
        orb.rotation.y = time * 0.055 + pointer.x * 0.18;
        orb.rotation.x = -0.18 + Math.sin(time * 0.18) * 0.055 - pointer.y * 0.08;
        wireframe.rotation.copy(orb.rotation);
        stars.rotation.y = time * 0.008;
      }

      const scrollProgress = Math.min(scrollCurrent / window.innerHeight, 2.8);
      orb.position.y = scrollProgress * -0.2;
      wireframe.position.copy(orb.position);
      orb.scale.setScalar(1 + Math.min(scrollProgress, 1.4) * 0.075);
      wireframe.scale.setScalar(1.008 + Math.min(scrollProgress, 1.4) * 0.075);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      starsGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      (wireframe.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="ambient-scene" aria-hidden="true" />;
}
