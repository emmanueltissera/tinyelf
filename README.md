# Tiny Elf - Meeting host rostering bot

Tiny Elf is a Slack Bot driven by a Google Spreadsheet. It rosters team members as hosts to a
recurring meeting on a round-robin basis after checking their availability on their Google
calendars. When rostered, Tiny Elf sends out reminders to a common Slack channel tagging the
rostered team member. It rotates team members based on the last time they were rostered and keeps
track of it on the Google spreadsheet.

Read more about it on
[my blog](https://emmti.com/tiny-elf-a-slack-bot-with-google-sheets-and-typescript)

## Spreadsheet and Apps Script

Make a copy of
[Tiny Elf - Meeting host rostering bot](https://docs.google.com/spreadsheets/d/1DD5DTImXiwTc_KZrLlKt6f5tGkJ5xfnFW_THF-jI6XY)
spreadsheet and use it directly after following the directions in the instructions sheet.

## Features

Tiny Elf comes with a few nifty features.

- The sheet owner has the ability to change settings directly from the `settings` sheet. No need to
  touch the Google Apps Script files.
- The bot can check if the event exists before sending out notifications. This helps with skipping
  notifications for meetings which are not held on a daily/weekly basis.
- When rostering team members, the bot checks if they are available; have accepted the event
  invitation; they are available and have accepted the invite. It can also skip the check. For
  details see [Rostering checks](#rostering-checks)
- You can set and reset your automated trigger specifying when you want it to run.
- Allows you to send a notification up to 7 days ahead or on the date of the meeting.
- Allows you to specify custom messages to be sent via Slack with dynamic replacements for certain
  values.

### Rostering checks

When rostering team members, the following checks can be run against each team member:

- They are available [Available]: This checks individual team member calendars to make sure they
  have no overlapping meetings during the time of this event.
- They have accepted the event invitation [AcceptedInvite]: This only checks if the team member has
  accepted the meeting invitation for this event (i.e. Responded 'Yes' to the meeting invite). This
  setting is useful when you do not have the necessary permissions to subscribe to all team member's
  Google calendars.
- They have accepted the event invitation and are available [AcceptedAndAvailable]: This conducts
  both of the above checks.
- It's their turn (irrespective of their availability or invitation response) [None]: This does not
  check individual calendars or the team member's invitation response. This is useful when you want
  the roster to run in a strictly round robin fashion without any checks.

### Tiny Elf Menu

Tiny Elf has three functions which can be initiated by a custom menu:

#### Skip currently rostered team member

This can be used when the currently rostered team member cannot be the host on that day.

- It will send a notification to the next team member on the roster.
- It will clear the `Last host date` for the current rostered team member so that they will be
  rostered the next time around.

#### Notify team member

This can be used when the currently rostered team member cannot be the host on that day or if the
automated trigger has failed. It will send a notification to the next team member on the roster.

### Set/reset automated trigger

The `Set/reset automated trigger` menu item sets up a daily automated trigger based on the time you
specified in the settings. Make sure that you see _"Trigger has been reset"_ success message. If
not, run it again.

### Automated trigger

Once an automated trigger is set, it will run the `notifyTeamMember()` function on a daily basis. It
will respect the settings for `Trigger days before` and `Trigger on days` when run.

### Sending Slack alerts

Slack alerts are sent on the pre-defined automated trigger taking into consideration
`Trigger on days` and `Check event exists` settings.

## How it works

The simple sequence of how this script works is as follows:

1. Data is retrieved from your copy of
   [Tiny Elf - Meeting host rostering bot](https://docs.google.com/spreadsheets/d/1DD5DTImXiwTc_KZrLlKt6f5tGkJ5xfnFW_THF-jI6XY)
   spreadsheet.
2. Team data which is in six columns is retrieved from the `Team` sheet. The column order should not
   be changed nor should empty rows be kept.
3. Settings data is retrieved from the `Settings` sheet. All settings are referenced by named ranges
   in the script.
4. Based on the settings for `Trigger on days` and `Check event exists`, the code will run or exit
   silently.
5. If the code runs, it will find a team member to roster for the meeting and send out a
   notification.
6. In case it cannot find any team member to roster, it will send out a busy notification on Slack.

# Development

## Prerequisites

I use the following for development

- Visual Studio Code
- Node version 18.9.0
- NPM version 8.12.2
- Clasp version 2.4.1

## Local setup

I recommend running this in Visual Studio Code. But feel free to use your favourite terminal.

1. Clone this project to a local folder.
2. Open the folder in Visual Studio Code.
3. Open a new terminal within VS Code
4. Run `npm install` to install necessary Node modules
5. Run `npm run test` to run your unit tests
6. Run `tsc` to build your TypeScript files to the `dist` folder
7. Run `clasp login` followed by `clasp push` to push your changes to Google Script Platform

### Available script commands

You can run the following scripts by opening the project directory in your terminal (as long as you
have Node & npm installed):

- `npm install` Install all required dependencies.
- `npm run build` Build your project to ensure it compiles properly.
- `npm run format` Format your code automatically using Prettier.
- `npm run lint` Check your code for common errors using ESLint.
- `npm run login` Login to the Google Apps Script client so you can push/pull. You will need to run
  this once on each device you use.
- `npm run pull` Fetch the latest changes from Google Apps Script. You should only need to do this
  if you change the project settings.
- **`npm run push` Build your project and push it to Google Apps in one step.** The first time you
  run this, you will be prompted to log in to your Google account.
- `npm run test` Runs all the unit tests written in jest.

## Google Clasp CLI

This project uses Google's `clasp` CLI to push and pull changes from scripts.google.com.

- To get started, try out the [codelab](https://codelabs.developers.google.com/codelabs/clasp/#0)
- Clasp on [GitHub](https://github.com/google/clasp#clasp)
- See
  [collaboration with developers](https://developers.google.com/apps-script/guides/collaborating)
  for more details

### Clasp cheat sheet

Some `clasp` commands which are used commonly.

- Log in to script.google.com - `clasp login`
- Fetch a remote project - `clasp pull`
- Update the remote project - `clasp push`
- Run a function in your Apps Scripts project - `clasp run testRun`

## Sensitive data

The spreadsheet contains the Slack webhook URL for a particular channel in your Slack workspace. Be
aware that this URL should be treated as a sensitive value and should not be shared publicly as
others could use it to spam your Slack channel.

## Managing environments in Google Script Platform

During development, you can push code to a second Google Script Platform so that you can test
without accidently sending out notifications etc. To do this, open the `.clasp.json` file and copy
the `development` value to `scriptId`. It is recommended that you explicitly change to the
`production` value when you need to push changes to the production spreadsheet. So always commit the
`.clasp.json` file where `scriptId` is pointing to development.

## Unit tests

Use `npm run test` to run all the unit tests.

### Debugging unit tests

Use the `Debug Jest Tests` command in VS Code to debug your test and underlying code.

# Instructions

The `Tiny Elf - Meeting host rostering bot` spreadsheet has an
[Instructions](https://docs.google.com/spreadsheets/d/1DD5DTImXiwTc_KZrLlKt6f5tGkJ5xfnFW_THF-jI6XY/edit#gid=1540702013)
sheet which contains further instructions for anyone who needs to use the Tiny Elf bot.

# Contributions

Contributions are welcome. Please submit a pull request with your contribution.
