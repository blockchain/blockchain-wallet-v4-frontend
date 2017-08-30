import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import { SelectInput } from 'blockchain-info-components'

class SelectBoxCurrency extends React.Component {
  render () {
    const { currencies, ...rest } = this.props
    const elements = [{ group: '', items: currencies }]

    return <SelectInput elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  currency: selectors.core.settings.getCurrency(state),
  currencies: [
    { text: 'U.S. Dollar', value: 'USD' },
    { text: 'Euro', value: 'EUR' },
    { text: 'Swiss Franc', value: 'CHF' }
  ]
})

export default connect(mapStateToProps)(SelectBoxCurrency)
