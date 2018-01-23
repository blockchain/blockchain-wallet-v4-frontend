import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import SecondStep from './template'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    // TODO: See how to use the message for the transaction
    const { from, to, message, amount, fee } = this.props.data
    // this.props.sendEtherActions.sendEther(from, to, amount, fee)
  }

  render () {
    const { data, ...rest } = this.props
    return <SecondStep {...data} {...rest} handleSubmit={this.handleSubmit} />
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  sendEtherActions: bindActionCreators(actions.modules.sendEther, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SecondStepContainer)
