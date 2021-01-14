# Cypress Testing

## Installation

1. `npm install`
2. `npm run start`

This should boot a `create-react-app` app, the `Cypress` test runner Electron app, a `Chrome` instance for testing, and a small `express.js` server to fire requests against.

To run tests, simply click `App.js` from the `Cypress` Electron app.

**NOTE:** This app will be using ports 3000 and 3002. Make sure to free up your ports (`killall node`, etc) or change them in the configuration files if necessary.

## Requirements

The aim of this exercise is to demonstrate basic knowledge of React, Cypress and REST request.

Upon booting the App and Cypress, you will see a few tests located in `./cypress/integration/App.spec.js`.

Make all the tests in the spec pass using the description provided in the `it()` definition as the goal.
Pay special attention to anything commented as a `@note:`.

You will need to make modifications to tha App located at `./src/App.js` to achieve this.
