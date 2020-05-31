import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import ExchangeTimeline from 'components/ExchangeTimeline'

const Notice = styled.div`
  width: 100%;
  margin-bottom: 10px;
`
const Table = styled.div`
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme.grey200};
  background-color: ${props => props.theme.grey000};
  & > :last-child {
    border-bottom: none;
  }
`
const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.grey200};

  > :first-child {
    margin-right: 5px;
  }
`
const TableCell = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > :first-child {
    margin-right: 5px;
  }
`

const getModalHeader = status => {
  switch (status) {
    case 'complete':
      return (
        <FormattedMessage
          id='modals.exchange.shapeshifttradedetails.title.success'
          defaultMessage='Exchange Completed'
        />
      )
    case 'resolved':
      return (
        <FormattedMessage
          id='modals.exchange.shapeshifttradedetails.title.refunded'
          defaultMessage='Trade Refunded'
        />
      )
    case 'failed':
      return (
        <FormattedMessage
          id='modals.exchange.shapeshifttradedetails.title.failed'
          defaultMessage='Trade Failed'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.exchanged.shapeshifttradedetails.title.inprogress'
          defaultMessage='Exchange in Progress'
        />
      )
  }
}

const ShapeshiftTradeDetails = props => {
  const { position, total, close, ...rest } = props
  const {
    status,
    sourceCoin,
    targetCoin,
    quotedRate,
    minerFee,
    orderId,
    depositAmount,
    withdrawalAmount
  } = rest

  return (
    <Modal size='large' position={position} total={total}>
      <ModalHeader closeButton={false}>
        <Text size='20px' weight={400} capitalize>
          {getModalHeader(status)}
        </Text>
      </ModalHeader>
      <ModalBody>
        <ExchangeTimeline status={status} />
        {status === 'complete' && (
          <Notice>
            <Text size='13px' weight={400}>
              <FormattedMessage
                id='modals.exchange.shapeshifttradedetails.explain'
                defaultMessage='Your exchange is complete.'
              />
              <span>&nbsp;</span>
              <FormattedMessage
                id='modals.exchange.shapeshifttradedetails.explain2'
                defaultMessage='It may take a few minutes for the funds to show in your balance.'
              />
            </Text>
          </Notice>
        )}
        <Table>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage
                  id='modals.exchange.shapeshifttradedetails.deposited'
                  defaultMessage='{coin} Deposited'
                  values={{ coin: sourceCoin }}
                />
              </Text>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={400} uppercase>
                {`${depositAmount} ${sourceCoin}`}
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage
                  id='modals.exchange.shapeshifttradedetails.received'
                  defaultMessage='{coin} to be Received'
                  values={{ coin: targetCoin }}
                />
              </Text>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={400} uppercase>
                {`${withdrawalAmount} ${targetCoin}`}
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage
                  id='modals.exchange.shapeshifttradedetails.exchangerate'
                  defaultMessage='Exchange rate'
                />
              </Text>
              <TooltipHost id='exchangedetails.exchangetooltip'>
                <TooltipIcon name='info' />
              </TooltipHost>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={400} uppercase>
                {`1 ${sourceCoin} = ${quotedRate} ${targetCoin}`}
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage
                  id='modals.exchange.shapeshifttradedetails.fee'
                  defaultMessage='Transaction fee'
                />
              </Text>
              <TooltipHost id='exchangedetails.feetooltip'>
                <TooltipIcon name='info' />
              </TooltipHost>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={400} uppercase>
                {`${minerFee} ${targetCoin}`}
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={500} capitalize>
                <FormattedMessage
                  id='modals.exchange.shapeshifttradedetails.orderid'
                  defaultMessage='Order ID'
                />
              </Text>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={400}>
                SFT-
                {orderId}
              </Text>
            </TableCell>
          </TableRow>
        </Table>
      </ModalBody>
      <ModalFooter align='right'>
        <Button nature='primary' size='13px' weight={400} onClick={close}>
          <FormattedMessage id='buttons.close' defaultMessage='Close' />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ShapeshiftTradeDetails.propTypes = {
  status: PropTypes.string.isRequired,
  sourceCoin: PropTypes.string.isRequired,
  targetCoin: PropTypes.string.isRequired,
  quotedRate: PropTypes.string.isRequired,
  minerFee: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired,
  depositAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  withdrawalAmount: PropTypes.string.isRequired
}

export default ShapeshiftTradeDetails
