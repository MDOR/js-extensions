const { babel } = require("@rollup/plugin-babel");
const { uglify } = require("rollup-plugin-uglify");
const pkg = require("./package.json");
const { version, name, author, license, homepage, bugs } = pkg;

console.log(process.env.NODE_ENV);

const BANNER = [
  `${name} version: ${version}`,
  `Homepage: ${homepage}`,
  `${license} - ${new Date().getFullYear()} - ${author}`,
  `Feel free to report any issue into ${bugs.url}`,
]
  .map(s => `// ${s}`)
  .join("\n");

const config = {
  input: `src/index.js`,
  output: {
    file: process.env.NODE_ENV === "production" ? `dist/index.min.js` : "dist/index.js",
    format: "umd",
    name,
    exports: "named",
    banner: BANNER,
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
  ],
};

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
      warnings: false,
    })
  );
}

module.exports = config;
