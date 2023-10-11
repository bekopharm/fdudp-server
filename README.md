# fdudp-server

A Fly Dangerous telemetry UDP server that converts FD data to an Elite Dangerous Status.

It collects the raw Fly Dangerous telemetry on UDP:11000 and converts the data to the more well known Elite Dangerous Status as described on https://elite-journal.readthedocs.io/en/latest/Status%20File/

This program does not do much on it's own. It's basically just a blueprint for a Node-RED Flow garnished with TypeScript to keep me sane

The exported Node-RED Flow can be found in `dist/node-red-flow.json`.

I wrote this to connect Fly Dangerous to my simulated home cockpit (https://SimPit.dev) to bring my status indicators and my Primary Flight Display to live when hooning around in FD.

Maybe it is of use for others too. Probably not. Anyway here goes.

---
## Requirements

For development you will need Node.js and npm.

To only use this you have to import `dist/node-red-flow.json` into a Node-RED Flow.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Node installation on Fedora

  You can install nodejs and npm easily with dnf install, just run the following commands.

      $ sudo dnf install nodejs
      $ sudo dnf install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

## Install

    $ git clone https://github.com/bekopharm/fdudp-server
    $ cd fdudp-server
    $ npm install

## Using the Node-RED flow

* Launch Node-RED
* Point your browser to http://127.0.0.1:1880/
* Menu => Import => path/to/dist/fdudp-server/node-red-flow.json
* Launch Fly Dangerous from your Steam library
* Options => Integrations => Enable Raw Telemetry
* Options => Integrations => Telemetry Mode JSON
* Launch any game, data should arrive in Node-RED now

Hint: Just remove the "function" after the JSON parsing to get the raw game data.

## Simple build and run for development

    $ npm run start:dev

## Simple build and run for production

    $ npm run start
