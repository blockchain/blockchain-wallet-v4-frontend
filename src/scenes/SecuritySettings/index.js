import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import SecuritySettings from './template.js'
import { actions, selectors } from 'data'

class SecuritySettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickAdvancedSecurity = this.handleClickAdvancedSecurity.bind(this)
  }

  handleClickAdvancedSecurity () {
    this.props.actions.toggleAdvancedSecurity()
  }

  render () {
    return (
      <SecuritySettings
        advancedSecurityDisplayed={this.props.advancedSecurityDisplayed}
        clickAdvancedSecurity={this.handleClickAdvancedSecurity}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    advancedSecurityDisplayed: selectors.ui.getAdvancedSecurityDisplayed(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SecuritySettingsContainer)
