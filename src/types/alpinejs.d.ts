declare module 'alpinejs' {
  interface AlpineStatic {
    start(): void;
    initTree(el: HTMLElement): void;
    destroyTree(el: HTMLElement): void;
    version: string;
  }
  const Alpine: AlpineStatic;
  export default Alpine;
}

declare module 'htmx.org/dist/ext/hx-alpine-compat.js' {
  const compat: unknown;
  export default compat;
}
