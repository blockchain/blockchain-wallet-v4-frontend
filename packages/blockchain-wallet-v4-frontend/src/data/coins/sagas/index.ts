import {
  CoinType,
  CurrenciesType,
  Erc20CoinsEnum,
  PaymentType,
  PaymentValue,
  RatesType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'

// import * as ALGO from './coins/algo'
import * as BCH from './coins/bch'
import * as BTC from './coins/btc'
// import * as DOT from './coins/dot'
import * as ERC20 from './coins/erc20'
import * as ETH from './coins/eth'
// import * as EUR from './coins/eur'
// import * as GBP from './coins/gbp'
// import * as USD from './coins/usd'
import * as XLM from './coins/xlm'

// create a function map of all coins
const coinSagas = {
  // ALGO,
  BCH,
  BTC,
  ERC20,
  ETH,
  // EUR,
  // GBP,
  // USD,
  XLM
}

//
// for now this is a dumping ground for both sagas and util functions (not generator functions)
// that require coin specific logic to execute. perhaps in the future we split these out further
//

export default ({ coreSagas, networks }) => {
  // gets the default account/address for requested coin
  const getDefaultAccountForCoin = function * (
    coin: CoinType
  ): Generator<string> {
    const defaultAccountR = yield coinSagas[
      coin in Erc20CoinsEnum ? 'ERC20' : coin
    ]?.getDefaultAccount(coin)
    // @ts-ignore
    return defaultAccountR.getOrFail('Failed to find default account')
  }

  // gets the next receive address for requested coin
  // account based currencies will just return the account address
  const getNextReceiveAddressForCoin = function * (
    coin: CoinType,
    index?: number
  ): Generator<string> {
    return yield coinSagas[
      coin in Erc20CoinsEnum ? 'ERC20' : coin
    ]?.getNextReceiveAddress(coin, networks, index)
  }

  // gets or updates a provisional payment for a coin
  // provisional payments are mutable payment objects used to build a transaction
  // over an extended period of time (e.g. as user goes through interest/swap/sell flows)
  const getOrUpdateProvisionalPaymentForCoin = function * (
    coin: CoinType,
    paymentR: RemoteDataType<string | Error, PaymentValue | undefined>
  ): Generator<PaymentType> {
    return yield coinSagas[
      coin in Erc20CoinsEnum ? 'ERC20' : coin
    ]?.getOrUpdateProvisionalPayment(
      coreSagas,
      networks,
      paymentR
    ) as PaymentType
  }

  // convert from a coins base unit into fiat
  const convertCoinFromBaseUnitToFiat = (
    coin: CoinType,
    baseUnitValue: number | string,
    userCurrency: keyof CurrenciesType,
    rates: RatesType
  ): number => {
    return coinSagas[
      coin in Erc20CoinsEnum ? 'ERC20' : coin
    ]?.convertFromBaseUnitToFiat(coin, baseUnitValue, userCurrency, rates)
  }

  return {
    convertCoinFromBaseUnitToFiat,
    getDefaultAccountForCoin,
    getNextReceiveAddressForCoin,
    getOrUpdateProvisionalPaymentForCoin
  }
}
