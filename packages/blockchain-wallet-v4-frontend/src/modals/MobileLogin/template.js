import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QrReader from 'react-qr-reader'

import { Badge, Modal, Separator, Text } from 'blockchain-info-components'

const DELAY = 100

const QRCodeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  width: 80%;
  padding: 30px 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Footer = styled.div`
  padding: 5px 0;
`
const QrCodeReader = styled(QrReader)`
  width: 100%;
  height: 100%;

  & > * { width: 100%; }
`

const Instructions = styled.ol`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
`

const BadgesText = styled(Text)`
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  flex-direction: column;
`

const Badges = styled.div`
  display: flex;
  justify-content: flex-end;
  align-content: flex-end;
`

const MobileLogin = ({ handleScan, handleError, ...rest }) => (
  <Modal {...rest} title='Log in via Mobile' size='large'>
    <Text size='14px' weight={300}>
      <FormattedMessage id='modals.mobilelogin.headline' defaultMessage='Follow these steps to log into your web wallet using your mobile device' />
    </Text>
    <Content>
      <QRCodeContainer>
        <QrCodeReader delay={DELAY} onScan={handleScan} onError={handleError} />
      </QRCodeContainer>
      <Text size='14px' weight={300}>
        <Instructions>
          <Text size='16px' weight={300} color='brand-primary'>
            <FormattedMessage id='modals.mobilelogin.login' defaultMessage='Logging in with Mobile' />
          </Text>
          <li>
            <FormattedMessage id='modals.mobilelogin.openapp' defaultMessage='Open your Blockchain App on your mobile device and go to Settings.' />
          </li>
          <li>
            <FormattedMessage id='modals.mobilelogin.tapweb' defaultMessage='Tap Log in to Web Wallet.' />
          </li>
          <li>
            <FormattedMessage id='modals.mobilelogin.usecamera' defaultMessage='Using your computer s camera, scan the QR code that appears on your device.' />
          </li>
        </Instructions>
      </Text>
    </Content>
    <Separator />
    <Footer>
      <Content>
        <BadgesText size='14px' weight={300}>
          <FormattedMessage id='modals.mobilelogin.noapp' defaultMessage='Dont have the App?' />
          <FormattedMessage id='modals.mobilelogin.download' defaultMessage='Download it here' />
        </BadgesText>
        <Badges>
          <Badge type='applestore' />
          <Badge type='googleplay' />
        </Badges>
      </Content>
    </Footer>
  </Modal>
)

MobileLogin.propTypes = {
  handleScan: PropTypes.func.isRequired,
  handleError: PropTypes.func
}

export default MobileLogin
