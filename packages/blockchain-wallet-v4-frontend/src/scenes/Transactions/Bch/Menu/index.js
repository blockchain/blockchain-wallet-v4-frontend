import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import Menu from './template.js'

class MenuContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickReporting = this.handleClickReporting.bind(this)
  }

  handleClickReporting () {
    this.props.modalActions.showModal('TransactionReport', {coin: 'BCH'})
  }

  render () {
    return <Menu handleClickReporting={this.handleClickReporting} />
  }
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(undefined, mapDispatchToProps)(MenuContainer)
