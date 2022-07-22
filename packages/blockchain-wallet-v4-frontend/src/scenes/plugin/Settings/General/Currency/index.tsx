import React from 'react'
import { useSelector } from 'react-redux'

import { selectors } from 'data'

import Template from './template'

const LocalCurrencyContainer = () => {
  const currency = useSelector(selectors.core.settings.getCurrency)

  return currency.cata({
    Failure: (message) => <>{message}</>,
    Loading: () => <Template />,
    NotAsked: () => <Template />,
    Success: (value) => <Template currency={value} />
  })
}

export default LocalCurrencyContainer
