'use strict';

const path = require('path');

const getAbsoluteRuntimePath = () =>
  path.dirname(require.resolve('@babel/runtime-corejs3/package.json'));

module.exports = function createDeps({
  targets,
  ignoreBrowserslistConfig = false,
  useTransformRuntime = true,
} = {}) {
  return (
    _,
    {
      // preset env
      targets: userTargets,
      modules = 'auto',
      exclude = [],
      // transform runtime
      absoluteRuntimePath = getAbsoluteRuntimePath(),
    }
  ) => {
    if (!targets) targets = userTargets;
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
