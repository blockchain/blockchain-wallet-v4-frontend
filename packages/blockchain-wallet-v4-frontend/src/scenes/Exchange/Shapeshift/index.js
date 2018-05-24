import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import SuccessTemplate from './template'
import { getData } from './selectors'

class ShapeshiftContainer extends React.Component {
  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  render () {
    return this.props.data.cata({
      Success: (value) => <SuccessTemplate step={value.step}/>
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
