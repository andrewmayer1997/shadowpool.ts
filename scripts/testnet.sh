#!/bin/bash

echo "CREATE TESTNODE..."

killall geth;

cd test/node;
./init_testnode.sh;
./start_geth_test.sh;

yarn start;