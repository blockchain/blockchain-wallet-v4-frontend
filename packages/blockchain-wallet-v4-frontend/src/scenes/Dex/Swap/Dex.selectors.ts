import { lift } from 'ramda'

import { Remote } from '@core'
import { ExtractSuccess } from '@core/remote/types'
import { model, selectors } from 'data'
import { DexSwapForm, DexSwapSideEnum } from 'data/components/dex/types'
import { RootState } from 'data/rootReducer'

const { DEX_SWAP_FORM } = model.components.dex

const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues(DEX_SWAP_FORM)(state) as DexSwapForm
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  const baseCoin = formValues?.[DexSwapSideEnum.BASE]
  const counterCoin = formValues?.[DexSwapSideEnum.COUNTER]
  const baseRatesR = baseCoin
    ? selectors.core.data.coins.getRates(baseCoin, state)
    : Remote.Success({})
  const counterRatesR = counterCoin
    ? selectors.core.data.misc.getRatesSelector(counterCoin, state)
    : Remote.Success({})

  return lift(
    (
      walletCurrency: ExtractSuccess<typeof walletCurrencyR>,
      baseRates: ExtractSuccess<typeof baseRatesR>,
      counterRates: ExtractSuccess<typeof counterRatesR>
    ) => {
      return {
        baseRates,
        counterRates,
        formValues
      }
    }
  )(walletCurrencyR, baseRatesR, counterRatesR)
}

export default getData
