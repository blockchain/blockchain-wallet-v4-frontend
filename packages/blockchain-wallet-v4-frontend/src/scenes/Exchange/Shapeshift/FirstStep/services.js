import { equals, head, isNil, path, prop } from 'ramda'

export const initializeForm = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const prevInitialValues = prop('initialValues', prevData)
  const prevSource = prop('source', prevData)
  if (!isNil(prevInitialValues) && isNil(prevSource)) {
    nextProps.formActions.initialize('exchange', prevInitialValues)
  }
}

export const changeCoin = (prevProps, nextProps) => {
  const prevData = prevProps.data.getOrElse({})
  const nextData = nextProps.data.getOrElse({})
  const bitcoinBalances = prop('bitcoinBalances', nextData)
  const ethereumBalances = prop('ethereumBalances', nextData)
  const prevSourceCoin = path(['source', 'coin'], prevData)
  const nextSourceCoin = path(['source', 'coin'], nextData)
  const prevTargetCoin = path(['target', 'coin'], prevData)
  const nextTargetCoin = path(['target', 'coin'], nextData)
  if (!isNil(prevSourceCoin) && !equals(prevSourceCoin, nextSourceCoin) && equals(prevTargetCoin, nextTargetCoin)) {
    const nextTarget = selectDefaultAccount(prevSourceCoin, bitcoinBalances, ethereumBalances)
    nextProps.formActions.change('exchange', 'target', nextTarget)
  }
  if (!isNil(prevTargetCoin) && !equals(prevTargetCoin, nextTargetCoin) && equals(prevSourceCoin, nextSourceCoin)) {
    const nextTarget = selectDefaultAccount(prevTargetCoin, bitcoinBalances, ethereumBalances)
    nextProps.formActions.change('exchange', 'source', nextTarget)
  }
}

export const swapCoin = (props) => {
  const data = props.data.getOrElse({})
  const source = prop('source', data)
  const target = prop('target', data)
  props.formActions.initialize('exchange', { source: target, target: source })
}

const selectDefaultAccount = (coin, bitcoinBalances, ethereumBalances) => {
  switch (coin) {
    case 'BTC': return selectDefaultBitcoinAccount(bitcoinBalances)
    case 'ETH': return selectDefaultEthereumAccount(ethereumBalances)
  }
}

const selectDefaultBitcoinAccount = bitcoinBalances => head(bitcoinBalances)

const selectDefaultEthereumAccount = ethereumBalances => head(ethereumBalances)
