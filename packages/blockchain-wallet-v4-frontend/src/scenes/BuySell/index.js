import React from 'react'
import { getData } from './selectors'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FirstStep from './FirstStep'

class BuySellContainer extends React.Component {
  componentWillMount () {
    this.props.kvStoreBuySellActions.fetchMetadataBuySell()
  }

  render () {
    const { data } = this.props
    return (
      data.cata({
        Success: (value) => <FirstStep />,
        Failure: (message) => <div>{message}</div>,
        Loading: () => <div>Loading...</div>,
        NotAsked: () => <div />
      })
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  kvStoreBuySellActions: bindActionCreators(actions.core.kvStore.buySell, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BuySellContainer)
