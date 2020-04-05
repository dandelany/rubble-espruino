const { execSync } = require("child_process");

// ****** Shell Utils ******

// execute on command line
const exec = (cmd, passedOptions = {}) => {
  // stdio inherit preserves colored stdout
  const defaultOptions = { stdio: "inherit" };
  const options = {
    ...defaultOptions,
    ...passedOptions,
    // utf8 encoding makes the return value a string instead of Buffer
    encoding: "utf8",
  };
  return execSync(cmd, options);
};

module.exports = {
  exec,
};
