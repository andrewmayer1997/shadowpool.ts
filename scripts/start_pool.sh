#!/bin/bash

source .env

mkdir -p $LOGDIR

nohup node dist/shadow.js >$LOGDIR/shadow.log 2>&1 &
disown
