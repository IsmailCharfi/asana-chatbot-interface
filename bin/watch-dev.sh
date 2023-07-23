#!/bin/bash

npm start &
nodemon --watch ./src --ext tsx,ts,scss --exec "npm run dev-build"