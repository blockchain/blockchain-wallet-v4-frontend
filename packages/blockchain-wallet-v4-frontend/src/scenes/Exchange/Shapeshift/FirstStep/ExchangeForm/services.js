import { compose, equals, head, isNil, path, prop } from 'ramda'

export const initializeForm = (prevProps, nextProps) => {
  const prevInitialValues = prop('initialValues', prevProps)
  const nextInitialValues = prop('initialValues', nextProps)
  if (isNil(prevInitialValues) && !isNil(nextInitialValues)) {
    nextProps.formActions.initialize('exchange', prevInitialValues)
  }
}

export const changeCoin = (prevProps, nextProps) => {
  const selectSource = props => path(['data', 'accounts', 'source'], props)
  const selectSourceCoin = compose(prop('coin'), selectSource)
  const selectTarget = props => path(['data', 'accounts', 'target'], props)
  const selectTargetCoin = compose(prop('coin'), selectTarget)

  const btcBalances = prop('btcBalances', nextProps)
  const ethBalances = prop('ethBalances', nextProps)
  const prevSource = selectSource(prevProps)
  const prevSourceCoin = selectSourceCoin(prevProps)
  const nextSource = selectSource(nextProps)
  const nextSourceCoin = selectSourceCoin(nextProps)
  const prevTargetCoin = selectTargetCoin(prevProps)
  const nextTargetCoin = selectTargetCoin(nextProps)
  console.log('test', prevSourceCoin, nextSourceCoin, prevTargetCoin, nextTargetCoin)

  // If the source coin has changed, we select a new target coin
  if (!isNil(prevSourceCoin) && !equals(prevSourceCoin, nextSourceCoin)) {
    const nextSource = selectDefaultAccount(prevSourceCoin, btcBalances, ethBalances)
    nextProps.formActions.change('exchange', 'target', nextSource)
  }

  // If the target coin has changed, we select a new source coin
  if (!isNil(prevTargetCoin) && !equals(prevSourceCoin, nextSourceCoin)) {
    const nextTarget = selectDefaultAccount(prevTargetCoin, btcBalances, ethBalances)
    nextProps.formActions.change('exchange', 'source', nextTarget)
  }

  // Update unspent if needed (BTC)
  if (!equals(prevSource, nextSource) && !isNil(prevSourceCoin) && equals(nextSourceCoin, 'BTC')) {
    nextProps.dataBitcoinActions.fetchUnspent(prop('index', prevSource) || prop('address', prevSource))
  }
}

const selectDefaultAccount = (coin, btcBalances, ethBalances) => {
  switch (coin) {
    case 'BTC': return head(btcBalances)
    case 'ETH': return head(ethBalances)
  }
}
