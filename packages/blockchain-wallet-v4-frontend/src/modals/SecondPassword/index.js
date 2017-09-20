import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'

import modalEnhancer from 'providers/ModalEnhancer'
import SecondPassword from './template.js'

class SecondPasswordContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { secondPassword: '' }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleClick () {
    const { nextAction, nextPayload } = this.props
    const finalPayload = Object.assign({}, nextPayload, { secondPassword: this.state.secondPassword })
    const action = { type: nextAction, payload: finalPayload }
    this.props.close()
    this.props.dispatch(action)
  }

  handleChange (event) {
    this.setState({ secondPassword: event.target.value })
  }

  render () {
    return <SecondPassword {...this.props} handleClick={this.handleClick} handleChange={this.handleChange} value={this.state.secondPassword} />
  }
}

SecondPasswordContainer.propTypes = {
  nextAction: PropTypes.string.isRequired,
  nextPayload: PropTypes.object
}

SecondPasswordContainer.defaultProps = {
  nextAction: 'SHOW_MODAL',
  nextPayload: { type: 'SecondPassword' }
}

const enhance = compose(
  modalEnhancer('SecondPassword'),
  connect()
)

export default enhance(SecondPasswordContainer)
