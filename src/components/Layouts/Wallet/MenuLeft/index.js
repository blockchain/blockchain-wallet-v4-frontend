import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import { actions, selectors } from 'data'
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
    securityCenterMenuDisplayed: selectors.ui.getSecurityCenterMenuDisplayed(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuLeftContainer)
