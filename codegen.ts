
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000",
  documents: "src/graphql/**/*.ts",
  generates: {
    "src/graphql/generated/types.ts": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
