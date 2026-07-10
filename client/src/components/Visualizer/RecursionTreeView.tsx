import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useExecutionStore } from '../../store/useExecutionStore';
import { GitBranch } from 'lucide-react';

interface TreeNodeData {
  id: string;
  name: string;
  value?: unknown;
  children?: TreeNodeData[];
}

/**
 * Attempt to reconstruct a tree from callstack (recursion tree).
 * For each frame in the callStack, we build a node.
 */
function buildCallTree(trace: ReturnType<typeof useExecutionStore.getState>['trace'], upToStep: number): TreeNodeData | null {
  if (trace.length === 0) return null;

  // Build a simple recursion tree from the call events
  const root: TreeNodeData = { id: 'root', name: 'main', children: [] };
  const stack: TreeNodeData[] = [root];

  for (let i = 0; i <= upToStep && i < trace.length; i++) {
    const step = trace[i];
    if (step.event === 'call') {
      const funcName = step.callStack[step.callStack.length - 1]?.function || 'fn';
      const node: TreeNodeData = {
        id: `${i}-${funcName}`,
        name: `${funcName}(${step.line})`,
        children: [],
      };
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(node);
      stack.push(node);
    } else if (step.event === 'return') {
      if (stack.length > 1) stack.pop();
    }
  }

  return root.children && root.children.length > 0 ? root : null;
}

export const RecursionTreeView: React.FC = () => {
  const { trace, currentStep } = useExecutionStore();
  const svgRef = useRef<SVGSVGElement>(null);

  const treeData = buildCallTree(trace, currentStep);

  useEffect(() => {
    if (!svgRef.current || !treeData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 400;
    const height = svgRef.current.clientHeight || 300;

    const g = svg.append('g').attr('transform', 'translate(40,20)');

    const root = d3.hierarchy<TreeNodeData>(treeData);
    const treeLayout = d3.tree<TreeNodeData>().size([height - 40, width - 100]);
    treeLayout(root);

    // Links
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(96,165,250,0.3)')
      .attr('stroke-width', 1.5)
      .attr('d', (d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x) as any)
      );


    // Nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node.append('circle')
      .attr('r', 18)
      .attr('fill', '#1a2035')
      .attr('stroke', 'rgba(96,165,250,0.6)')
      .attr('stroke-width', 1.5);

    node.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .style('font-size', '8px')
      .style('font-family', 'JetBrains Mono, monospace')
      .text((d) => d.data.name.slice(0, 8));
  }, [treeData, currentStep]);

  if (trace.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3"
           style={{ color: 'var(--text-muted)' }}>
        <GitBranch size={28} className="opacity-40" />
        <p className="text-xs">Run recursive code to see the call tree</p>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-full text-xs" style={{ color: 'var(--text-muted)' }}>
        No recursive calls detected yet
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      />
    </div>
  );
};
