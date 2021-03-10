import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  CollateralAmt,
  Status
} from 'blockchain-wallet-v4-frontend/src/scenes/Borrow/BorrowHistory/model'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { OfferType } from 'blockchain-wallet-v4/src/types'
import CoinDisplay from 'components/Display/CoinDisplay'
import { model } from 'data'
import {
  isLastTxStatus,
  showBorrowSummary,
  showCollateralizationStatus
} from 'data/components/borrow/model'

import { TableRow, Title, Value } from '../../components'
import { Props as OwnProps, SuccessStateType } from '..'

type Props = OwnProps & SuccessStateType & { offer: OfferType }

const Table = styled.div`
  margin-top: 16px;
`

const {
  getCollateralizationColor,
  getCollateralizationDisplayName
} = model.components.borrow

const Summary: React.FC<Props> = props => {
  const currentCollateralStatus = getCollateralizationDisplayName(
    props.loan.collateralisationRatio,
    props.offer
  )
  const lastUnconfirmedOrFailedTx = isLastTxStatus(
    ['FAILED', 'UNCONFIRMED', 'REQUESTED'],
    props.loan,
    props.loanTransactions
  )

  return showBorrowSummary(props.loan) ? (
    <div>
      <Text color='grey800' weight={600}>
        <FormattedMessage id='modals.borrow.summary' defaultMessage='Summary' />
      </Text>
      <Table>
        {lastUnconfirmedOrFailedTx && (
          <TableRow>
            <Title>
              <FormattedMessage
                id='modals.borrow.lasttx'
                defaultMessage='Last Transaction Status'
              />
            </Title>
            <Value>{lastUnconfirmedOrFailedTx.status}</Value>
          </TableRow>
        )}
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.status'
              defaultMessage='Status'
            />
          </Title>
          <Value>
            <Status {...props.loan} />
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.borrowamount'
              defaultMessage='Borrow Amount'
            />
          </Title>
          <Value>
            <CoinDisplay
              size='14px'
              weight={500}
              color='grey800'
              coin={props.loan.principal.amount[0].currency}
            >
              {props.loan.principal.amount[0].amount}
            </CoinDisplay>
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.collateral'
              defaultMessage='Collateral'
            />
          </Title>
          <Value>
            <CollateralAmt {...props} />
          </Value>
        </TableRow>
        {showCollateralizationStatus(props.loan) && (
          <TableRow>
            <Title>
              <FormattedMessage
                id='modals.borrow.collateralization'
                defaultMessage='Collateralization'
              />
            </Title>
            <Value color={getCollateralizationColor(currentCollateralStatus)}>
              {Number(props.loan.collateralisationRatio * 100).toFixed(0)}%
            </Value>
          </TableRow>
        )}
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.interestrate'
              defaultMessage='Interest Rate'
            />
          </Title>
          <Value>
            {Number(props.offer.terms.interestRate * 100).toFixed(1) + '%'}
          </Value>
        </TableRow>
      </Table>
    </div>
  ) : null
}

export default Summary
