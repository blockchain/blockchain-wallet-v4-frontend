import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'

import Template from './template'

const LocalCurrencyContainer = (props) => {
  const { data } = props

  return data.cata({
    Failure: (message) => <>{message}</>,
    Loading: () => <Template />,
    NotAsked: () => <Template />,
    Success: (value) => <Template currency={value} />
  })
}

const mapStateToProps = (state) => ({
  data: selectors.core.settings.getCurrency(state)
})

export default connect(mapStateToProps)(LocalCurrencyContainer)
