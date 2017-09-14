import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'

import { Button, ButtonGroup, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { validIpList } from 'services/FormHelper'
import { SettingForm, SettingWrapper } from 'components/Setting'

const Setting = (props) => {
  const { updateToggled, handleToggle, handleClick, currentWhitelist, submitting, invalid } = props

  return (
    <SettingWrapper>
      <Text>{currentWhitelist}</Text>
      <Button nature='primary' onClick={handleToggle}>
        <FormattedMessage id='scenes.settings.whitelist.updateform.change' defaultMessage='Change' />
      </Button>
      {updateToggled &&
        <SettingForm>
          <Field name='IPWhitelist' validate={[validIpList]} component={TextBox} />
          <ButtonGroup>
            <Button nature='empty' capitalize onClick={handleToggle}>
              <FormattedMessage id='scenes.settings.whitelist.updateform.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='primary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.settings.whitelist.updateform.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </SettingForm>
      }
    </SettingWrapper>
  )
}

Setting.propTypes = {
  currentWhitelist: PropTypes.string.isRequired,
  updateToggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default reduxForm({ form: 'settingIPWhitelist' })(Setting)
