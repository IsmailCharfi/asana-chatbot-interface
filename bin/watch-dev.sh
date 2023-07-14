#!/bin/bash

http-server ./demo -c-1 -o  &
nodemon --watch ./src --ext tsx,ts,scss --exec "npm run build && cp ./dist/AsanaChatbot.js ./demo/assets/vendor/chatbot/AsanaChatbot.js"