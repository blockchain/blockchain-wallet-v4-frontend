import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'

import { Button, SpinningLoader, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import QRReader from 'components/QRCode/Reader'

const Header = styled.div`
  display: flex;
  justify-content: center;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`
const QRCodeContainer = styled.div`
  width: 100%;
  padding: 0 48px;
  margin-top: 24px;
  box-sizing: border-box;
`

const LoaderSpacer = styled.div`
  width: 320px;
  height: 320px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  div {
    margin: 0 auto;
  }
`
const InstructionsContainer = styled.div`
  margin: 24px 0;
`
const Instruction = styled(Text)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin-top: 12px;
  &:first-child {
    margin-top: 0px;
  }
  color: ${props => props.theme['grey800']};
`

const MobileLogin = props => {
  const { close, ...rest } = props
  const { handleError, handleScan, isScanning } = rest

  return (
    <Wrapper>
      <Header>
        <Text size='20px' color='blue900' weight={600} capitalize>
          <FormattedMessage
            id='scenes.mobilelogin.title'
            defaultMessage='Login with Your Mobile App'
          />
        </Text>
      </Header>
      <Container>
        <QRCodeContainer>
          {isScanning ? (
            <LoaderSpacer>
              <SpinningLoader />
            </LoaderSpacer>
          ) : (
            <QRReader onScan={handleScan} onError={handleError} />
          )}
        </QRCodeContainer>
        <InstructionsContainer>
          <Instruction>
            <FormattedMessage
              id='scenes.mobilelogin.openappstep1'
              defaultMessage='1. Open your Mobile App and Log In'
            />
          </Instruction>
          <Instruction>
            <FormattedMessage
              id='scenes.mobilelogin.tapwebstep2'
              defaultMessage='2. Tap "Pair Web Wallet" from the side navigiation.'
            />
          </Instruction>
          <Instruction>
            <FormattedMessage
              id='scenes.mobilelogin.showqrstep3'
              defaultMessage='3. Tap "Show QR Code"'
            />
          </Instruction>
          <Instruction>
            <FormattedMessage
              id='scenes.mobilelogin.scanstep4'
              defaultMessage='4. Scan your QR code here'
            />
          </Instruction>
        </InstructionsContainer>
      </Container>
      <LinkContainer to='/login'>
        <Button
          data-e2e='backToLogin'
          type='submit'
          nature='primary'
          fullwidth
          height='56px'
        >
          <Text color='white' size='16px' weight={600} onClick={close}>
            <FormattedMessage id='buttons.back' defaultMessage='Back' />
          </Text>
        </Button>
      </LinkContainer>
    </Wrapper>
  )
}

export default MobileLogin
