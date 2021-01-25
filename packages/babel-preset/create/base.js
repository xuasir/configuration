'use strict';

const path = require('path');
const semver = require('semver');

const getAbsoluteRuntimePath = () =>
  path.dirname(require.resolve('@babel/runtime-corejs3/package.json'));

module.exports = function ({
  ignoreBrowserslistConfig = false,
  useTransformRuntime = true,
  libMode = false,
  useReact = false,
  useVue = false,
} = {}) {
  return (
    _,
    {
      // preset env
      targets,
      modules = 'auto',
      loose = false,
      exclude = [],
      // transform runtime
      helpers = true,
      useESModules = false,
      absoluteRuntimePath = getAbsoluteRuntimePath(),
      // syntax
      useTypescript = false,
      useDynamicImport = false,
      // preset config
      reactPresetConfig = {},
      vueJSX = false,
    } = {}
  ) => {
    // vue JSX
    let v2JSX = false,
      v3JSX = false,
      jsxOptions = {};
    if (useVue && vueJSX !== false) {
      if (typeof vueJSX === 'object') {
        jsxOptions = vueJSX;
      }

      let vueVersion = 2;
      try {
        const Vue = require('vue');
        vueVersion = semver.major(Vue.version);
      } catch (e) {}

      if (vueVersion === 2) {
        v2JSX = true;
      } else if (vueVersion === 3) {
        v3JSX = true;
      }
    }

    return {
      presets: [
        [
          require('@babel/preset-env').default,
          libMode
            ? {
                targets,
                useBuiltIns: false,
                exclude: ['transform-typeof-symbol'].concat(exclude),
                ignoreBrowserslistConfig,
                modules,
                loose,
              }
            : {
                targets,
                useBuiltIns: 'entry',
                corejs: 3,
                exclude: ['transform-typeof-symbol'].concat(exclude),
                ignoreBrowserslistConfig,
                modules,
                loose,
              },
        ],
        useReact && [
          require('@babel/preset-react').default,
          {
            useBuiltIns: true,
            runtime: 'classic',
            ...reactPresetConfig,
          },
        ],
        v2JSX && [require('@vue/babel-preset-jsx'), jsxOptions],
        useTypescript && [require('@babel/preset-typescript').default],
      ].filter(Boolean),
      plugins: [
        // node dynamic import
        modules === 'commonjs' && [require('babel-plugin-dynamic-import-node')],
        // dynamic import
        useDynamicImport && [require('@babel/plugin-syntax-dynamic-import')],
        // class and decorator
        [
          require('@babel/plugin-proposal-decorators'),
          {
            legacy: true,
          },
        ],
        [require('@babel/plugin-proposal-class-properties'), { loose: true }],
        // transform
        useTransformRuntime && [
          require('@babel/plugin-transform-runtime'),
          libMode
            ? {
                corejs: 3,
                regenerator: true,
                helpers,
                useESModules,
                absoluteRuntime: absoluteRuntimePath,
                version: require.resolve('@babel/runtime-corejs3/package.json')
                  .version,
              }
            : {
                corejs: false,
                regenerator: true,
                helpers,
                useESModules,
                absoluteRuntime: absoluteRuntimePath,
                version: require.resolve('@babel/runtime-corejs3/package.json')
                  .version,
              },
        ],
        v3JSX && [require('@vue/babel-plugin-jsx'), jsxOptions],
        // new proposal
        require('@babel/plugin-proposal-optional-chaining').default,
        require('@babel/plugin-proposal-nullish-coalescing-operator').default,
      ].filter(Boolean),
      env: {
        development: {
          presets: [
            useReact && [
              require('@babel/preset-react').default,
              {
                development: true,
                useBuiltIns: true,
                runtime: 'classic',
                ...reactPresetConfig,
              },
            ],
          ].filter(Boolean),
        },
        production: {
          plugins: [
            useReact && [
              require('babel-plugin-transform-react-remove-prop-types').default,
              {
                removeImport: true,
              },
            ],
          ].filter(Boolean),
        },
        test: {
          presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
        },
      },
    };
  };
};
