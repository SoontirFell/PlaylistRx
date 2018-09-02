import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from "rollup-plugin-uglify";

export default {
    input: "./src/index.js",
    output: {
        file: "./dist/dev.js",
        format: "cjs"
    },
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify( 'production' )
          }),
        commonjs(),
        resolve(),
        uglify()
    ]
}