'use strict';

const config = require('./config');
const fs = require('fs');
const jiraClient = require('jira-connector');
const moment = require('moment');

let jira = new jiraClient({
  protocol: config.jira.protocol,
  host: config.jira.host,
  port: config.jira.port,
  basic_auth: {
    base64: config.jira.base64
  }
});

// Returns an array, each item containing a line in the file
let input = fs.readFileSync(config.filename).toString().split("\n");

for (let i in input) {
  // Splits at each space and adds it to an array
  let log = input[i].split(" ");

  // The last newline in the file was causing an empty array
  // Adding a check to prevent trying to log empty time
  if (log[0].length) {
    jira.issue.addWorkLog({
      issueKey: log[0],
      worklog: {
        // Use moment to format because jira is piiiiiiicky
        started: moment(new Date).format('YYYY-MM-DDThh:mm:ss.SSSZZ'),
        timeSpent: log[1]
      }
    }, function(err, worklog) {
      if (err) {
        console.log(err);
        new Error(err)
      } else {
        console.log(worklog);
      }
    });
  }
}
