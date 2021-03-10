import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import CollateralizationBar from 'blockchain-wallet-v4-frontend/src/modals/Borrow/BorrowDetails/CollateralizationBar'
import moment from 'moment'
import styled from 'styled-components'

import {
  Link,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { LoanType, OfferType } from 'blockchain-wallet-v4/src/types'
import CoinDisplay from 'components/Display/CoinDisplay'

import { SuccessStateType } from '.'
import { CollateralAmt, Status, Value } from './model'

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

function Success(
  props: SuccessStateType & {
    showLoanDetails: (loan: LoanType, offer: OfferType) => void
  }
): ReactElement {
  return (
    <div style={{ minWidth: '900px', paddingBottom: '45px' }}>
      <Table style={{ minWidth: '900px' }}>
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
          <TableCell width='15%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.history.collateral'
                defaultMessage='Collateral'
              />
            </Text>
          </TableCell>
          <TableCell width='12.5%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.borrow.history.amount'
                defaultMessage='Loan Amount'
              />
            </Text>
          </TableCell>
          <TableCell width='12.5%'>
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
                  <Value data-e2e='loanCreationDate'>
                    {moment(loan.openedAt).format('lll')}
                  </Value>
                </TableCell>
                <CollateralizationTableCell data-e2e='loanStatus' width='30%'>
                  <Status {...loan} />
                  {offer && (
                    <CollateralizationBarWrapper data-e2e='collateralizationBar'>
                      <CollateralizationBar
                        {...props}
                        loan={loan}
                        offer={offer}
                      />
                    </CollateralizationBarWrapper>
                  )}
                </CollateralizationTableCell>
                <TableCell width='15%'>
                  {/* TODO: Borrow - loop over all amounts in the future */}
                  <Value data-e2e='collateralAmount'>
                    <CollateralAmt loan={loan} />
                  </Value>
                </TableCell>
                <TableCell width='12.5%'>
                  {/* TODO: Borrow - loop over all amounts in the future */}
                  <Value>
                    <CoinDisplay coin='PAX'>
                      {
                        loan.principal.amount.find(
                          amount => amount.currency === 'PAX'
                        )!.amount
                      }
                    </CoinDisplay>
                  </Value>
                </TableCell>
                <TableCell width='12.5%'>
                  <Value data-e2e='outstandingInterest'>
                    {loan.financials ? (
                      loan.financials.owedInterest[0] ? (
                        <CoinDisplay
                          coin={loan.financials.owedInterest[0].currency}
                        >
                          {loan.financials.owedInterest[0].amount}
                        </CoinDisplay>
                      ) : (
                        '-'
                      )
                    ) : (
                      '-'
                    )}
                  </Value>
                </TableCell>
                <ViewDetailsCell
                  data-e2e='viewLoanDetails'
                  onClick={() => props.showLoanDetails(loan, offer)}
                  width='10%'
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
