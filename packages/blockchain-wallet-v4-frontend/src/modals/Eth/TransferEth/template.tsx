import React from 'react'
import { FormattedMessage } from 'react-intl'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import {
  Button,
  HeartbeatLoader,
  Modal,
  ModalBody,
  ModalHeader,
  Text,
  TextGroup
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Form } from 'components/Form'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin: 20px 0 10px;
  background-color: ${props => props.theme.grey000};
  border: 1px solid ${props => props.theme.grey200};
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

const TransferEth = (props: InjectedFormProps<{}, Props> & Props) => {
  const { ethAddr, ethBalance, handleSubmit, legacyEthAddr, txFee } = props

  return (
    <Modal size='medium'>
      <ModalHeader closeButton={false}>
        <FormattedMessage
          id='modals.transfereth.title1'
          defaultMessage='Updating Ethereum Address'
        />
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <TextGroup inline>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.transfereth.para1_new'
                defaultMessage='As we leave our beta program we want to make sure your Secret Private Key Recovery Phrase is compatible with other Ethereum wallets.'
              />
            </Text>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.transfereth.para2'
                defaultMessage="Because of this, we've updated your Ethereum address and are requiring a transfer of your funds."
              />
            </Text>
            <Text size='14px' weight={400}>
              <FormattedMessage
                id='modals.transfereth.para3'
                defaultMessage="Don't worry, your old address is still valid."
              />
            </Text>
          </TextGroup>
          <Container>
            <Row>
              <Text size='14px' weight={600}>
                <FormattedMessage id='copy.from:' defaultMessage='From: ' />
              </Text>
              <Text size='14px' weight={400}>
                {legacyEthAddr}
              </Text>
            </Row>
            <Row>
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='modals.transfereth.to'
                  defaultMessage='To:'
                />
              </Text>
              <Text size='14px' weight={400}>
                {ethAddr}
              </Text>
            </Row>
            <Row>
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='modals.transfereth.amount'
                  defaultMessage='Amount:'
                />
              </Text>
              <CoinDisplay size='14px' coin='ETH' weight={400}>
                {ethBalance}
              </CoinDisplay>
            </Row>
            <Row>
              <Text size='14px' weight={600}>
                <FormattedMessage
                  id='modals.transfereth.txfee'
                  defaultMessage='Transaction Fee:'
                />
              </Text>
              <CoinDisplay size='14px' coin='ETH' weight={400}>
                {txFee}
              </CoinDisplay>
            </Row>
          </Container>
          <Button
            data-e2e='transferEth'
            nature='primary'
            fullwidth
            type='submit'
            disabled={props.submitting}
          >
            {props.submitting ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='modals.transfereth.confirm1'
                defaultMessage='Transfer Funds'
              />
            )}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  )
}

type Props = {
  ethAddr: string
  ethBalance: string
  legacyEthAddr: string
  txFee: string
}

export default reduxForm<{}, Props>({ form: 'transferEth' })(TransferEth)
