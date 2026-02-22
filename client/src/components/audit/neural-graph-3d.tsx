import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    PerspectiveCamera,
    Float,
    MeshDistortMaterial,
    Sphere,
    Text,
    Line,
    Stars,
    Html
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Zap, Search, Fingerprint, Cpu } from "lucide-react";

interface NodeData {
    id: string;
    label: string;
    color: string;
    position: [number, number, number];
    type: "core" | "vuln" | "opt" | "ai" | "gov" | "oracle" | "access";
}

const NEON_COLORS = {
    pink: "#FF10F0",
    blue: "#08F7FE",
    purple: "#7122FA",
    green: "#00FF9F",
    yellow: "#FFE600",
    gold: "#FFD700",
    orange: "#FF8C00"
};

const NeuralNode: React.FC<{ data: NodeData }> = ({ data }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group position={data.position}>
                <Sphere ref={meshRef} args={[data.type === "core" ? 1.0 : 0.5, 32, 32]}>
                    <MeshDistortMaterial
                        color={data.color}
                        speed={3}
                        distort={data.type === "core" ? 0.3 : 0.1}
                        radius={1}
                        emissive={data.color}
                        emissiveIntensity={1.5}
                        transparent
                        opacity={0.9}
                    />
                </Sphere>
                <Html distanceFactor={10} position={[0, data.type === "core" ? -1.5 : -1, 0]}>
                    <div className="bg-black/80 border border-white/20 px-2 py-1 rounded-sm whitespace-nowrap pointer-events-none">
                        <p className="text-[10px] font-mono text-white/80 tracking-widest">{data.label}</p>
                    </div>
                </Html>
            </group>
        </Float>
    );
};

const DataPacket: React.FC<{ start: [number, number, number]; end: [number, number, number]; color: string; delay?: number; speed?: number }> = ({ start, end, color, delay = 0, speed = 4 }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        const time = (state.clock.getElapsedTime() + delay) % speed;
        const p = time / speed;

        const startVec = new THREE.Vector3(...start);
        const endVec = new THREE.Vector3(...end);
        meshRef.current.position.lerpVectors(startVec, endVec, p);

        // Pulse visibility and scale
        const scale = 0.12 * (1 + Math.sin(state.clock.getElapsedTime() * 10) * 0.2);
        meshRef.current.scale.setScalar(scale);

        if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
            meshRef.current.material.opacity = p < 0.1 ? p * 10 : p > 0.9 ? (1 - p) * 10 : 1;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 16, 16]}>
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={8}
                transparent
                depthWrite={false}
            />
        </Sphere>
    );
};

const Connections: React.FC<{ nodes: NodeData[] }> = ({ nodes }) => {
    const coreNode = nodes.find(n => n.type === "core");
    if (!coreNode) return null;

    return (
        <group>
            {nodes.filter(n => n.type !== "core").map((node, i) => {
                const isSpecial = ["gov", "oracle", "access"].includes(node.type);

                return (
                    <React.Fragment key={i}>
                        <Line
                            points={[coreNode.position, node.position]}
                            color={node.color}
                            lineWidth={isSpecial ? 2 : 1}
                            transparent
                            opacity={isSpecial ? 0.4 : 0.15}
                            dashed={node.type === "access"}
                        />
                        {/* Directional Flow: Special nodes often 'feed' into core or core 'queries' them */}
                        {node.type === "oracle" ? (
                            // Oracles feed data into the core
                            [0, 2].map((d) => (
                                <DataPacket key={`oracle-${i}-${d}`} start={node.position} end={coreNode.position} color={node.color} delay={d} speed={3} />
                            ))
                        ) : node.type === "gov" ? (
                            // Governance 'controls' the core
                            [0, 1.33, 2.66].map((d) => (
                                <DataPacket key={`gov-${i}-${d}`} start={node.position} end={coreNode.position} color={node.color} delay={d} speed={4} />
                            ))
                        ) : (
                            // Standard bidirectional flow for vulnerabilities/optimizations
                            <>
                                {[0, 2].map((d) => (
                                    <DataPacket key={`out-${i}-${d}`} start={coreNode.position} end={node.position} color={node.color} delay={d} />
                                ))}
                                {[1, 3].map((d) => (
                                    <DataPacket key={`in-${i}-${d}`} start={node.position} end={coreNode.position} color={node.color} delay={d} />
                                ))}
                            </>
                        )}
                    </React.Fragment>
                );
            })}
        </group>
    );
};

interface NeuralGraph3DProps {
    vulnerabilities?: any[];
    gasOptimizations?: any[];
}

export const NeuralGraph3D: React.FC<NeuralGraph3DProps> = ({
    vulnerabilities = [],
    gasOptimizations = []
}) => {
    const nodes = useMemo(() => {
        const generatedNodes: NodeData[] = [
            { id: "core", label: "NEURAL_CORE", color: NEON_COLORS.purple, position: [0, 0, 0], type: "core" }
        ];

        // Advanced Forensic Nodes (Simulated based on context)
        generatedNodes.push({ id: "gov", label: "GOVERNANCE_PROTOCOL", color: NEON_COLORS.gold, position: [4, 3, 2], type: "gov" });
        generatedNodes.push({ id: "oracle", label: "PRICE_ORACLE_LINK", color: NEON_COLORS.blue, position: [-5, -2, 3], type: "oracle" });
        generatedNodes.push({ id: "access", label: "ADMIN_ACCESS_CONTROL", color: NEON_COLORS.orange, position: [2, -4, -2], type: "access" });

        vulnerabilities.forEach((v, i) => {
            const angle = (i / vulnerabilities.length) * Math.PI * 2;
            const radius = 6 + Math.random() * 2;
            generatedNodes.push({
                id: `v-${i}`,
                label: v.type.toUpperCase(),
                color: NEON_COLORS.pink,
                position: [
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    (Math.random() - 0.5) * 4
                ],
                type: "vuln"
            });
        });

        gasOptimizations.forEach((g, i) => {
            const angle = (i / gasOptimizations.length) * Math.PI * 2 + Math.PI;
            const radius = 5 + Math.random() * 2;
            generatedNodes.push({
                id: `g-${i}`,
                label: "GAS_OPT",
                color: NEON_COLORS.green,
                position: [
                    Math.cos(angle) * radius,
                    Math.sin(angle) * radius,
                    (Math.random() - 0.5) * 4
                ],
                type: "opt"
            });
        });

        return generatedNodes;
    }, [vulnerabilities, gasOptimizations]);

    return (
        <div className="h-[600px] w-full bg-black/60 rounded-sm border-2 border-neon-purple/20 relative overflow-hidden group shadow-[0_0_50px_rgba(113,34,250,0.1)]">
            {/* Forensic Overlay HUD */}
            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full bg-neon-purple animate-pulse shadow-[0_0_15px_#7122FA]" />
                            <div className="space-y-1">
                                <h4 className="text-[12px] font-black font-mono text-white tracking-[0.4em] uppercase italic">Neural_Protocol_3.3</h4>
                                <p className="text-[10px] font-mono text-neon-purple tracking-widest uppercase opacity-60">Status: Deep_Pattern_Analysis</p>
                            </div>
                        </div>

                        <div className="bg-black/40 border-l border-white/10 p-4 space-y-2">
                            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="h-3 w-3" /> DAO_Flow_Integrity: <span className="text-neon-green">Nominal</span>
                            </p>
                            <p className="text-[10px] font-mono text-neon-blue/60 uppercase tracking-widest flex items-center gap-2">
                                <Cpu className="h-3 w-3" /> Governance_Logic: <span className="text-neon-yellow">Mapped</span>
                            </p>
                            <p className="text-[10px] font-mono text-neon-pink/60 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                                <Zap className="h-3 w-3" /> Recursive_Trace: 0xDA0...FLOW
                            </p>
                        </div>
                    </div>

                    <div className="text-right space-y-4">
                        <div className="bg-neon-pink/10 border border-neon-pink/30 p-4 rounded-sm">
                            <p className="text-[10px] font-mono text-neon-pink font-black tracking-widest mb-1 italic">THREAT_IDENTIFIED</p>
                            <p className="text-2xl font-black font-mono text-white tracking-tighter italic">{vulnerabilities.length}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`h-1 w-4 ${i < vulnerabilities.length ? 'bg-neon-pink shadow-[0_0_8px_#FF10F0]' : 'bg-white/5'}`} />
                                ))}
                            </div>
                            <p className="text-[8px] font-mono text-white/30 tracking-widest">THREAT_INTENSITY_INDEX</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-6">
                    <div className="flex gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Memory_Mapped</p>
                            <p className="text-[12px] font-mono text-neon-blue font-bold tracking-widest">0xFA...7122</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Engine_Core</p>
                            <p className="text-[12px] font-mono text-neon-purple font-bold tracking-widest">LLAMA_SECURITY</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Fingerprint className="h-8 w-8 text-white/10" />
                        <div className="text-[10px] font-mono text-white/40 tracking-widest uppercase text-right leading-none">
                            Cartesi_Machine Proof<br />
                            <span className="text-neon-green font-bold">VERIFIED_LOGIC</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Rain / Grid Effect Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.1)_50%,transparent_51%)] bg-[size:20px_20px]" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.1)_50%,transparent_51%)] bg-[size:20px_20px]" />

            <Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                    <div className="w-16 h-16 border-t-2 border-neon-purple rounded-full animate-spin mb-4" />
                    <p className="text-neon-purple font-mono animate-pulse tracking-[0.3em] uppercase">Initializing_Neural_Scene...</p>
                </div>
            }>
                <Canvas shadows dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.8}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 3}
                    />

                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={2} color={NEON_COLORS.blue} />
                    <pointLight position={[-10, -10, -10]} intensity={2} color={NEON_COLORS.pink} />
                    <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={2} color={NEON_COLORS.purple} />

                    <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />

                    <group>
                        {nodes.map((node) => (
                            <NeuralNode key={node.id} data={node} />
                        ))}
                        <Connections nodes={nodes} />
                    </group>
                </Canvas>
            </Suspense>

            {/* Scanning Laser Effect */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-neon-purple/40 shadow-[0_0_15px_#7122FA] pointer-events-none z-10"
            />

            {/* Scanline overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(157,0,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px]" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        </div>
    );
};
