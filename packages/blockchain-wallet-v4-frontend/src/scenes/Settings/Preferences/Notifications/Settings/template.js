import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { not } from 'ramda'

import { CheckBoxInput, Text } from 'blockchain-info-components'

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
const Setting = (props) => {
  const { isEmailVerified, isMobileVerified } = props.data

  return (
    <Wrapper>
      <Text>
        <FormattedMessage id='scenes.settings.preferences.notifications.settings.receive' defaultMessage='Receive By:' />
      </Text>
      <CheckBoxInput disabled={not(isEmailVerified)} name='Email'>
        <Text size='14' weight={300}><FormattedMessage id='scenes.settings.preferences.notifications.settings.email' defaultMessage='Email' /></Text>
      </CheckBoxInput>
      <CheckBoxInput disabled={not(isMobileVerified)} name='SMS'>
        <Text size='14' weight={300}><FormattedMessage id='scenes.settings.preferences.notifications.settings.sms' defaultMessage='SMS' /></Text>
      </CheckBoxInput>
    </Wrapper>
  )
}

export default Setting
