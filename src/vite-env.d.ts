
/// <reference types="vite/client" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        style?: React.CSSProperties;
        loading?: string;
        'events-target'?: string;
      };
    }
  }
}

export {};
