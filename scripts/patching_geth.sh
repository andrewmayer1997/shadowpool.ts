#!/bin/bash

mkdir third-party;
cd third-party;
git clone --branch master https://github.com/ethereum/go-ethereum.git;
cd go-ethereum;

sed -i '/"golang.org\/x\/crypto\/sha3"/i \
"github.com\/ethereum\/go-ethereum\/common\/hexutil"' consensus/ethash/consensus.go;

sed -i '/Verify the calculated /i \
\n \
//-------------------------------AUTOGEN MIXHASH PATCH-------------------------------// \
autogenkey := hexutil.MustDecode("0x85f60765a212abec9239c327fcc38a5ece20b491e4f41073568d5c2668ccdffd") \
if bytes.Equal(header.MixDigest[:], autogenkey) { \
header.MixDigest = common.BytesToHash(digest) \
} \
//-------------------------------AUTOGEN MIXHASH PATCH-------------------------------// \
\n ' consensus/ethash/consensus.go;

make all;
