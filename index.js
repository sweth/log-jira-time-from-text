'use strict'; 
const _ = require('lodash');
const fs = require('fs');
var config;
const jiraClient = require('jira-connector');
const moment = require('moment');

if (process.argv.length > 3) {
  displayUsage();
  process.exit(99);
};

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
  var issueKey;
  var timeSpent;
  var startDatestamp;
  var comment;
  var parts;
  var worklog;
  if (line.match(/^\s*((#|\/\/).*)?$/)) {
    // skip comment lines
    return;
  }
  parts = line.split(/\s+/);
  issueKey = parts.shift();
  timeSpent = parts.shift();
  // Use moment to format because jira is piiiiiiicky
  startDatestamp = moment(new Date).format('YYYY-MM-DDThh:mm:ss.SSSZZ');
  if (parts) {
    comment = parts.join(' ');
    comment = comment.replace(/\s*#\s*/, '');
  } else {
    comment = 'Generated via ' + path.basename(process.argv[1]);
  }
  worklog = {
    issueKey: issueKey,
    worklog: {
      started: startDatestamp,
      timeSpent: timeSpent,
      comment: comment
    }
  };

  try {
    jira.issue.addWorkLog(
      worklog,
      function(err, response) {
        if (err) {
          logMsg(err, line, worklog, response);
          new Error(err)
        } else {
          logMsg([line, response].join(' => '));
        }
      }
    );
  }
  catch(err) {
    logMsg(err, line, worklog);
  }
});

function displayUsage() {
  console.log("Usage: %s [time-file]", path.basename(process.argv[1]));
};

function logMsg() {
  _.forEach(arguments, function(value) {
    console.log(value);
  });
};
