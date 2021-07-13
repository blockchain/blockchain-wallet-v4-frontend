import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import SelectBox from '../SelectBox'

class SelectBoxBankAccountType extends React.PureComponent {
  render() {
    const { accountTypes, ...rest } = this.props
    const elements = [{ group: '', items: accountTypes }]
    return <SelectBox elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  accountTypes: [
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
})

export default connect(mapStateToProps)(SelectBoxBankAccountType)
