"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// A deterministic node-graph: positions are seeded so server and client
// render identically (avoids hydration mismatch), then Framer Motion
// animates opacity/position drift client-side only.
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

interface Node {
  x: number;
  y: number;
  r: number;
  delay: number;
  drift: number;
}

export function NodeGraph() {
  const { nodes, edges } = useMemo(() => {
    const rand = seededRandom(42);
    const n: Node[] = Array.from({ length: 26 }, () => ({
      x: rand() * 1000,
      y: rand() * 480,
      r: 2 + rand() * 4,
      delay: rand() * 4,
      drift: 8 + rand() * 14,
    }));
    const e: [number, number][] = [];
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dx = n[i].x - n[j].x;
        const dy = n[i].y - n[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 165) e.push([i, j]);
      }
    }
    return { nodes: n, edges: e };
  }, []);

  return (
    <svg
      viewBox="0 0 1000 480"
      className="w-full h-[560px] md:h-[640px]"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="url(#edgeGrad)"
          strokeWidth={0.6}
        />
      ))}

      {nodes.map((node, i) => (
        <motion.g
          key={i}
          animate={{
            y: [0, -node.drift, 0],
            x: [0, node.drift * 0.4, 0],
          }}
          transition={{
            duration: 10 + node.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: node.delay,
          }}
        >
          <circle cx={node.x} cy={node.y} r={node.r * 5} fill="url(#nodeGlow)" opacity={0.35} />
          <motion.circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill="#5eead4"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 3 + node.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.delay,
            }}
          />
        </motion.g>
      ))}
    </svg>
  );
}
