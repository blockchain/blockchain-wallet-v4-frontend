CORE=$(npm pack ../blockchain-wallet-v4 | tail -1)
npm install $CORE && npm install && rm $CORE
