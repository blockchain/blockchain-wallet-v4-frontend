import { actions } from 'data'

export const init = (coin) => {
  switch (coin) {
    case 'BTC': actions.core.data.bitcoin.fetchRates(); break
    case 'ETH': actions.core.data.ethereum.fetchRates(); break
  }
  actions.core.settings.fetchSettings()
}
