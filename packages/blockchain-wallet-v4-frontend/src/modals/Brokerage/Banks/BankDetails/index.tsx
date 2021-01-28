import { actions, selectors } from 'data'
import { BankTransferAccountType } from 'core/types'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'

import { BrokerageStepType } from 'data/types'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import Template from './template'

export type OwnProps = {
  handleClose: () => void
}
export type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
}
type LinkStatePropsType = {
  account: BankTransferAccountType | undefined
}
export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class BankDetails extends PureComponent<Props, {}> {
  handleSubmit = () => {
    if (this.props.account) {
      this.props.brokerageActions.setStep({
        step: BrokerageStepType.REMOVE_BANK,
        account: this.props.account,
        redirectBackToStep: BrokerageStepType.SHOW_BANK
      })
    }
  }

  render () {
    if (!this.props.account) {
      return null
    }
    return (
      <Template
        {...this.props}
        onSubmit={this.handleSubmit}
        account={this.props.account}
      />
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  account: selectors.components.brokerage.getAccount(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(BankDetails)
