import React from 'react'
import { connect } from 'react-redux'

import SelectBox from '../SelectBox'

class SelectBoxBankAccountType extends React.PureComponent {
  render () {
    const { accountTypes, ...rest } = this.props
    const elements = [{ group: '', items: accountTypes }]
    return <SelectBox elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  accountTypes: [
    { text: 'Checking', value: 'checking' },
    { text: 'Savings', value: 'savings' }
  ]
})

export default connect(mapStateToProps)(SelectBoxBankAccountType)
