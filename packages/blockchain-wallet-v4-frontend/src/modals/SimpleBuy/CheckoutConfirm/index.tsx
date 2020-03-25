import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import {
  RemoteDataType,
  SBOrderType,
  SBQuoteType,
  SupportedCoinsType
} from 'core/types'
import { RootState } from 'data/rootReducer'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
export type SuccessStateType = {
  quote: SBQuoteType
}
export type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  supportedCoins: SupportedCoinsType
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class CheckoutConfirm extends PureComponent<Props, State> {
  state = {}

  componentDidMount () {
    this.props.simpleBuyActions.fetchSBQuote()
  }

  handleSubmit = () => {
    this.props.simpleBuyActions.confirmSBOrder()
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
      ),
      Failure: e => <DataError message={{ message: e }} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({
      BTC: { colorCode: 'btc' },
      BCH: { colorCode: 'bch' },
      ETH: { colorCode: 'eth' },
      PAX: { colorCode: 'pax' },
      STX: { colorCode: 'stx' },
      XLM: { colorCode: 'xlm' }
    })
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutConfirm)
