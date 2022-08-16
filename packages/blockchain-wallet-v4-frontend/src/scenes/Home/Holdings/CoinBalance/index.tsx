import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { SkeletonRectangle } from 'blockchain-info-components'
import { actions } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Success from './template.success'

class CoinBalance extends React.PureComponent<Props> {
  render() {
    const { coin, data } = this.props

    return data.cata({
      Failure: () => (
        <Error coin={coin} onRefresh={() => this.props.balancesV2Actions.fetchUnifiedBalances()} />
      ),
      Loading: () => <SkeletonRectangle height='35px' width='60px' />,
      NotAsked: () => <SkeletonRectangle height='35px' width='60px' />,
      Success: (value) => <Success balance={value} coin={coin} />
    })
  }
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch) => ({
  balancesV2Actions: bindActionCreators(actions.balancesV2, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = { coin: string }
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinBalance)
