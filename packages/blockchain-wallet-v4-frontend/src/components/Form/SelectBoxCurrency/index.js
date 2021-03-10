import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'

import SelectBox from '../SelectBox'

class SelectBoxCurrency extends React.PureComponent {
  render() {
    const { currencies, ...rest } = this.props
    const elements = [{ group: '', items: currencies }]

    return <SelectBox elements={elements} {...rest} />
  }
}

const mapStateToProps = state => ({
  currency: selectors.core.settings.getCurrency(state),
  currencies: [
    { text: 'Australian Dollar', value: 'AUD' },
    { text: 'Brazil Real', value: 'BRL' },
    { text: 'Canadian Dollar', value: 'CAD' },
    { text: 'Chilean Peso', value: 'CLP' },
    { text: 'Chinese Yuan', value: 'CNY' },
    { text: 'Danish Krone', value: 'DKK' },
    { text: 'Euros', value: 'EUR' },
    { text: 'Pounds', value: 'GBP' },
    { text: 'Hong Kong Dollar', value: 'HKD' },
    { text: 'Icelandic Króna', value: 'ISK' },
    { text: 'Indian Rupee', value: 'INR' },
    { text: 'Japanese Yen', value: 'JPY' },
    { text: 'New Taiwan Dollar', value: 'TWD' },
    { text: 'New Zealand Dollar', value: 'NZD' },
    { text: 'Polish Zloty', value: 'PLN' },
    { text: 'Russian Ruble', value: 'RUB' },
    { text: 'Singapore Dollar', value: 'SGD' },
    { text: 'South Korean Won', value: 'KRW' },
    { text: 'Swedish Krona', value: 'SEK' },
    { text: 'Swiss Franc', value: 'CHF' },
    { text: 'Thai Baht', value: 'THB' },
    { text: 'U.S. Dollar', value: 'USD' }
  ]
})

export default connect(mapStateToProps)(SelectBoxCurrency)
