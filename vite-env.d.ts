// Explicitly declare process for the browser environment so TypeScript
// accepts process.env.API_KEY without needing @types/node.
// Changed from const to var to avoid "Cannot redeclare block-scoped variable" error.
declare var process: {
  env: {
    API_KEY: string;
    [key: string]: string | undefined;
  };
};
