import React from 'react'
import { isNil } from 'ramda'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import Menu from './template.js'
import { getLegacyAccountAddress } from './selectors'

class MenuContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onShowPrivateKey = this.onShowPrivateKey.bind(this)
  }

  onShowPrivateKey (isLegacy) {
    this.props.modalActions.showModal('ShowEthPrivateKey', { isLegacy })
  }

  render () {
    const { legacyAccountAddress } = this.props
    const hasLegacyAccount = !isNil(legacyAccountAddress.data)

    return <Menu onShowPrivateKey={this.onShowPrivateKey} hasLegacyAccount={hasLegacyAccount} />
  }
}

const mapStateToProps = (state) => ({
  legacyAccountAddress: getLegacyAccountAddress(state)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
