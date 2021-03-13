#!/bin/bash

source .env

rm -dr data/geth
$GETH --datadir data init genesis.json &> logs/init-testnode.log
