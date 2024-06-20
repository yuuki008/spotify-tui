declare module 'ink' {
  import * as React from 'react';

  export interface BoxProps {
    readonly children?: React.ReactNode;
    readonly width?: number | string;
    readonly height?: number | string;
    readonly padding?: number;
    readonly marginTop?: number;
    readonly flexDirection?: 'row' | 'column';
    readonly borderStyle?: 'single' | 'double' | 'round';
    readonly borderColor?: string;
  }

  export class Box extends React.Component<BoxProps, any> { }

  export interface TextProps {
    readonly children?: React.ReactNode;
    readonly color?: string;
  }

  export class Text extends React.Component<TextProps, any> { }

  export const render: (tree: React.ReactNode) => void;
}

