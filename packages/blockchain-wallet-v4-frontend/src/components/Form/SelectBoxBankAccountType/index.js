import React from 'react'
import { FormattedMessage } from 'react-intl'

import SelectBox from '../SelectBox'

const ACCOUNT_TYPES = [
  {
    text: (
      <FormattedMessage
        id='components.form.selectboxbankaccounttype.checking'
        defaultMessage='Checking'
      />
    ),
    value: 'checking'
  },

  {
    text: (
      <FormattedMessage
        id='components.form.selectboxbankaccounttype.savings'
        defaultMessage='Savings'
      />
    ),
    value: 'savings'
  }
]
class SelectBoxBankAccountType extends React.PureComponent {
  render() {
    const elements = [{ group: '', items: ACCOUNT_TYPES }]
    return <SelectBox elements={elements} {...this.props} />
  }
}

export default SelectBoxBankAccountType
