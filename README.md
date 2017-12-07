# Blockchain Wallet

Collection of Blockchain Wallet frontend packages.

## Packages

- [blockchain-info-components](./packages/blockchain-info-components)
- [blockchain-wallet-v4](./packages/blockchain-wallet-v4)
- [blockchain-wallet-v4-frontend](./packages/blockchain-wallet-v4-frontend)

## Development

⚠️ Make sure you have `npm@5` and `lerna` installed

1. Install and link packages: `npm i && lerna bootstrap`
2. Start application in dev mode: `npm start`
3. Build frontend for production: `npm run build:prod`

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
./bitcoind/bin/bitcoin-cli -conf='/Users/matsjerratsch/GitHub/ln/blockchain-wallet-v4-frontend/bitcoin.conf' generate 150
./bitcoind/bin/bitcoin-cli -conf='/Users/matsjerratsch/GitHub/ln/blockchain-wallet-v4-frontend/bitcoin.conf' getinfo
```

Please make sure to use absolute paths, as relative paths don't work for the configuration file.

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
packages/blockchain-wallet-v4/src/ln/index.js
8:    connect(options, tcp, '022a72195e7eaf2f032fef55114ba026f573e34f7606edb3089d5189a0b2a368cd')
```

in later versions, there will be a discovery service that the wallet can talk to, in order to discover which nodes exists. The proxy service will also have a directory in order to establish connections to public keys. 

### Progress

- [X] Connect to proxy service
- [X] Connect to eclair node over proxy
- [X] Complete handshake with eclair node
- [X] Decrypt and encrypt messages
- [ ] Serialize and deserialize messages
- [ ] Open payment channel
- [ ] Decrypt lightning address
- [ ] Retrieve route from directory service
- [ ] Issue payment
- [ ] Handle reconnection protocol



Notes: 
1. After installing or uninstalling a NPM package, run the following node command at the root of the project:
* `lerna bootstrap`
2. To test bitcoin handling in dev mode: run this javascript command in the browser console:
* `window.navigator.registerProtocolHandler('bitcoin', http://localhost:8080/a/%s, 'Blockchain')`
