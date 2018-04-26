import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import Menu from './template.js'

class MenuContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onShowPrivateKey = this.onShowPrivateKey.bind(this)
  }

  onShowPrivateKey (isLegacy) {
    this.props.modalActions.showModal('ShowEthPrivateKey', { isLegacy })
  }

  render () {
    return <Menu onShowPrivateKey={this.onShowPrivateKey} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MenuContainer)
