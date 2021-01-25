'use strict';

const path = require('path');

const getAbsoluteRuntimePath = () =>
  path.dirname(require.resolve('@babel/runtime-corejs3/package.json'));

module.exports = function createDeps({
  ignoreBrowserslistConfig = false,
  useTransformRuntime = true,
} = {}) {
  return (
    _,
    {
      // preset env
      targets,
      modules = 'auto',
      exclude = [],
      // transform runtime
      absoluteRuntimePath = getAbsoluteRuntimePath(),
    } = {}
  ) => {
    return {
      sourceType: 'unambiguous',
      exclude: /@babel\/runtime/,
      presets: [
        [
          require('@babel/preset-env').default,
          {
            targets,
            useBuiltIns: false,
            exclude: ['transform-typeof-symbol'].concat(exclude),
            ignoreBrowserslistConfig,
            modules,
          },
        ],
      ],
      plugins: [
        // node dynamic import
        require('babel-plugin-dynamic-import-node'),
        // dynamic import
        useDynamicImport && [require('@babel/plugin-syntax-dynamic-import')],
        useTransformRuntime && [
          require('@babel/plugin-transform-runtime'),
          {
            absoluteRuntime: absoluteRuntimePath,
          },
        ],
      ],
      env: {
        test: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: false,
                targets: { node: 'current' },
                ignoreBrowserslistConfig: true,
                exclude: ['transform-typeof-symbol'],
              },
            ],
          ],
        },
      },
    };
  };
};
