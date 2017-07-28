import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Modal from './template.js'

class ModalContainer extends React.Component {
  constructor (props) {
    super(props)
    this.close = this.close.bind(this)
  }

  close () {
    this.props.actions.closeModal()
  }

  render () {
    return (
      <Modal {...this.props} close={this.close} />
    )
  }
}

ModalContainer.propTypes = {
  displayed: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(ModalContainer)
