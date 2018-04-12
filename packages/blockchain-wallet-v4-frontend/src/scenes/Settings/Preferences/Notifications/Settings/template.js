import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

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
  return (
    <Wrapper>
      <Text>
        <FormattedMessage id='scenes.preferences.notifications.settings.receive' defaultMessage='Receive by:' />
      </Text>
      <CheckBoxInput name='Email'>
        <Text size='14' weight={300}><FormattedMessage id='scenes.preferences.notifications.settings.email' defaultMessage='Email' /></Text>
      </CheckBoxInput>
      <CheckBoxInput name='SMS'>
        <Text size='14' weight={300}><FormattedMessage id='scenes.preferences.notifications.settings.sms' defaultMessage='SMS' /></Text>
      </CheckBoxInput>
    </Wrapper>
  )
}

export default Setting
