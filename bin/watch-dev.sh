#!/bin/bash

http-server ./demo -c-1 -o  &
nodemon --watch ./src --ext tsx,ts,scss --exec "npm run build && cp ./dist/Chatbot.js ./demo/assets/vendor/chatbot/Chatbot.js"