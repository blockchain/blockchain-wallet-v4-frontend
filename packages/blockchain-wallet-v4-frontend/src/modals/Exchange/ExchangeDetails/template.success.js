import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  TooltipIcon,
  TooltipHost
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
  border: 1px solid ${props => props.theme['gray-2']};
  background-color: ${props => props.theme['white-blue']};
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
  border-bottom: 1px solid ${props => props.theme['gray-2']};

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
          id='modals.exchangedetails.title.success'
          defaultMessage='Exchange Completed'
        />
      )
    case 'resolved':
      return (
        <FormattedMessage
          id='modals.exchangedetails.title.refunded'
          defaultMessage='Trade Refunded'
        />
      )
    case 'failed':
      return (
        <FormattedMessage
          id='modals.exchangedetails.title.failed'
          defaultMessage='Trade Failed'
        />
      )
    default:
      return (
        <FormattedMessage
          id='modals.exchangedetails.title.inprogress'
          defaultMessage='Exchange in Progress'
        />
      )
  }
}

const ExchangeDetails = props => {
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
        <Text size='20px' weight={300} capitalize>
          {getModalHeader(status)}
        </Text>
      </ModalHeader>
      <ModalBody>
        <ExchangeTimeline status={status} />
        {status === 'complete' && (
          <Notice>
            <Text size='13px' weight={300}>
              <FormattedMessage
                id='modals.exchangedetails.explain'
                defaultMessage='Your exchange is complete.'
              />
              <span>&nbsp;</span>
              <FormattedMessage
                id='modals.exchangedetails.explain2'
                defaultMessage='It may take a few minutes for the funds to show in your balance.'
              />
            </Text>
          </Notice>
        )}
        <Table>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage
                  id='modals.exchangedetails.deposited'
                  defaultMessage='{coin} Deposited'
                  values={{ coin: sourceCoin }}
                />
              </Text>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={300} uppercase>
                {`${depositAmount} ${sourceCoin}`}
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage
                  id='modals.exchangedetails.received'
                  defaultMessage='{coin} to be Received'
                  values={{ coin: targetCoin }}
                />
              </Text>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={300} uppercase>
                {`${withdrawalAmount} ${targetCoin}`}
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage
                  id='modals.exchangedetails.exchangerate'
                  defaultMessage='Exchange rate'
                />
              </Text>
              <TooltipHost id='exchangedetails.exchangetooltip'>
                <TooltipIcon name='question-in-circle' />
              </TooltipHost>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={300} uppercase>
                {`1 ${sourceCoin} = ${quotedRate} ${targetCoin}`}
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage
                  id='modals.exchangedetails.fee'
                  defaultMessage='Transaction fee'
                />
              </Text>
              <TooltipHost id='exchangedetails.feetooltip'>
                <TooltipIcon name='question-in-circle' />
              </TooltipHost>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={300} uppercase>
                {`${minerFee} ${targetCoin}`}
              </Text>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Text size='13px' weight={400} capitalize>
                <FormattedMessage
                  id='modals.exchangedetails.orderid'
                  defaultMessage='Order ID'
                />
              </Text>
            </TableCell>
            <TableCell>
              <Text size='13px' weight={300}>
                SFT-
                {orderId}
              </Text>
            </TableCell>
          </TableRow>
        </Table>
      </ModalBody>
      <ModalFooter align='right'>
        <Button nature='primary' size='13px' weight={300} onClick={close}>
          <FormattedMessage
            id='modals.exchange.exchangedetails.close'
            defaultMessage='Close'
          />
        </Button>
      </ModalFooter>
    </Modal>
  )
}

ExchangeDetails.propTypes = {
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

export default ExchangeDetails
