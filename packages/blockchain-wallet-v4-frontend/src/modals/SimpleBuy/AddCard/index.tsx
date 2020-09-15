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

class AddCard extends PureComponent<Props> {
  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      this.props.simpleBuyActions.fetchSBPaymentMethods(this.props.fiatCurrency)
    }
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.addCardDetails()
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
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
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  cryptoCurrency?: CoinType
  handleClose: () => void
  pair: SBPairType
}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type SuccessStateType = ReturnType<typeof getData>['data']
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(AddCard)
