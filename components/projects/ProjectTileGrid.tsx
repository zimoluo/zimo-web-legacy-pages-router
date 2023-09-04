import React, { useEffect, useState, useRef } from 'react';
import ProjectTile from './ProjectTile';
import ProjectData from '@/interfaces/projects/projectData';

type Props = {
  entries: ProjectData[];
};

const ProjectTileGrid: React.FC<Props> = ({ entries }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [numCols, setNumCols] = useState<number>(2);
  const [gap, setGap] = useState<number>(32);
  const [itemWidth, setItemWidth] = useState<number>(192);

  useEffect(() => {
    function updateGrid() {
      const grid = gridRef.current;
      if (grid) {
        const containerWidth = grid.clientWidth;

        const occupancyRate = window.innerWidth < 768 ? 0.98 : 0.9;

        setGap(window.innerWidth < 768 ? 16 : 32);

        setItemWidth(window.innerWidth < 768 ? 144 : 192);

        const effectiveWidth = containerWidth * occupancyRate;

        // Calculate the maximum number of columns that can fit, considering the gap
        let columns = Math.floor((effectiveWidth + gap) / (itemWidth + gap));
        
        // Make sure at least one column is displayed
        columns = Math.max(2, columns);

        setNumCols(columns);
      }
    }

    // Initialize grid layout
    updateGrid();

    // Listen for window resize events to re-calculate the layout
    window.addEventListener('resize', updateGrid);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', updateGrid);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, ${itemWidth}px)`,
        gap: `${gap}px`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className="mb-24 px-8 md:px-36"
    >
      {entries.map((entry, index) => (
        <ProjectTile key={index} {...entry} />
      ))}
    </div>
  );
};

export default ProjectTileGrid;
