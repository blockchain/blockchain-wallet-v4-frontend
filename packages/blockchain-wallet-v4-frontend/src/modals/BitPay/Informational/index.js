import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import styled from 'styled-components'

import {
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalHeader,
  Text
} from 'blockchain-info-components'
import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

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
const ExampleInvoice = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  align-content: center;
  margin-top: 1px;
`

function BitPayInformational({ close }) {
  return (
    <Modal>
      <ModalHeader closeButton={false}>
        <HeaderLink size='20px' color='brand-primary' onClick={close}>
          <Icon
            color='brand-primary'
            name='arrow-left'
            style={{ marginRight: '8px' }}
            size='22px'
          />
          <FormattedMessage id='buttons.back' defaultMessage='Back' />
        </HeaderLink>
      </ModalHeader>
      <ModalBody>
        <Group>
          <GroupHeader>
            <FormattedMessage
              id='modals.bitpay.info.whatis.title'
              defaultMessage='What is BitPay?'
            />
          </GroupHeader>
          <GroupContent>
            <FormattedMessage
              id='modals.bitpay.info.whatis.answer'
              defaultMessage='BitPay is a cryptocurrency payment service provider that provides payment processing services for merchants. Completing payments using their provided service allows for payments to be secure, easily verifiable and refundable.'
            />
          </GroupContent>
        </Group>
        <Group>
          <GroupHeader>
            <FormattedMessage
              id='modals.bitpay.info.how.title'
              defaultMessage='How does it work?'
            />
          </GroupHeader>
          <GroupContent>
            <FormattedMessage
              id='modals.bitpay.info.how.answer1'
              defaultMessage='Simply copy the invoice url provided by the merchant and paste it in the'
            />
            <b>
              {' '}
              <FormattedMessage
                id='modals.bitpay.info.how.answer2'
                defaultMessage='To'
              />{' '}
            </b>
            <FormattedMessage
              id='modals.bitpay.info.how.answer3'
              defaultMessage='field in the previous screen. The Amount, Description and Network Fees fields will then be auto populated for you.'
            />
          </GroupContent>
        </Group>
        <Group>
          <GroupHeader>
            <FormattedMessage
              id='modals.bitpay.info.invoices.title'
              defaultMessage='What do invoices look like?'
            />
          </GroupHeader>
          <GroupContent>
            <FormattedMessage
              id='modals.bitpay.info.invoices.answer1'
              defaultMessage='BitPay invoices always start with a coin prefix followed by the invoice url. An invoice will look similar to the following:'
            />
            <ExampleInvoice>
              <b>bitcoin:?r=https://bitpay.com/invoice?id=123</b>
            </ExampleInvoice>
          </GroupContent>
        </Group>
        <Group>
          <GroupHeader>
            <FormattedMessage
              id='modals.bitpay.info.where.title'
              defaultMessage='Where can I get more information?'
            />
          </GroupHeader>
          <GroupContent>
            <FormattedMessage
              id='modals.bitpay.info.where.answer1'
              defaultMessage='More information is available'
            />{' '}
            <Link
              size='14px'
              weight={500}
              href='https://support.blockchain.com/hc/en-us/sections/360006488871-Paying-BitPay-Invoices'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FormattedMessage
                id='modals.bitpay.info.where.answer2'
                defaultMessage='here.'
              />
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
  modalEnhancer('BitPayInformational'),
  connect(undefined, mapDispatchToProps)
)

export default enhance(BitPayInformational)
