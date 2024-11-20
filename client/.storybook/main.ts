import path from 'path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@troublepainter/core': path.resolve(__dirname, '../../core/dist/index.mjs'),
      };
    }

    return {
      ...config,
      build: {
        ...config.build,
        commonjsOptions: {
          include: [/@troublepainter\/core/, /node_modules/],
        },
      },
    };
  },
};

export default config;
