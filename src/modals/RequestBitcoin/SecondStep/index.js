import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { active: false }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ active: true })
    setTimeout(() => { this.setState({ active: false }) }, 2000)
  }

  render () {
    console.log(this.props)
    const link = `https://blockchain.info/payment_request?address=${this.props.address}&amount=${this.props.amount}&message=${this.props.message}`

    return <SecondStep {...this.props} link={link} active={this.state.active} handleClick={this.handleClick} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(SecondStepContainer)
