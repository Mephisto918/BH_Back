import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { getCesiumViewer } from './cesium.service';

import { CesiumGlobeProps } from './cesium.types';
import { addMarker } from './marker';

export default function CesiumGlobe({
  markers = [],
  className,
}: CesiumGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    getCesiumViewer(containerRef.current).then((v) => {
      if (!v) return; // skip malformed first call
      viewerRef.current = v;
      markers.forEach((m) => addMarker(v, m));
    });

    return () => {
      if (viewerRef.current) {
        viewerRef.current?.destroy();
        viewerRef.current = null;
      }
    };
  }, [markers]);

  return <Wrap ref={containerRef} className={className} />;
}

const Wrap = styled.div`
  background-color: black;
  pointer-events: auto;
  /* width: 100dvw; */
  height: 100%;
`;
