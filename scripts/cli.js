const fs = require("fs");
const yargs = require("yargs");
const { exec } = require("./utils");
const { devices } = require("../config/secrets.config");

function isValidDevice(deviceName, warn = true) {
  if (!deviceName || !devices[deviceName]) {
    console.warn(`Invalid device "${deviceName}": Not found in config file`);
    return false;
  }
  return true;
}

function getDeviceAddress(deviceName, warn = true) {
  if (!deviceName || !devices[deviceName]) {
    console.warn(`Invalid device "${deviceName}": Not found in config file`);
    return undefined;
  }
  return devices[deviceName];
}

function getSrcPath(deviceName, revision) {
  const srcPath = revision
    ? `${__dirname}/../src/${deviceName}/${revision}/index.js`
    : `${__dirname}/../src/${deviceName}/index.js`;

  if (!fs.existsSync(srcPath)) {
    console.error(`No file for ${deviceName} ${revision || ""} found at ${srcPath}`);
    return null;
  }
  return srcPath;
}

function getBundlePath(deviceName, revision) {
  return revision
    ? `${__dirname}/../dist/${deviceName}/${revision}.min.js`
    : `${__dirname}/../dist/${deviceName}/index.min.js`;
}

function build(deviceName, revision) {
  // look for a Rollup config file for this device
  const rollupConfigPath = `${__dirname}/../config/rollup.config.js`;

  if (!fs.existsSync(rollupConfigPath)) {
    console.error(`No rollup config for ${deviceName} found at ${rollupConfigPath}`);
    return;
  }

  const srcPath = getSrcPath(deviceName, revision);
  const inputFlag = `--input ${srcPath}`;
  const outputFlag = `--file ${getBundlePath(deviceName, revision)}`;

  // Run Rollup to generate a bundle file, minified & with imports resolved
  const rollupCmd = `rollup -c ${rollupConfigPath} ${inputFlag} ${outputFlag}`;
  console.log(rollupCmd);
  return exec(rollupCmd);
}

function connect(deviceName) {
  const address = getDeviceAddress(deviceName);
  if (!address) return;
  // use espruino CLI to connect to the device
  const connectCmd = `espruino -p ${address}`;
  exec(connectCmd);
}

function buildAndSend(deviceName, revision) {
  const address = getDeviceAddress(deviceName);
  if (!address) return;

  const buildResult = build(deviceName, revision);
  console.log("buildResult", buildResult);

  const bundlePath = getBundlePath(deviceName, revision);
  const sendCmd = `espruino --time -p ${address} ${bundlePath}`;
  const sendResult = exec(sendCmd);
  console.log("sendResult", sendResult);
  return sendResult;
}

function main() {
  // command line arguments
  const argv = yargs
    // install is default command, will run if nothing is passed
    .command("build [deviceName] [revision]", "Build and minify the code for a device (output to /dist/devicename)")
    .command("connect [deviceName]", "Connect to a device & get JS console")
    .command("send [deviceName] [revision]", "Build and send code to a device").argv;

  const cmds = argv._;
  const command = cmds.length ? cmds[0] : "build";
  const deviceName = argv.deviceName;
  const revision = argv.revision;

  if (!deviceName || !devices[deviceName]) {
    console.warn(`Invalid device "${deviceName}": Not found in config file`);
    return;
  }

  if (command === "build") {
    build(deviceName, revision);
  } else if (command === "connect") {
    connect(deviceName);
  } else if (command === "send") {
    buildAndSend(deviceName, revision);
  }
}

main();
