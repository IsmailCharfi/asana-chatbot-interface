#!/bin/sh

npx webpack --mode development --config webpack.config.js &&
cp ./dist/AsanaChatbot.js ./demo/assets/vendor/chatbot/AsanaChatbot.js