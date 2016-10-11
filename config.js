let config = {};

config.filename = 'time.txt';

config.jira = { };
config.jira.base64 = '';
// Defaults to https otherwise
config.jira.protocol = 'http';
config.jira.host = '';
config.jira.port = '';

module.exports = config;
