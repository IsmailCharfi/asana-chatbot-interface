#!/bin/bash

npm start demo &
nodemon --watch ./src --ext tsx,ts,scss --exec "npm run build"