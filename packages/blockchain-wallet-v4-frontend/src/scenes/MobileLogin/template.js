import { Button, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Wrapper } from 'components/Public'
import PropTypes from 'prop-types'
import QRReader from 'components/QRReader'
import React from 'react'
import styled from 'styled-components'

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
  const { position, total, close, closeAll, ...rest } = props
  const { handleScan, handleError } = rest

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
          <QRReader onScan={handleScan} onError={handleError} />
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
        <Button type='submit' nature='primary' fullwidth height='56px'>
          <Text color='white' size='16px' weight={600} onClick={close}>
            <FormattedMessage
              id='scenes.mobilelogin.back'
              defaultMessage='Back'
            />
          </Text>
        </Button>
      </LinkContainer>
    </Wrapper>
  )
}

MobileLogin.propTypes = {
  handleScan: PropTypes.func.isRequired,
  handleError: PropTypes.func.isRequired
}

export default MobileLogin
