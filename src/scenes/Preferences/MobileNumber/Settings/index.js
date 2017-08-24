
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { singleForm } from 'providers/FormProvider'
import ui from 'redux-ui'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillMount () {
    this.props.reduxFormActions.initialize('settingMobilePhone', { mobileNumber: this.props.mobileNumber })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.mobileNumber, this.props.mobileNumber)) {
      this.props.reduxFormActions.change('settingMobilePhone', this.props.mobileNumber)
    }
  }

  handleClick () {
    console.log('click')
  }

  handleToggle () {
    this.props.updateUI({ toggled: !this.props.ui.toggled })
  }

  render () {
    const { ui, uiUpdate, ...rest } = this.props

    return <Settings
      {...rest}
      toggled={ui.toggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
    />
  }
}

const mapStateToProps = (state) => ({
  mobileNumber: selectors.core.settings.getSmsNumber(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_MobileNumber', state: { toggled: false } }),
  singleForm('settingMobilePhone')
)

export default enhance(SettingsContainer)
