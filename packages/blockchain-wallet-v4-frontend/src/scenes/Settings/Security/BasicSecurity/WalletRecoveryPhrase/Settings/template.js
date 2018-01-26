import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Button } from 'blockchain-info-components'

const Settings = (props) => {
  const { handleClick } = props

  return (
    <Button nature='primary' onClick={handleClick}>
      <FormattedMessage id='cenes.securitysettings.basicsecurity.recoveryphrase.settings.backup' defaultMessage='Backup phrase' />
    </Button>
  )
}

Settings.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Settings
