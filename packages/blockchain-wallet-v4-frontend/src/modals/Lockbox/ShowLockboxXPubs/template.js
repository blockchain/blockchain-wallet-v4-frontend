import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import QRCodeReact from 'qrcode.react'
import { FormattedMessage } from 'react-intl'

import {
  Banner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Button
} from 'blockchain-info-components'

const CoinName = styled(Text)`
  margin-bottom: 5px;
`
const CoinRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
const XPubTextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 120px;
  min-height: 120px;
  margin-right: 20px;
`
const WarningBanner = styled(Banner)`
  margin-bottom: 25px;
`
const XPubText = styled(Text)`
  background-color: ${props => props.theme['white-blue']};
  padding: 25px 15px 0;
  margin-bottom: 20px;
  color: #4b4d4e;
  word-break: break-all;
`

const PromptLockbox = props => {
  const { btcXPub, bchXPub, closeAll, position, total } = props

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader icon='lock' onClose={closeAll}>
        <FormattedMessage
          id='modals.lockbox.showxpubs.title'
          defaultMessage='Lockbox Extended Public Keys'
        />
      </ModalHeader>
      <ModalBody>
        <WarningBanner type='warning'>
          <Text size='13px' color='error'>
            <FormattedMessage
              id='modals.lockbox.showxpubs.warning'
              defaultMessage="Don't share your Extended Public Keys (xPubs) with an untrusted source. Anyone with access to these can keep track of your payments and may be able to disrupt access to your wallet."
            />
          </Text>
        </WarningBanner>
        <CoinName>Bitcoin (BTC)</CoinName>
        <CoinRow style={{ marginBottom: '20px' }}>
          <XPubTextWrapper>
            <XPubText size='12px' weight='300'>
              {btcXPub}
            </XPubText>
          </XPubTextWrapper>
          <QRCodeReact value={btcXPub} size={100} />
        </CoinRow>
        <CoinName>Bitcoin Cash (BCH)</CoinName>
        <CoinRow>
          <XPubTextWrapper>
            <XPubText size='12px' weight='300'>
              {bchXPub}
            </XPubText>
          </XPubTextWrapper>
          <QRCodeReact value={bchXPub} size={100} />
        </CoinRow>
      </ModalBody>
      <ModalFooter align='right'>
        <Button nature='primary' onClick={closeAll}>
          <FormattedMessage
            id='modals.lockbox.showxpubs.close'
            defaultMessage='Close'
          />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

PromptLockbox.propTypes = {
  coin: PropTypes.string
}

export default PromptLockbox
