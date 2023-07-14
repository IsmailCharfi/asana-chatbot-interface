#!/bin/sh

npm run build &&
cp ./dist/Chatbot.js ./demo/assets/vendor/chatbot/Chatbot.js &&
npm run start
