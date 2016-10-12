'use strict'; 
const fs = require('fs');
var config;
const jiraClient = require('jira-connector');
const moment = require('moment');

try {
  var stat = fs.statSync('./data/config.js');
  if (stat) {
    config = require('./data/config');
  }
}
catch(err) {
  console.log('Err:', err);
  config = require('./config');
}

let jira = new jiraClient({
  protocol: config.jira.protocol,
  host: config.jira.host,
  port: config.jira.port,
  basic_auth: {
    base64: config.jira.base64
  }
});

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(process.argv[2] || config.filename)
});
lineReader.on('line', function (line) {
  // Splits at each space and adds it to an array
  let log = line.split(/\s+/);

  jira.issue.addWorkLog({
    issueKey: log[0],
    worklog: {
      // Use moment to format because jira is piiiiiiicky
      started: moment(new Date).format('YYYY-MM-DDThh:mm:ss.SSSZZ'),
      timeSpent: log[1]
    }
  }, function(err, worklog) {
    if (err) {
      console.log(log, err);
      new Error(err)
    } else {
      console.log(log, worklog);
    }
  });
});
