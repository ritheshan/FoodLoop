"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera as ThreePerspectiveCamera, Vector3, Vector2, Raycaster } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import countries from "../../../data/globe.json";

extend({ ThreeGlobe: ThreeGlobe });
const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

let numbersOfRings = [0];

export function Globe({ globeConfig, data, onRegionHover, onRegionClick }) {
  const globeRef = useRef(null);
  const groupRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const cameraRef = useRef();
  
  // Get the camera from the Three.js context
  const { camera, scene } = useThree();


  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };
  useEffect(() => {
    if (camera) {
      cameraRef.current = camera;
    }
  }, [camera]);
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  }, [
    isInitialized,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;
  
    // Filter out any data points with invalid coordinates first
    const validData = data.filter(d => {
      // Check if start coordinates are valid numbers
      const hasValidStart = !isNaN(Number(d.startLat)) && !isNaN(Number(d.startLng));
      
      // If it's an arc, check end coordinates too
      if ('endLat' in d && 'endLng' in d) {
        return hasValidStart && !isNaN(Number(d.endLat)) && !isNaN(Number(d.endLng));
      }
      
      return hasValidStart;
    });
  
    let points = [];
    const arcs = validData.filter(d => 'endLat' in d && 'endLng' in d);
    
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      points.push({
        size: defaultProps.pointSize,
        order: arc.order || 1, // Provide default value if missing
        color: arc.color || '#ffffff', // Provide default color if missing
        lat: Number(arc.startLat),
        lng: Number(arc.startLng),
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order || 1,
        color: arc.color || '#ffffff',
        lat: Number(arc.endLat),
        lng: Number(arc.endLng),
      });
    }
    const nonArcPoints = validData.filter(d => !('endLat' in d) && !('endLng' in d));
    points = points.concat(nonArcPoints.map(p => ({
      size: defaultProps.pointSize,
      order: p.order || 1,
      color: p.color || '#ffffff',
      lat: Number(p.lat || p.startLat),
      lng: Number(p.lng || p.startLng),
    })));
  
    const filteredPoints = points.filter((v, i, a) =>
      a.findIndex((v2) =>
        ["lat", "lng"].every((k) => v2[k] === v[k])
      ) === i
    );
  
    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);
  
    if (arcs.length > 0) {
      globeRef.current
        .arcsData(arcs)
        .arcStartLat(d => Number(d.startLat))
        .arcStartLng(d => Number(d.startLng))
        .arcEndLat(d => Number(d.endLat))
        .arcEndLng(d => Number(d.endLng))
        .arcColor(e => e.color || defaultProps.polygonColor)
        .arcAltitude(e => Number(e.arcAlt) || 0.1)
        .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap(e => Number(e.order) || 1)
        .arcDashGap(15)
        .arcDashAnimateTime(() => defaultProps.arcTime);
    }
  
    if (filteredPoints.length > 0) {
      globeRef.current
        .pointsData(filteredPoints)
        .pointColor(e => e.color)
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2);
    }
  
    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);
  }, [
    isInitialized,
    data,
    defaultProps.pointSize,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.rings,
    defaultProps.maxRings,
  ]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;
  
    const interval = setInterval(() => {
      if (!globeRef.current) return;
  
      // Only use valid data points for rings
      const validData = data.filter(d => !isNaN(Number(d.startLat)) && !isNaN(Number(d.startLng)));
      
      if (validData.length === 0) return;
  
      const newNumbersOfRings = genRandomNumbers(0, validData.length, 
        Math.min(Math.floor((validData.length * 4) / 5), validData.length));
  
      const ringsData = newNumbersOfRings.map(i => {
        const d = validData[i];
        return {
          lat: Number(d.startLat),
          lng: Number(d.startLng),
          color: d.color || defaultProps.polygonColor,
        };
      });
  
      globeRef.current.ringsData(ringsData);
    }, 2000);
  
    return () => {
      clearInterval(interval);
    };
  }, [isInitialized, data]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;
    
    // Create a raycaster for handling mouse interactions
    const handleMouseMove = (event) => {
      if (!globeRef.current) return;
      
      // Convert mouse position to normalized device coordinates
      const mouse = new Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      
      // Find intersections with the globe
      const raycaster = new Raycaster();
      raycaster.setFromCamera(mouse, globeRef.current.parent.parent.children[0]); // camera
      
      const intersects = raycaster.intersectObject(globeRef.current, true);
      
      if (intersects.length > 0) {
        // Get the country/region data from the intersection
        const region = data.find(r => 
          r.startLat === intersects[0].object.userData.lat && 
          r.startLng === intersects[0].object.userData.lng
        );
        
        if (region && region.region) {
          setHoveredRegion(region);
          if (typeof onRegionHover === 'function') {
            onRegionHover(region);
          }
        }
      } else {
        if (hoveredRegion && typeof onRegionHover === 'function') {
          onRegionHover(null);
        }
        setHoveredRegion(null);
      }
    };
    
    const handleClick = () => {
      if (hoveredRegion && typeof onRegionClick === 'function') {
        onRegionClick(hoveredRegion);
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isInitialized, data, hoveredRegion, onRegionHover, onRegionClick]);

  // Ensure proper handling of user data for intersections
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;
    
    // Add userData to each point for raycasting
    data.forEach(point => {
      if (point.startLat && point.startLng) {
        const pointObj = globeRef.current.children.find(child =>
          child.userData && 
          child.userData.lat === point.startLat && 
          child.userData.lng === point.startLng
        );
        
        if (pointObj) {
          pointObj.userData = { ...pointObj.userData, ...point };
        }
      }
    });
  }, [isInitialized, data]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data || !cameraRef.current) return;
    
    const raycaster = new Raycaster();
    const mouse = new Vector2();
  
    const handleMouseMove = (event) => {
      if (!globeRef.current || !cameraRef.current) return;
      
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      try {
        // Use the camera reference from our ref
        raycaster.setFromCamera(mouse, cameraRef.current);
        
        // Find intersections with the globe and its children
        const intersects = raycaster.intersectObject(globeRef.current, true);
        
        if (intersects.length > 0) {
          // Find the closest region
          let closestRegion = null;
          let minDistance = Infinity;
          
          // Loop through data to find region closest to intersection point
          data.forEach(region => {
            if (region.region) {
              const regionLat = Number(region.startLat);
              const regionLng = Number(region.startLng);
              
              // Convert intersection point to lat/lng (simplified approximation)
              const radius = 100; // Approximate globe radius in scene units
              const point = intersects[0].point.normalize().multiplyScalar(radius);
              
              // Get lat/lng from 3D point (simplified)
              const lat = 90 - (Math.acos(point.y / radius) * 180 / Math.PI);
              const lng = (Math.atan2(point.z, point.x) * 180 / Math.PI);
              
              // Calculate distance
              const distance = Math.sqrt(
                Math.pow(regionLat - lat, 2) + 
                Math.pow(regionLng - lng, 2)
              );
              
              if (distance < minDistance && distance < 15) {
                minDistance = distance;
                closestRegion = region;
              }
            }
          });
          
          if (closestRegion) {
            setHoveredRegion(closestRegion);
            if (typeof onRegionHover === 'function') {
              onRegionHover(closestRegion);
            }
          } else {
            if (hoveredRegion && typeof onRegionHover === 'function') {
              onRegionHover(null);
            }
            setHoveredRegion(null);
          }
        } else {
          if (hoveredRegion && typeof onRegionHover === 'function') {
            onRegionHover(null);
          }
          setHoveredRegion(null);
        }
      } catch (error) {
        console.error("Raycasting error:", error);
      }
    };
    
    const handleClick = () => {
      if (hoveredRegion && typeof onRegionClick === 'function') {
        onRegionClick(hoveredRegion);
      }
    };
    
    // Add event listeners to the canvas element directly
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);
      
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
      };
    }
  }, [isInitialized, data, hoveredRegion, onRegionHover, onRegionClick]);

  
  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, []);

  return null;
}

// 1. First, fix the World component to properly handle the camera:

// Fixed World Component with properly instantiated PerspectiveCamera
export const World = (props) => {
  const { globeConfig, data, onLoad } = props;
  const aspect = 1.2; // Original aspect ratio
  const cameraZ = 300;
  
  // Call onLoad when component mounts
  useEffect(() => {
    if (typeof onLoad === 'function') {
      onLoad();
    }
  }, [onLoad]);
  
  return (
    <Canvas 
      style={{ width: '100%', height: '100%' }}
      resize={{ scroll: false }}
      // Define camera directly in Canvas for React Three Fiber to handle properly
    >
      <WebGLRendererConfig />
      <fog attach="fog" args={['#ffffff', 400, 2000]} />
      
      {/* Define the camera as a component to ensure it's created correctly */}
      <PerspectiveCamera
        makeDefault  // This ensures the camera is set as the default camera
        fov={50}
        aspect={aspect}
        near={180}
        far={1800}
        position={[0, 0, cameraZ]}
      />
      
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={[-400, 100, 400]}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={[-200, 500, 200]}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={[-200, 500, 200]}
        intensity={0.8}
      />
      <Globe 
        {...props} 
        onRegionHover={globeConfig.onRegionHover}
        onRegionClick={globeConfig.onRegionClick}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed || 1}
        autoRotate={globeConfig.autoRotate !== false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
};
export function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}
