import React from 'react'
import { actions, selectors } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { prop } from 'ramda'

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
  xpub: selectors.core.kvStore.lockbox
    .getLockboxBtcDefaultAccount(state, ownProps.deviceIndex)
    .map(prop('xpub'))
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExportXPubContainer)
