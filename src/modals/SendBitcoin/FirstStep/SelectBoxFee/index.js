import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import { SelectBox } from 'blockchain-components'

class SelectBoxFeeContainer extends React.Component {
  render () {
    const { fee, regularFee, priorityFee, ...rest } = this.props

    const elements = [{
      group: '',
      items: [{ text: 'Regular', value: regularFee }, { text: 'Priority', value: priorityFee }]
    }]

    return <SelectBox elements={elements} searchEnabled={false} {...rest} />
  }
}

const mapStateToProps = (state) => {
  return {
    regularFee: selectors.core.fee.getRegular(state),
    priorityFee: selectors.core.fee.getPriority(state)
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  transactionActions: bindActionCreators(actions.core.transactions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectBoxFeeContainer)
