const env = require('./env.json');

module.exports = {
  apps: [{
    name: 'bot',
    script: 'src/index.js',
    env,
  }],
};
