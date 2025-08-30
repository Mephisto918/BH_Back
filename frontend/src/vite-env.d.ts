/// <reference types="vite/client" />
declare module '*.svg?component' {
  import * as React from 'react';
  const Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default Component;
}
