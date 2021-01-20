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
  redirectBackToStep: BrokerageStepType.SHOW_BANK | undefined
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class CancelOrder extends PureComponent<Props, State> {
  state = {}

  handleSubmit = () => {
    if (this.props.account) {
      this.props.brokerageActions.deleteSavedBank(this.props.account.id)
    }
  }

  handleClickBack = () => {
    if (this.props.redirectBackToStep && this.props.account) {
      this.props.brokerageActions.setStep({
        step: this.props.redirectBackToStep,
        account: this.props.account
      })
    } else {
      this.props.handleClose()
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
        onClickBack={this.handleClickBack}
        account={this.props.account}
        redirectBack={this.props.redirectBackToStep}
      />
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  account: selectors.components.brokerage.getAccount(state),
  redirectBackToStep: selectors.components.brokerage.getRedirectBackToStep(
    state
  )
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(CancelOrder)
