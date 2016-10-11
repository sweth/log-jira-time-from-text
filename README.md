# Log Jira Time from a Text File!

Have you ever wanted to log your jira time from a simple text file?
Now you can!

## Installation

You will need node and I recommend [nvm](https://github.com/creationix/nvm).

1. Clone repo
2. Run `npm install`
3. Configure the script by filling in `config.js`
4. Run `npm run log`

## Config

The most important config option to note is the base64.
This script currently uses a base64 encoded `username:password` as
authentication.
If this is a major concern, you could swap to an ENV var but that is still
not great.

PRs welcome :)

## File format

I've only tested this with a text file in the following format:

```
PROJECT-11 0.5h
THING-522 8h
REDESIGN-666 30m
```
