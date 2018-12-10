import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import QRCodeReact from 'qrcode.react'

import {
  Banner,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text
} from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
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

const ShowXPubTemplate = ({ position, total, closeAll, xpub }) => (
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
      <Wrapper>
        <XPubTextWrapper>
          <XPubText size='12px' weight='300'>
            {xpub}
          </XPubText>
        </XPubTextWrapper>
        <QRCodeReact value={xpub} size={100} />
      </Wrapper>
    </ModalBody>
    <ModalFooter align='right'>
      <Button nature='primary' onClick={closeAll}>
        <FormattedMessage
          id='modals.wallet.showxpub.close'
          defaultMessage='Close'
        />
      </Button>
    </ModalFooter>
  </Modal>
)

export default ShowXPubTemplate
