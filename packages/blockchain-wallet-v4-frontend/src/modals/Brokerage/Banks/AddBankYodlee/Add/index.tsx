import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import DataError from 'components/DataError'
import { WalletFiatType } from 'core/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType } from 'data/types'

import { Loading, LoadingTextEnum } from '../../../../components'
import { getData } from './selectors'
import Success from './template.success'

class Add extends PureComponent<Props> {
  componentDidMount() {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
      this.props.brokerageActions.fetchBankLinkCredentials(
        this.props.fiatCurrency as WalletFiatType
      )
    }
  }

  handleSubmit = () => {
    this.props.brokerageActions.setAddBankStep({
      addBankStep: AddBankStepType.ADD_BANK_HANDLER
    })
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          onSubmit={this.handleSubmit}
          handleBack={this.props.handleClose}
        />
      ),
      Failure: e => (
        <DataError
          message={{ message: e }}
          onClick={this.props.simpleBuyActions.fetchSBPaymentMethods}
        />
      ),
      Loading: () => <Loading text={LoadingTextEnum.GETTING_READY} />,
      NotAsked: () => <Loading text={LoadingTextEnum.GETTING_READY} />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'USD'
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
type LinkDispatchPropsType = {
  analyticsActions: typeof actions.analytics
  brokerageActions: typeof actions.components.brokerage
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(Add)
