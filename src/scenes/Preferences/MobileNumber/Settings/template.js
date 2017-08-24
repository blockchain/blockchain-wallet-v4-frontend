import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'

import { validMobileNumber } from 'services/FormHelper'
import { Button, ButtonGroup, Text, TextGroup } from 'blockchain-info-components'
import { Form, PhoneNumberBox } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
`
const Settings = (props) => {
  const { toggled, handleToggle, handleClick, mobileNumber, submitting, invalid } = props

  if (toggled) {
    return (
      <Wrapper>
        <TextGroup inline>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.preferences.mobilenumber.setting.explain' defaultMessage='Use your mobile phone to receive a one-time-password after a login attempt.' />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.preferences.mobilenumber.setting.explain2' defaultMessage='Add your mobile phone number below to continue,' />
          </Text>
        </TextGroup>
        <br />
        <Form>
          <Field name='mobileNumber' validate={[validMobileNumber]} component={PhoneNumberBox} />
          <ButtonGroup>
            <Button nature='empty' onClick={handleToggle} capitalize>
              <FormattedMessage id='scenes.preferences.mobilenumber.setting.cancel' defaultMessage='Cancel' />
            </Button>
            <Button nature='secondary' capitalize disabled={submitting || invalid} onClick={handleClick}>
              <FormattedMessage id='scenes.preferences.mobilenumber.setting.save' defaultMessage='Save' />
            </Button>
          </ButtonGroup>
        </Form>
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Text>{mobileNumber}</Text>
        <Button nature='secondary' onClick={handleToggle}>
          <FormattedMessage id='scenes.preferences.mobile.change' defaultMessage='Change' />
        </Button>
      </Wrapper>
    )
  }
}

Settings.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  mobileNumber: PropTypes.string.isRequired
}

Settings.defaultProps = {
  toggled: false
}

export default Settings
