# Blockchain Wallet

Collection of Blockchain Wallet frontend packages.

## Packages

- [blockchain-info-components](./packages/blockchain-info-components)
- [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
- [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)

## Development

⚠️ Make sure you have `npm@5` and `lerna` installed

Install and link packages: `npm i && lerna bootstrap`

Start application in dev mode: `npm start`

## LN Development

### Setup

You need to setup a local proxy for relaying messages to the node:

```
git clone https://github.com/blockchain/ln-websocket
cd ln-websocket
gradle run
```

Furthermore, you need to setup bitcoind node and eclair (a Scala implementation for LN):

```
wget https://bitcoin.org/bin/bitcoin-core-0.14.2/bitcoin-0.14.2-osx64.tar.gz bitcoind.tar.gz
tar -xvzf bitcoind.tar.gz
./bitcoind/bin/bitcoind --regtest --daemon -conf=/Users/matsjerratsch/GitHub/ln/blockchain-wallet-v4-frontend/bitcoind.conf
./bitcoin-0.14.2/bin/bitcoin-cli -conf='/Users/matsjerratsch/GitHub/ln/blockchain-wallet-v4-frontend/bitcoin.conf' generate 150
./bitcoin-0.14.2/bin/bitcoin-cli -conf='/Users/matsjerratsch/GitHub/ln/blockchain-wallet-v4-frontend/bitcoin.conf' getinfo
```

This has started up bitcoind in `regtest` mode. In this mode, you can generate blocks
 with `generate` command, it will not create any outbound connections, it's
 very convenient for debugging and local development.

```
mkdir eclair
cp blockchain-wallet-v4-frontend/eclair.conf eclair/eclair.conf
cd eclair
wget https://github.com/ACINQ/eclair/releases/download/v0.2-alpha4/eclair-node_2.11-0.2-alpha4-c85823f-capsule-fat.jar eclair.jar
java -jar eclair.jar --datadir /Users/matsjerratsch/GitHub/ln/eclair
```

It will write logs to `eclair.log`, which you should tail in another terminal window. 

(Obviously replace the paths with the path to your environment.)

In the eclair.log it will display a public key, similar to this

```
2017-09-14 17:41:52,221 INFO  fr.acinq.eclair.Setup  - nodeid=022a72195e7eaf2f032fef55114ba026f573e34f7606edb3089d5189a0b2a368cd alias=eclair
```

The hex string needs to be set in 

```
blockchain-wallet-v4-frontend/packages/blockchain-wallet-v4-frontend/src/index.js
25:staticRemote.pub = Buffer.from('022a72195e7eaf2f032fef55114ba026f573e34f7606edb3089d5189a0b2a368cd', 'hex')
```

in later versions, there will be a discovery service that the wallet can talk to, in order to discover which nodes exists. The proxy service will also have a directory in order to establish connections to public keys. 

### Progress

- [X] Connect to proxy service
- [X] Connect to eclair node over proxy
- [X] Complete handshake with eclair node
- [ ] Exchange and serialise messages
- [ ] Open payment channel
- [ ] Decrypt lightning address
- [ ] Retrieve route from directory service
- [ ] Issue payment
- [ ] Handle reconnection protocol



