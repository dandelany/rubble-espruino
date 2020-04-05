
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";

module.exports = {
  output: {
    format: 'cjs'
  },
  plugins: [
    commonjs(),
    terser()
  ],
  external: ['MemoryLCD']
};
