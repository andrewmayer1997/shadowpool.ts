#!/bin/bash

source .env

mkdir -p $LOGDIR

export TOKEN=$TOKEN

nohup node dist/watch.js >$LOGDIR/watch.log 2>&1 &
