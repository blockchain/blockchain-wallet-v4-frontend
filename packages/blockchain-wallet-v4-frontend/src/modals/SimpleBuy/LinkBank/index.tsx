import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { CoinType, SBPairType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { Remote } from 'core'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

class LinkBank extends PureComponent<Props> {
  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
      this.props.brokerageActions.fetchFastLink()
    }
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.setStep({ step: 'LINK_BANK_HANDLER' })
  }

  handleBack = () => {
    this.props.simpleBuyActions.setStep({
      step: 'PAYMENT_METHODS',
      cryptoCurrency: this.props.cryptoCurrency,
      fiatCurrency: this.props.fiatCurrency,
      pair: this.props.pair
    })
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          onSubmit={this.handleSubmit}
          handleBack={this.handleBack}
        />
      ),
      Failure: e => (
        <DataError
          message={{ message: e }}
          onClick={this.props.simpleBuyActions.fetchSBPaymentMethods}
        />
      ),
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'EUR'
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  cryptoCurrency: CoinType
  handleClose: () => void
  pair: SBPairType
}
type LinkDispatchPropsType = {
  brokerageActions: typeof actions.components.brokerage
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(LinkBank)
