
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import Settings from './template.js'

class EditFormContainer extends React.PureComponent {
  componentWillMount () {
    this.props.formActions.initialize('settingAutoLogoutTime', { autoLogoutTime: this.props.logoutTime })
  }

  render () {
    const { handleToggle, handleClick } = this.props

    return <Settings handleToggle={handleToggle} handleClick={handleClick} />
  }
}

const mapStateToProps = state => ({
  logoutTime: parseInt(selectors.core.wallet.getLogoutTime(state) / 60000)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditFormContainer)
