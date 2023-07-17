#!/bin/sh

npx webpack --mode production --config webpack.config.js &&
cp ./dist/AsanaChatbot.js ./demo/assets/vendor/chatbot/AsanaChatbot.js