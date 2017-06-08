import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as uiActions from 'data/UI/actions.js'
import MenuLeft from './template.js'

class MenuLeftContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickSecurityCenter = this.handleClickSecurityCenter.bind(this)
  }

  handleClickSecurityCenter () {
    this.props.actions.toggleSecurityCenterMenu()
  }

  render () {
    return (
      <MenuLeft securityCenterMenuDisplayed={this.props.securityCenterMenuDisplayed} clickSecurityCenter={this.handleClickSecurityCenter} />
    )
  }
}
function mapStateToProps (state, ownProps) {
  return {
    securityCenterMenuDisplayed: state.applicationState.ui.securityCenterMenuDisplayed
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuLeftContainer)
