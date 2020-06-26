import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

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

const Header = () => (
  <Wrapper>
    <Column>
      <HeaderText
        color='whiteFade900'
        weight={700}
        data-e2e='signupSecureHeader'
      >
        <FormattedMessage
          id='scenes.register.securelybuy'
          defaultMessage='Securely buy, sell, and store crypto.'
        />
      </HeaderText>
      <SubHeader
        color='whiteFade800'
        weight={500}
        data-e2e='signupSecureSubHeader'
      >
        <FormattedMessage
          id='scenes.register.getstarted'
          defaultMessage='Get started by signing up.'
        />
      </SubHeader>
    </Column>
  </Wrapper>
)
export default Header
