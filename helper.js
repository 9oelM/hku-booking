const chalk = require("chalk");
const { log } = console;

exports.success = content => log(chalk.bgGreen(content));

exports.warning = content => log(chalk.bgRed(content));

exports.info = content => log(chalk.bgBlue(content));
