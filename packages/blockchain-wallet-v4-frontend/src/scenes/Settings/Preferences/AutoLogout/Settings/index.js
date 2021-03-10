import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { Button, Text } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'
import { actions, selectors } from 'data'

import AutoLogoutForm from './template'

class SettingContainer extends React.PureComponent {
  state = { updateToggled: false }

  onSubmit = () => {
    const { autoLogoutTime } = this.props

    this.props.settingsActions.updateAutoLogout(
      parseInt(autoLogoutTime) * 60000
    )
    this.handleToggle()
  }

  handleToggle = () => {
    this.setState({
      updateToggled: !this.state.updateToggled
    })
  }

  render() {
    const { logoutTime } = this.props

    return this.state.updateToggled ? (
      <AutoLogoutForm
        onSubmit={this.onSubmit}
        handleToggle={this.handleToggle}
      />
    ) : (
      <SettingWrapper>
        <Text
          data-e2e='autoLogoutValue'
          color='grey800'
          size='15px'
          weight={600}
        >
          <FormattedMessage
            id='scenes.preferences.autologout.settings.minutes'
            defaultMessage='{time} minutes'
            values={{ time: logoutTime }}
          />
        </Text>
        <Button
          nature='primary'
          onClick={this.handleToggle}
          data-e2e='changeAutoLogout'
        >
          <FormattedMessage
            id='scenes.preferences.autologout.settings.updateform.change'
            defaultMessage='Change'
          />
        </Button>
      </SettingWrapper>
    )
  }
}

const mapStateToProps = state => ({
  autoLogoutTime: parseInt(
    formValueSelector('settingAutoLogoutTime')(state, 'autoLogoutTime')
  ),
  logoutTime: parseInt(selectors.core.wallet.getLogoutTime(state) / 60000)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer)
