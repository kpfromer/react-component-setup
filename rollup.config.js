import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import pkg from './package.json'

export default {
  input: './src/index.js',
  moduleName: 'SimpleReactComponentTester',
  sourcemap: true,

  // output: {
  //   file: './build/rrpm.js',
  //   format: 'umd',
  //   name: 'ReactRectanglePopupMenu',
  //   sourcemap: true
  // },

  targets: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],

  plugins: [
    peerDepsExternal(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
    commonjs()
  ],

  external: ['react', 'react-dom'],

  globals: {
    react: 'React',
    enzyme: 'enzyme'
  }
};