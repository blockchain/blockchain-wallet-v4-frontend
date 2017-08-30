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
    { text: 'Swiss Franc', value: 'CHF' },
    { text: 'Icelandic Króna', value: 'ISK' },
    { text: 'Hong Kong Dollar', value: 'HKD' },
    { text: 'New Taiwan dollar', value: 'TWD' },
    { text: 'Euro', value: 'EUR' },
    { text: 'Danish Krone', value: 'DKK' },
    { text: 'Chilean Peso', value: 'CLP' },
    { text: 'U.S. dollar', value: 'USD' },
    { text: 'Canadia Dollar', value: 'CAD' },
    { text: 'Indian Rupee', value: 'INR' },
    { text: 'Chinese yuan', value: 'CNY' },
    { text: 'Thai baht', value: 'THB' },
    { text: 'Australian Dollar', value: 'AUD' },
    { text: 'South Korean Won', value: 'KRW' },
    { text: 'Singapore Dollar', value: 'SGD' },
    { text: 'Japanese Yen', value: 'JPY' },
    { text: 'Polish Zloty', value: 'PNL' },
    { text: 'Great British Pound', value: 'GBP' },
    { text: 'Swedish Krona', value: 'SEK' },
    { text: 'New Zealand Dollar', value: 'NZD' },
    { text: 'Brazil Real', value: 'BRL' },
    { text: 'Russian Ruble', value: 'RUB' }
  ]
})

export default connect(mapStateToProps)(SelectBoxCurrency)
