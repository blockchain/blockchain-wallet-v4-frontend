import React from 'react'
import styled from 'styled-components'
// import { reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Text, Modal, ModalHeader, ModalBody } from 'blockchain-info-components'
import { Form } from 'components/Form'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import ComboDisplay from 'components/Display/ComboDisplay'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;

  & > * { width: 150px; }
  & > :last-child { width: 100%; }
`
const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme['gray-1']};
  padding: 10px 0;
  margin: 5px 0;
  margin-bottom: 25px;
  
  & > * { padding: 10px 0; }
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  & > :first-child { margin-bottom: 5px; }
`

const SendConfirm = props => {
  const { previousStep, handleSubmit, message, coin, data, sendData } = props
  const { satoshis, fee } = data
  const toAddress = sendData.data.data.to
  const fromAddress = sendData.data.data.from.label

  return (
    <Modal size='large' position={1} total={props.total} >
      <ModalHeader icon='send' onClose={props.closeAll}>
        {coin === 'BTC' && <FormattedMessage id='modals.sendconfirm.title' defaultMessage='Send Bitcoin' />}
        {coin === 'ETH' && <FormattedMessage id='modals.sendconfirm.title' defaultMessage='Send Ether' />}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendconfirm.from' defaultMessage='From:' />
          </Text>
          <Text size='16px' weight={300}>{fromAddress}</Text>
        </Row>
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendconfirm.to' defaultMessage='To:' />
          </Text>
          <Text size='16px' weight={300}>{toAddress}</Text>
        </Row>
        {message &&
          <Row>
            <Text size='16px' weight={500}>
              <FormattedMessage id='modals.sendconfirm.for' defaultMessage='For:' />
            </Text>
            <Text size='16px' weight={300}>{message}</Text>
          </Row>
        }
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendconfirm.payment' defaultMessage='Payment:' />
          </Text>
          <Text size='16px' weight={300}>
            <ComboDisplay coin='BTC'>{satoshis}</ComboDisplay>
          </Text>
        </Row>
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage id='modals.sendconfirm.fee' defaultMessage='Fee:' />
          </Text>
          <Text size='16px' weight={300}>
            <ComboDisplay coin='BTC'>{fee}</ComboDisplay>
          </Text>
        </Row>
        <Summary>
          <Text size='16px' weight={300} color='transferred'>
            <FormattedMessage id='modals.sendconfirm.total' defaultMessage='Total' />
          </Text>
          <CoinDisplay coin='BTC' size='30px' weight={600} color='transferred'>{satoshis}</CoinDisplay>
          <FiatDisplay coin='BTC' size='20px' weight={300} color='transferred'>{satoshis + fee}</FiatDisplay>
        </Summary>
        <Footer>
          <Button onClick={handleSubmit} nature='primary' fullwidth uppercase>
            <FormattedMessage id='modals.sendconfirm.send' defaultMessage='Send bitcoin' />
          </Button>
          <Link onClick={previousStep} size='13px' weight={300}>
            <FormattedMessage id='scenes.sendconfirm.back' defaultMessage='Go back' />
          </Link>
        </Footer>
      </ModalBody>
    </Modal>
  )
}

export default SendConfirm
