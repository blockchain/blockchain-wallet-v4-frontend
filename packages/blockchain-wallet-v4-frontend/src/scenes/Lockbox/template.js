import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Button, FlatLoader } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
`

const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 25px;
`

const Lockbox = props => {
  const {
    getBtcAddress,
    deviceInfo,
    deriveXpubs,
    launchCarbonSetup,
    connected,
    connecting,
    error
  } = props

  return (
    <Wrapper>
      <div>
        <Text size='26px' weight={600}>
          <FormattedMessage
            id='scenes.lockbox.welcome.title'
            defaultMessage='Hardware secured digital assets'
          />
        </Text>
      </div>
      <div style={{ marginTop: '15px' }}>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='scenes.lockbox.welcome.subtitle'
            defaultMessage='Lockbox works with Carbon to give your digital assets an additional layer of security. Unlock your Lockbox by linking your Carbon, or buying one today.'
          />
        </Text>
      </div>
      <Buttons>
        <Button nature='secondary'>
          <FormattedMessage
            id='scenes.lockbox.welcome.buycarbon'
            defaultMessage='Buy a Carbon'
          />
        </Button>
        <Button nature='primary'>
          <FormattedMessage
            id='scenes.lockbox.welcome.getstarted'
            onClick={launchCarbonSetup}
            defaultMessage='Setup Carbon'
          />
        </Button>
        <Button nature='secondary' onClick={getBtcAddress}>
          <FormattedMessage
            id='scenes.lockbox.welcome.linkcarbon'
            defaultMessage='Show Carbon Info'
          />
        </Button>
      </Buttons>

      {connecting && (
        <div style={{ marginTop: '25px' }}>
          <Text size='14px' weight={300}>
            Attempting to contact device. Please plug in device and enter BTC
            app now.
          </Text>
          <FlatLoader
            style={{ marginTop: '15px' }}
            width='100px'
            height='22px'
          />
        </div>
      )}

      {connected &&
        deviceInfo && (
          <div style={{ marginTop: '25px' }}>
            <div>publicKey: {deviceInfo.publicKey}</div>
            <div>bitcoinAddress: {deviceInfo.bitcoinAddress}</div>
            <div>chainCode: {deviceInfo.chainCode}</div>

            <div style={{ marginTop: '25px' }}>
              <Button nature='primary' onClick={deriveXpubs}>
                Derive xpubs
              </Button>
            </div>
          </div>
        )}

      {error && (
        <div style={{ marginTop: '25px' }}>
          <Text size='18px' weight={300}>
            Error Contacting Device:
          </Text>
          <Text size='14px' weight={300}>
            {error.name}: {error.message}
          </Text>
        </div>
      )}
    </Wrapper>
  )
}

export default Lockbox
