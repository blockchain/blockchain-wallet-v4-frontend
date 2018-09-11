import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
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

const ExchangeResults = ({
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
    <ModalHeader>
      <FormattedMessage
        id='scenes.exchange.exchangeform.result.title'
        defaultMessage='Awaiting funds'
      />
    </ModalHeader>
    <ModalBody>
      <Note>
        <FormattedMessage
          id='scenes.exchange.exchangeform.results.thanks'
          defaultMessage='Thanks for placing your trade!'
        />
        <b>
          <FormattedMessage
            id='scenes.exchange.exchangeform.results.timeframe'
            defaultMessage='Funds will usually reach your wallet within 2 hours and we’ll send you a notification when that happens.'
          />
        </b>
        <FormattedMessage
          id='scenes.exchange.exchangeform.results.history'
          defaultMessage='Keep track of your trade’s progress in the Order History tab.'
        />
      </Note>
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

export default modalEnhancer(model.components.exchange.RESULTS_MODAL)(
  ExchangeResults
)
