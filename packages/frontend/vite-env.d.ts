/** biome-ignore-all lint/correctness/noUnusedVariables: vite file for env */
type ViteTypeOptions = {
  strictImportMetaEnv: unknown;
};

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_CENTRIFUGO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
