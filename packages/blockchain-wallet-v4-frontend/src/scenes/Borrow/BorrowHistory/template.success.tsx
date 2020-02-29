import { FormattedMessage } from 'react-intl'
import {
  Link,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { Status, Value } from './model'
import { SuccessStateType } from '.'
import CollateralizationBar from 'blockchain-wallet-v4-frontend/src/modals/Borrow/BorrowDetails/CollateralizationBar'
import moment from 'moment'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`
const CollateralizationTableCell = styled(TableCell)`
  align-items: center;
`
const CollateralizationBarWrapper = styled.div`
  width: 60%;
  max-width: 150px;
  margin-left: 12px;
  div {
    margin: 0px;
  }
`
const ViewDetailsCell = styled(TableCell)`
  justify-content: flex-end;
`

function Success (props: SuccessStateType): ReactElement {
  return (
    <div style={{ minWidth: '800px', paddingBottom: '45px' }}>
      <Table style={{ minWidth: '800px' }}>
        <TableHeader>
          <TableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.history.created'
                defaultMessage='Created'
              />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.history.status'
                defaultMessage='Status/Collateralization'
              />
            </Text>
          </TableCell>
          <TableCell width='12%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.history.collateral'
                defaultMessage='Collateral'
              />
            </Text>
          </TableCell>
          <TableCell width='12%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.history.amount'
                defaultMessage='Loan Amount'
              />
            </Text>
          </TableCell>
          <TableCell width='12%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.history.outstanding'
                defaultMessage='Outstanding'
              />
            </Text>
          </TableCell>
        </TableHeader>
        {props.borrowHistory
          .sort(
            (a, b) =>
              moment(b.openedAt).valueOf() - moment(a.openedAt).valueOf()
          )
          .map(loan => {
            const offer = props.offers.find(offer => offer.id === loan.offerId)
            if (!offer) return

            return (
              <TableRow key={loan.loanId}>
                <TableCell width='20%'>
                  <Value>{moment(loan.openedAt).format('lll')}</Value>
                </TableCell>
                <CollateralizationTableCell width='30%'>
                  <Status {...loan} />
                  {offer && (
                    <CollateralizationBarWrapper>
                      <CollateralizationBar
                        {...props}
                        loan={loan}
                        offer={offer}
                      />
                    </CollateralizationBarWrapper>
                  )}
                </CollateralizationTableCell>
                <TableCell width='12%'>
                  {/* TODO: Borrow - loop over all amounts in the future */}
                  <Value>
                    {
                      loan.collateral.amounts.find(
                        amount => amount.symbol === 'BTC'
                      )!.value
                    }{' '}
                    BTC
                  </Value>
                </TableCell>
                <TableCell width='12%'>
                  {/* TODO: Borrow - loop over all amounts in the future */}
                  <Value>
                    {
                      loan.principal.amount.find(
                        amount => amount.symbol === 'PAX'
                      )!.value
                    }{' '}
                    PAX
                  </Value>
                </TableCell>
                <TableCell width='12%'>
                  {loan.financials
                    ? loan.financials.owedInterest[0]
                      ? loan.financials.owedInterest[0].value +
                        ' ' +
                        loan.financials.owedInterest[0].symbol
                      : '-'
                    : '-'}
                </TableCell>
                <ViewDetailsCell
                  width='14%'
                  onClick={() => props.showLoanDetails(loan, offer)}
                >
                  <Link size='14px'>View Details</Link>
                </ViewDetailsCell>
              </TableRow>
            )
          })}
      </Table>
    </div>
  )
}

export default Success
