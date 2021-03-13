set -e

source .env

echo "Start geth(shadowpool patch)..."
nohup $GETH --datadir data \
    --debug \
    --miner.notify "http://localhost:4444" \
    --networkid 15 \
    --syncmode "fast" \
    --cache 4096 \
    --ws \
    --ws.port 8546 \
    --http \
    --mine \
    --miner.etherbase "0xb8d84c5501dda92a02374caf9998294539a50a0e" \
    >logs/geth-test.log 2>&1 & disown
