import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { ui } from 'data/rootSelectors'

import * as uiActions from 'data/UI/actions.js'
import MenuLeft from './template.js'

class MenuLeftContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickSecurityCenter = this.handleClickSecurityCenter.bind(this)
    this.handleClickOthers = this.handleClickOthers.bind(this)
  }

  handleClickOthers () {
    if (this.props.securityCenterMenuDisplayed) {
      this.props.actions.hideSecurityCenterMenu()
    }
  }

  handleClickSecurityCenter () {
    this.props.actions.toggleSecurityCenterMenu()
  }

  render () {
    return (
      <MenuLeft
        securityCenterMenuDisplayed={this.props.securityCenterMenuDisplayed}
        clickSecurityCenter={this.handleClickSecurityCenter}
        clickOthers={this.handleClickOthers} />
    )
  }
}
function mapStateToProps (state, ownProps) {
  return {
    securityCenterMenuDisplayed: ui.getSecurityCenterMenuDisplayed(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuLeftContainer)
