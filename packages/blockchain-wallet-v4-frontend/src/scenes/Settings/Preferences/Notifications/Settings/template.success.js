import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { reduxForm, Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { CheckBox } from 'components/Form'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  @media(min-width: 992px) {
    align-items: flex-end;
  }

  & > * { padding: 10px 0; }
`

const Setting = props => (
  <Wrapper>
    <Text>
      <FormattedMessage id='scenes.settings.preferences.notifications.settings.receive' defaultMessage='Receive By:' />
    </Text>
    <Field name='emailEnabled' component={CheckBox} disabled={props.emailDisabled}>
      <Text size='14' weight={300}>
        <FormattedMessage id='scenes.settings.preferences.notifications.settings.email' defaultMessage='Email' />
      </Text>
    </Field>
    <Field name='mobileEnabled' component={CheckBox} disabled={props.mobileDisabled}>
      <Text size='14' weight={300}>
        <FormattedMessage id='scenes.settings.preferences.notifications.settings.sms' defaultMessage='SMS' />
      </Text>
    </Field>
  </Wrapper>
)

Setting.propTypes = {
  emailDisabled: PropTypes.bool,
  mobileDisabled: PropTypes.bool
}

export default reduxForm({ form: 'settingsNotifications' })(Setting)
