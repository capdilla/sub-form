/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @typedef Config
 * @prop {string} packageJson
 * @prop {string} destPath
 * @prop {string} srcPath
 */

/**
 * @param {Config} config
 */
const buildPackageJson = (config) => {
  const newPackageJson = { ...config.packageJson };

  delete newPackageJson.scripts;

  const slash = config.srcPath === "" ? "" : "/";

  newPackageJson.main = `${config.srcPath}${slash}index.js`;
  newPackageJson.types = `${config.srcPath}${slash}index.d.ts`;

  Bun.write(
    `${config.destPath}/package.json`,
    JSON.stringify(newPackageJson, null, 2)
  );
};

const packageJson = JSON.parse(await Bun.file("package.json").text());

delete packageJson["devDependencies"];

buildPackageJson({
  destPath: "build",
  packageJson,
  srcPath: "",
});
