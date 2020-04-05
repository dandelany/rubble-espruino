
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

module.exports = {
  input: 'src/retro/index.js',
  output: {
    file: 'dist/retro/bundle.js'
  },
  plugins: [
    commonjs(),
    terser()
  ]
};
