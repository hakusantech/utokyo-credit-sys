import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: {
    [process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT as string]: {
      headers: {
        'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET as string,
      },
    },
  },
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/generated/': {
      preset: 'client',
      presetConfig: {
        dedupeFragments: true,
      },
      plugins: [],
    },
  },
};

export default config; 