import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { CheckBox } from 'components/Form'
import { Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'

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
    <Text>
      <FormattedMessage
        id='scenes.settings.preferences.notifications.settings.receive'
        defaultMessage='Receive By:'
      />
    </Text>
    <Field
      name='emailEnabled'
      component={CheckBox}
      disabled={props.emailDisabled}
    >
      <Text size='14' weight={400} style={{ marginLeft: '4px' }}>
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
      <Text size='14' weight={400} style={{ marginLeft: '12px' }}>
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
