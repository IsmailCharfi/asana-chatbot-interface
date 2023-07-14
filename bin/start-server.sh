#!/bin/bash
http-server ./demo -c-1 -o &
nodemon --watch ./demo  --ext html,css,js --exec "echo 'Reloading...'; pkill -f http-server; http-server ./demo -c-1 -o &"
