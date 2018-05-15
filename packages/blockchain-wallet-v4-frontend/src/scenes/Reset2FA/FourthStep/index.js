import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Separator, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Footer = styled.div`
  margin-top: 20px;
`

class FourthStepContainer extends React.PureComponent {
  render () {
    return (
      <Wrapper>
        <Header>
          <Text size='24px' weight={300}>
            <FormattedMessage id='scenes.reset2fa.fourthstep' defaultMessage='Reset 2FA' />
          </Text>
          <Text size='10px'>
            <FormattedMessage id='scenes.reset2fa.fourthstep' defaultMessage='Step 2 of 3' />
          </Text>
        </Header>
        <Separator />
        <div>
          <Text size='12px' weight={300}>
            <FormattedMessage id='' defaultMessage='If you lost access to the email associated with your wallet, enter a new email.' />
          </Text>
        </div>
        <Footer>
          <Link size='13px' weight={300}>
            <FormattedMessage id='' defaultMessage='Go Back' />
          </Link>
        </Footer>
      </Wrapper>
    )
  }
}

export default FourthStepContainer
