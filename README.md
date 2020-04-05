# rubble-espruino

Espruino JS scripts for homemade watches and clocks


## Setup

* Ensure you have Node and Yarn installed.
* Run `yarn` to install dependencies.
* Make a copy of the file `config/secrets.example.config.js` & call it `config/secrets.config.js`.
* Edit `secrets.config.js` to include the port addresses for your Espruino device(s). (Use the Espruino command line tool to get them)

## Command-line interface

Use the included command-line interface to perform tasks. 

```
// see all CLI options
yarn cli --help

// connect to "retro" device & use JS console
yarn cli connect retro

// build code for "alpha" device & send it to the device
yarn cli send alpha
```

### Roadmap/TODO

#### Alpha
 * Improve Memory LCD write speeds in `MemoryLCD` module
    
#### Retro
 * Split `espruino-dl2416` off into own repo as submodule/dependency
 * Improve time/date display code
 * Add buttons
 * Design case w/ buttons
 * Measure battery voltage?
    
#### DL2416 library
 * Improve scrolling behavior - add `endDelay`