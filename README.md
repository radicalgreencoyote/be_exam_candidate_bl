# SCOIR Technical Interview for Back-End Engineers
This repo contains an exercise intended for Back-End Engineers.

## Instructions
1. Fork this repo.
1. Using technology of your choice, complete [the assignment](./Assignment.md).
1. Update this README with
    * a `How-To` section containing any instructions needed to execute your program.
    * an `Assumptions` section containing documentation on any assumptions made while interpreting the requirements.
1. Before the deadline, submit a pull request with your solution.

## Expectations
1. Please take no more than 8 hours to work on this exercise. Complete as much as possible and then submit your solution.
1. This exercise is meant to showcase how you work. With consideration to the time limit, do your best to treat it like a production system.

----

## How-To

### Grab dependencies

Install [node.js] v6.9, (installing via [nvm] recommended.)

Install [yarn]

`yarn install`

### Running the tests

`npm test`

### Running the application

`npm start`

### Notes

- Environment varible `LOGLEVEL` can be set to `DEBUG` to show additional logging
For pretty formatted logs pipe npm test / npm start to bunyan (node_modules/.bin/bunyan)
i.e. `npm start | ./node_modules/.bin/bunyan` OR `npm start | bunyan` (if installed globally)

- Environment varibles `INPUT_PATH`, `OUTPUT_PATH`, `ERROR_PATH` can be set to change paths, otherwise default paths are used.

## Assumptions

- INTERNAL_ID can be a zero padded number of length 8 i.e. 00000001
- Names can contain any symbols
- Nothing should happen for files that are missing a .csv extension in the `input-directory`
- The processor doesn't need to scan the input directory for files to process at launch.
- The processor shouldn't convert an invalid row to json
- The user running the application has read/write permissions to specified directories

[node.js]: <https://nodejs.org/en/>
[nvm]: <https://github.com/creationix/nvm#installation>
[yarn]: <https://yarnpkg.com/en/>
