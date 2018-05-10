import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Template from './template'
import { actions } from 'data'

class StateRegistrationStep extends React.Component {
  componentWillUnmount () {
    this.props.actions.destroyed()
  }

  onSubmit = (e) => {
    e.preventDefault()
  }

  render () {
    const { onSubmit } = this.props
    return (
      <Template handleSubmit={onSubmit} />
    )
  }
}

const mapStateToProps = (state) => ({
  data: '' //getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(StateRegistrationStep)
