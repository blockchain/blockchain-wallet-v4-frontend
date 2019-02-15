import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import QRCodeWrapper from 'components/QRCodeWrapper'

import {
  Banner,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text
} from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`
const XPubText = styled(Text)`
  background-color: ${props => props.theme['white-blue']};
  padding: 25px;
  margin-bottom: 20px;
  word-break: break-all;
  width: 80%;
`
const WarningBanner = styled(Banner)`
  margin-bottom: 25px;
`

class ShowXPubContainer extends Component {
  render () {
    const { position, closeAll, total, xpub } = this.props

    return (
      <Modal size='large' position={position} total={total}>
        <ModalHeader icon='lock' onClose={closeAll}>
          <FormattedMessage
            id='modals.wallet.showxpub.title'
            defaultMessage='Extended Public Key'
          />
        </ModalHeader>
        <ModalBody>
          <WarningBanner type='warning'>
            <Text size='13px' color='error'>
              <FormattedMessage
                id='modals.wallet.showxpub.warning'
                defaultMessage="Don't share your Extended Public Key (xPub) with an untrusted source. Anyone with access to this key can keep track of your payments and may be able to disrupt access to your wallet."
              />
            </Text>
          </WarningBanner>
          <Content>
            <XPubText size='12px' weight='300' data-e2e='walletXpub'>
              {xpub}
            </XPubText>
            <QRCodeWrapper
              value={xpub}
              size={150}
              data-e2e='walletXpubQrCode'
            />
          </Content>
        </ModalBody>
        <ModalFooter align='right'>
          <Button
            nature='primary'
            onClick={closeAll}
            data-e2e='closeShowXpubModalButton'
          >
            <FormattedMessage
              id='modals.wallet.showxpub.close'
              defaultMessage='Close'
            />
          </Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default modalEnhancer('ShowXPub')(ShowXPubContainer)
