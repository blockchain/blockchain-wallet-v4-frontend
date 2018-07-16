import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Modal, ModalHeader, ModalBody, Text, TextGroup } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 10px 0;
  background-color: ${props => props.theme['gray-1']};
  border: 1px solid ${props => props.theme['gray-2']};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
`

const Success = (props) => {
  const { position, total, loading, ...rest } = props
  const { handleSubmit, from, val } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <FormattedMessage id='modals.transfereth.title' defaultMessage='Your Ether Address' />
      </ModalHeader>
      <ModalBody loading={loading}>
        <TextGroup inline>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.transfereth.beta' defaultMessage='As we leave our beta program we want to make sure your backup phrase is compatible with other ether wallets.' />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.transfereth.updated' defaultMessage="Because of this, we've updated your ether address and are requiring a transfer of your funds." />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='modals.transfereth.old' defaultMessage="Don't worry, your old address is still valid." />
          </Text>
        </TextGroup>
        <Container>
          <Row>
            <Text size='14px' weight={500}>
              <FormattedMessage id='modals.transfereth.label1' defaultMessage='Send ETH From:' />
            </Text>
            <Text size='14px' weight={300}>
              {from}
            </Text>
          </Row>
          <Row>
            <Text size='14px' weight={500}>
              <FormattedMessage id='modals.transfereth.label2' defaultMessage='To:' />
            </Text>
            <Text size='14px' weight={300}>
              {val.to}
            </Text>
          </Row>
          <Row>
            <Text size='14px' weight={500}>
              <FormattedMessage id='modals.transfereth.label3' defaultMessage='Amount:' />
            </Text>
            <CoinDisplay size='14px' coin='ETH'>{val.effectiveBalance}</CoinDisplay>
          </Row>
          <Row>
            <Text size='14px' weight={500}>
              <FormattedMessage id='modals.transfereth.label4' defaultMessage='Transaction Fee:' />
            </Text>
            <CoinDisplay size='14px' coin='ETH'>{val.fee}</CoinDisplay>
          </Row>
        </Container>
        <Button nature='primary' fullwidth uppercase onClick={handleSubmit}>
          <FormattedMessage id='modals.transfereth.confirm' defaultMessage='Confirm' />
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default Success
