import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import { getData } from './selectors'

class ShapeshiftContainer extends React.Component {
  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    throw new Error('fuck')
    return this.props.data.cata({
      Success: (value) => <Success step={value.step}/>,
      Failure: () => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ShapeshiftContainer)
