/// <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_APP_NAME: string;
  // 更多环境变量...
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
