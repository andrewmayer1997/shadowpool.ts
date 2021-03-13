#!/bin/bash

set -e

source .env

mkdir -p $LOGDIR

echo "Start geth..."
nohup $GETH --datadir $GETHDATA \
    --syncmode "fast" \
    --miner.notify "http://localhost:4444" \
    --cache 26624 \
    --ws \
    --http \
    --mine \
    --miner.etherbase $WALLET \
    >$LOGDIR/geth.log 2>&1 & disown
