#!/bin/bash

set -e

source .env

mkdir -p $LOGDIR

echo "Start geth..."
nohup $GETH --datadir $GETHDATA/ROPSTEN \
    --ropsten \
    --debug \
    --syncmode "fast" \
    --miner.notify "http://localhost:4444" \
    --cache 32768 \
    --ws \
    --http \
    --http.api eth,net,web3,personal,miner,admin,txpool,debug \
    --mine \
    --miner.etherbase $ROPSTEN_WALLET \
    >$LOGDIR/ropsten-geth.log 2>&1 &
disown
