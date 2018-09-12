import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { contains } from 'ramda'

import modalEnhancer from 'providers/ModalEnhancer'
import { model } from 'data'

import {
  ExchangeText,
  ExchangeAmount,
  AmountHeader,
  Delimiter,
  TableRow,
  Note
} from 'components/Exchange'
import { OrderStatus } from 'components/OrderStatus'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'blockchain-info-components'

const ExchangeResultsFooter = styled(ModalFooter)`
  > div {
    justify-content: center;
  }
`

const { RESULTS_MODAL, INCOMPLETE_STATES } = model.components.exchangeHistory

const ExchangeResults = ({
  status,
  position,
  total,
  close,
  sourceCoin,
  targetCoin,
  sourceAmount,
  targetAmount,
  targetFiat,
  currency,
  fee
}) => (
  <Modal size='small' position={position} total={total}>
    <ModalHeader onClose={close}>
      <OrderStatus status={status} />
    </ModalHeader>
    <ModalBody>
      {contains(status, INCOMPLETE_STATES) && (
        <Note>
          <FormattedMessage
            id='scenes.exchange.exchangeform.results.thanks'
            defaultMessage='Thanks for placing your trade!'
          />
          &nbsp;
          <b>
            <FormattedMessage
              id='scenes.exchange.exchangeform.results.timeframe'
              defaultMessage='Funds will usually reach your wallet within 2 hours and we’ll send you a notification when that happens.'
            />
          </b>
          &nbsp;
          <FormattedMessage
            id='scenes.exchange.exchangeform.results.history'
            defaultMessage='Keep track of your trade’s progress in the Order History tab.'
          />
        </Note>
      )}
      <AmountHeader>
        <FormattedMessage
          id='scenes.exchange.exchangeform.results.exchange'
          defaultMessage='Exchange {coin}'
          values={{
            coin: sourceCoin
          }}
        />
      </AmountHeader>
      <ExchangeAmount>{`${sourceAmount} ${sourceCoin}`}</ExchangeAmount>
      <AmountHeader>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.receive'
          defaultMessage='Receive {coin}'
          values={{
            coin: targetCoin
          }}
        />
      </AmountHeader>
      <ExchangeAmount>{`${targetAmount} ${targetCoin}`}</ExchangeAmount>
      <Delimiter />
      <TableRow>
        <ExchangeText>
          <FormattedMessage
            id='scenes.exchange.exchangeform.results.value'
            defaultMessage='Total Value'
          />
        </ExchangeText>
        <ExchangeText
          weight={300}
        >{`~ ${targetFiat} ${currency}`}</ExchangeText>
      </TableRow>
      <TableRow>
        <ExchangeText>
          <FormattedMessage
            id='scenes.exchange.exchangeform.summary.fee'
            defaultMessage='Network Fee'
          />
        </ExchangeText>
        <ExchangeText weight={300}>{`${fee} ${targetCoin}`}</ExchangeText>
      </TableRow>
    </ModalBody>
    <ExchangeResultsFooter>
      <Button nature='primary' size='13px' weight={300} onClick={close}>
        <FormattedMessage
          id='modals.exchangedetails.close'
          defaultMessage='Close'
        />
      </Button>
    </ExchangeResultsFooter>
  </Modal>
)

export default modalEnhancer(RESULTS_MODAL)(ExchangeResults)
