import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'

import Modal from './Modal'
import RequestBitcoin from 'components/Shared/RequestBitcoin'
import { actions, selectors } from 'data'

class ModalContainer extends React.Component {
  constructor (props) {
    super(props)
    this.close = this.close.bind(this)
  }

  close () {
    this.props.actions.toggleModal()
  }

  render () {
    let component
    switch (this.props.type) {
      case 'requestBitcoin':
        component = RequestBitcoin
        break
      default:
        component = RequestBitcoin
    }

    return (
      <Modal displayed={this.props.displayed} component={component} close={this.close} />
    )
  }
}

const mapStateToProps = (state) => ({
  displayed: selectors.modals.getDisplayed(state),
  type: selectors.modals.getType(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalContainer)
