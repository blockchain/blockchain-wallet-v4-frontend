import { useSelector } from 'react-redux'

import { model, selectors } from 'data'
import type { DexSwapForm } from 'data/types'

import { SLIPPAGE_PRESETS } from '../constants'
import type { SlippageValue } from '../types'

const { DEFAULT_SLIPPAGE, DEX_SWAP_FORM } = model.components.dex

export const useSlippageValueFromSwapForm = (): SlippageValue => {
  const { slippage } = useSelector(selectors.form.getFormValues(DEX_SWAP_FORM)) as DexSwapForm

  // no value set in a form
  if (!slippage) {
    return {
      isCustom: false,
      value: DEFAULT_SLIPPAGE
    }
  }

  // we have that value in presets
  if (SLIPPAGE_PRESETS.find((preset) => preset.value === slippage)) {
    return {
      isCustom: false,
      value: slippage
    }
  }

  // custom user value
  return {
    isCustom: true,
    value: slippage
  }
}
