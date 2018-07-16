import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Button, Text } from 'blockchain-info-components'
import { SettingWrapper } from 'components/Setting'
import EditForm from './EditForm'

const Settings = (props) => {
  const { updateToggled, handleToggle, handleClick, logoutTime } = props

  return updateToggled
    ? <EditForm handleClick={handleClick} handleToggle={handleToggle} />
    : (
      <SettingWrapper>
        <Text>
          <FormattedMessage id='scenes.preferences.autologout.settings.minutes' defaultMessage='{time} minutes' values={{ time: logoutTime }} />
        </Text>
        <Button nature='primary' onClick={handleToggle}>
          <FormattedMessage id='scenes.preferences.autologout.settings.updateform.change' defaultMessage='Change' />
        </Button>
      </SettingWrapper>
    )
}

Settings.propTypes = {
  logoutTime: PropTypes.number.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Settings
