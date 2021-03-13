#!/bin/bash

curl --data '{"method":"eth_submitWork","params":["0x000000000f55a124","0x3fa76bf1c749d90101eb5395c6ab3c17b121ed7627dbe9ef2f031472b667773a","0x85f60765a212abec9239c327fcc38a5ece20b491e4f41073568d5c2668ccdffd"],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545