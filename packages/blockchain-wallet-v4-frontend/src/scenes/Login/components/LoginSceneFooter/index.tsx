import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { LoginSteps } from 'data/auth/types'

const PhishingWarning = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background-color: ${(props) => props.theme.whiteFade100};
  padding: 12px 32px;
`

export const loginSceneFooter = (step) => {
  switch (step) {
    case LoginSteps.ENTER_EMAIL_GUID:
      return (
        <>
          <Text size='14px' color='grey400' weight={500} style={{ margin: '24px 0 16px' }}>
            <FormattedMessage
              id='scenes.login.phishingwarning'
              defaultMessage='Please check that you are visiting the correct URL'
            />
          </Text>
          <PhishingWarning>
            <Icon name='padlock' color='grey400' size='14px' />
            <Text color='grey400' weight={500} style={{ paddingLeft: '8px' }}>
              https://login.blockchain.com
            </Text>
          </PhishingWarning>
        </>
      )
    default:
      return null
  }
}
