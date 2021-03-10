import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { CoinType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

export class CoinTickerContainer extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.actions.initialized()
  }

  render() {
    const { data } = this.props

    return data.cata({
      Success: value => (
        <Success {...value} data-e2e={this.props['data-e2e']} />
      ),
      Failure: message => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  data: selectors.components.priceTicker.getData(ownProps.coin, state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceTicker, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinTickerContainer)
