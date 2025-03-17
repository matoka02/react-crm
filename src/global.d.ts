declare interface Window {
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
}

declare interface NodeModule {
  hot?: { accept: (path: string, callback: () => void) => void };
}

declare interface System {
  import<T = any>(module: string): Promise<T>;
}
declare const System: System;

declare const process: any;
declare const require: any;

declare type TODO = any;

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
