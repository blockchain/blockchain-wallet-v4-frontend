import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ExportXPub from './template.js'

class ExportXPubContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick () {
    this.props.modalActions.showModal('ShowXPub', { xpub: this.props.xpub })
  }

  render () {
    return <ExportXPub onClick={this.onClick} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  // TODO what is xpub?
  xpub: ownProps.deviceId
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportXPubContainer)
