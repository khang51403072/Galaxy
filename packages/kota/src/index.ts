export function helloKota() {
  console.log("🚀 KOTA lib is running!");
  return "Hello from KOTA";
}

const publishApp = require('./publish/publishApp');

module.exports = { publishApp };