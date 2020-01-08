import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import {
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'
import styled from 'styled-components'

const Group = styled.div`
  margin-bottom: 20px;
`
const GroupHeader = styled(Text)`
  font-size: 16px;
  font-weight: 600;
`
const GroupContent = styled(Text)`
  font-size: 13px;
  font-weight: 500;
`

const HeaderLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
`

function BitPayInfo ({ coin, modalActions, previousModal, close }) {
  return (
    <Modal>
      <ModalHeader closeButton={false}>
        <HeaderLink size='20px' color='brand-primary' onClick={close}>
          <Icon name='left-arrow' />
          Back
        </HeaderLink>
      </ModalHeader>
      <ModalBody>
        <Group>
          <GroupHeader>What is BitPay?</GroupHeader>
          <GroupContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </GroupContent>
        </Group>
        <Group>
          <GroupHeader>How does it work?</GroupHeader>
          <GroupContent>
            Simply copy the address provided by the merchant and paste it in the
            To field in the previous screen. Amount, Description and Network
            fees will be auto populated for you.
          </GroupContent>
        </Group>
        <Group>
          <GroupHeader>What do invoices look like?</GroupHeader>
          <GroupContent>
            Addresses for BitPay payments always start with this prefix:
            bitcoincash:?r=https://bitpay.com Always double check you are using
            a bitcoin cash address, and not a bitcoin one.
          </GroupContent>
        </Group>
        <Group>
          <GroupHeader>Where can I get more information?</GroupHeader>
          <GroupContent>
            More information is available{' '}
            <Link
              size='14px'
              weight={500}
              href='https://support.blockchain.com/hc/en-us/sections/360006488871-Paying-BitPay-Invoices'
              target='_blank'
              rel='noopener noreferrer'
            >
              here.
            </Link>
          </GroupContent>
        </Group>
      </ModalBody>
    </Modal>
  )
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer('BitPayInfo'),
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(BitPayInfo)
