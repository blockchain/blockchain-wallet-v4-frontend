import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { SelectBox } from 'components/generic/Form'

class SelectBoxFeeContainer extends React.Component {
  render () {
    const { fee, ...rest } = this.props
    const elements = [
      { group: '', items: fee }
    ]

    return <SelectBox elements={elements} searchEnabled={false} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => {
  const fee = [
    { text: 'Regular', value: 30 },
    { text: 'Priority', value: 220 }
  ]
  return {
    fee: fee
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectBoxFeeContainer)
