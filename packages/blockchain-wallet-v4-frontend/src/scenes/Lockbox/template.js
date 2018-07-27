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
    xpubInfo,
    getDeviceInfo,
    deviceInfo,
    deriveXpubs,
    launchCarbonSetup,
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
        <Button nature='primary' onClick={launchCarbonSetup}>
          <FormattedMessage
            id='scenes.lockbox.welcome.setupcarbon'
            defaultMessage='Setup Carbon'
          />
        </Button>
        <Button nature='secondary' onClick={getDeviceInfo}>
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

      {deviceInfo.btc && (
        <div style={{ marginTop: '25px' }}>
          <Text size='18px' weight={300}>
            Carbon BTC Information:
          </Text>
          <Text size='12px' weight={300}>
            publicKey: {deviceInfo.btc.publicKey}
          </Text>
          <Text size='12px' weight={300}>
            bitcoinAddress: {deviceInfo.btc.bitcoinAddress}
          </Text>
          <Text size='12px' weight={300}>
            chainCode: {deviceInfo.btc.chainCode}
          </Text>
        </div>
      )}

      {deviceInfo.eth && (
        <div style={{ marginTop: '25px' }}>
          <Text size='18px' weight={300}>
            Carbon ETH Information:
          </Text>
          <Text size='12px' weight={300}>
            publicKey: {deviceInfo.eth.publicKey}
          </Text>
          <Text size='12px' weight={300}>
            bitcoinAddress: {deviceInfo.eth.bitcoinAddress}
          </Text>
          <Text size='12px' weight={300}>
            chainCode: {deviceInfo.eth.chainCode}
          </Text>
        </div>
      )}

      {(deviceInfo.btc || deviceInfo.eth) && (
        <div style={{ marginTop: '25px' }}>
          <Button nature='primary' onClick={deriveXpubs}>
            Derive xpubs
          </Button>
        </div>
      )}

      {xpubInfo && (
        <div style={{ marginTop: '25px' }}>
          <Text size='18px' weight={300}>
            Carbon xpub Information:
          </Text>
          <Text size='12px' weight={300}>
            BTC: {xpubInfo.btc.xpub}
          </Text>
          <Text size='12px' weight={300}>
            ETH: {xpubInfo.eth.xpub}
          </Text>
        </div>
      )}

      {xpubInfo && (
        <div style={{ marginTop: '25px' }}>
          <Text size='18px' weight={500} uppercase>
            These addresses should match above addresses returned from ledger.
            Otherwise we are deriving them incorrectly! Verify eth on
            https://iancoleman.io/bip39/ by entering your mnemonic, changing
            coin to eth, and using bip44 derivation path.
          </Text>
          <Text size='12px' weight={300}>
            BTC: {xpubInfo.btc.addr}
          </Text>
          <Text size='12px' weight={300}>
            ETH: {xpubInfo.eth.addr}
          </Text>
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
