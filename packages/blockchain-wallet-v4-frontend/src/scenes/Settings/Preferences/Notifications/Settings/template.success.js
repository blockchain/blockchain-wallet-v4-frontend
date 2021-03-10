import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { CheckBox } from 'components/Form'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  ${media.atLeastLaptopL`
    align-items: flex-end;
  `}

  & > * {
    padding: 2px 0;
  }
`

const Setting = props => (
  <Wrapper>
    <Field
      name='emailEnabled'
      component={CheckBox}
      disabled={props.emailDisabled}
    >
      <Text
        color='grey800'
        size='14px'
        weight={600}
        style={{ marginLeft: '4px' }}
      >
        <FormattedMessage
          id='scenes.settings.preferences.notifications.settings.email'
          defaultMessage='Email'
        />
      </Text>
    </Field>
    <Field
      name='mobileEnabled'
      component={CheckBox}
      disabled={props.mobileDisabled}
    >
      <Text
        color='grey800'
        size='14px'
        weight={600}
        style={{ marginLeft: '10px' }}
      >
        <FormattedMessage
          id='scenes.settings.preferences.notifications.settings.sms'
          defaultMessage='SMS'
        />
      </Text>
    </Field>
  </Wrapper>
)

Setting.propTypes = {
  emailDisabled: PropTypes.bool,
  mobileDisabled: PropTypes.bool
}

export default reduxForm({ form: 'settingsNotifications' })(Setting)
