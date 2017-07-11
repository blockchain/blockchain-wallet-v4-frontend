import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import QRCode from './template.js'

class QRCodeContainer extends React.Component {
  render () {
    return <QRCode
      show={this.props.show}
      address={this.props.address} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(QRCodeContainer)
