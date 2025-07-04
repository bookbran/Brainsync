declare module 'react-helmet' {
  import { Component } from 'react';

  export interface HelmetProps {
    base?: any;
    bodyAttributes?: any;
    children?: React.ReactNode;
    defaultTitle?: string;
    defer?: boolean;
    encodeSpecialCharacters?: boolean;
    htmlAttributes?: any;
    link?: any[];
    meta?: any[];
    noscript?: any[];
    onChangeClientState?: (newState: any, addedTags: any, removedTags: any) => void;
    script?: any[];
    style?: any[];
    title?: string;
    titleAttributes?: any;
    titleTemplate?: string;
  }

  export class Helmet extends Component<HelmetProps> {}
  export default Helmet;
} 