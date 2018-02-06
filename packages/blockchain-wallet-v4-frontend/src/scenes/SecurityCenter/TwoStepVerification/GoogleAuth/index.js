
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Google from './template.js'

class GoogleAuthContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.props.modalActions.showModal('TwoStepSetup')
  }

  render () {
    return <Google {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  authType: selectors.core.settings.getAuthType(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(GoogleAuthContainer)
