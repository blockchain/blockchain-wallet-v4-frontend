import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import { SubviewProps } from '../../types'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 4rem;
`
const Column = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  ${media.tabletL`
    align-items: flex-start;
  `}
`
const HeaderText = styled(Text)`
  font-size: 32px;
  color: ${media.tabletL`
    font-size: 32px;
  `};
`
const SubHeader = styled(Text)`
  margin-top: 1.25rem;
  font-size: 24px;

  ${media.tabletL`
    font-size: 20px;
  `}
`

const Header = (props: SubviewProps) => (
  <Wrapper>
    <Column>
      <HeaderText color='whiteFade900' weight={700} data-e2e='signupSecureHeader'>
        {!props.isLatam ? (
          <FormattedMessage
            id='scenes.register.securelybuy'
            defaultMessage='Securely Buy, Sell, and Store Crypto.'
          />
        ) : (
          <FormattedMessage
            id='scenes.register.sendreceiveearn'
            defaultMessage='Send, receive and get up to 14% profit with your cryptos.'
          />
        )}
      </HeaderText>

      <SubHeader color='whiteFade800' weight={500} data-e2e='signupSecureSubHeader'>
        {!props.isLatam ? (
          <FormattedMessage
            id='scenes.register.getstarted'
            defaultMessage='Get Started by Signing Up Now.'
          />
        ) : (
          <FormattedMessage
            id='scenes.register.getstartedandverify'
            defaultMessage='Get Started by Signing Up and verify your profile.'
          />
        )}
      </SubHeader>
    </Column>
  </Wrapper>
)
export default Header
