import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getData } from './selectors'
import { actions, selectors } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Form from './Form'

class SecondContainer extends React.Component {
  componentWillMount () {
    // Make request to shapeShift to create order
    const { pair, sourceReceiveAddress, sourceAmount, targetReceiveAddress } = this.props
    this.props.kvStoreShapeshiftActions.fetchMetadataShapeshift()
    this.props.dataShapeshiftActions.fetchOrder(sourceAmount, pair, sourceReceiveAddress, targetReceiveAddress)
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Form {...rest} {...value} />,
      Failure: (message) => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps.source, ownProps.target),
  coins: selectors.core.data.bitcoin.getCoins(state).getOrElse([])
})

const mapDispatchToProps = (dispatch) => ({
  dataShapeshiftActions: bindActionCreators(actions.core.data.shapeShift, dispatch),
  kvStoreShapeshiftActions: bindActionCreators(actions.core.kvStore.shapeShift, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondContainer)
