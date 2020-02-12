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
import moment from 'moment'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

export const History = styled.div`
  margin-top: 72px;
  max-width: 1200px;
`
export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`
const ViewDetailsCell = styled(TableCell)`
  justify-content: flex-end;
`

function Success (props: SuccessStateType): ReactElement {
  return (
    <History>
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
            <TableCell width='15%'>
              <Text size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.borrow.history.status'
                  defaultMessage='Status'
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
            <TableCell width='15%'>
              <Text size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.borrow.history.amount'
                  defaultMessage='Loan Amount'
                />
              </Text>
            </TableCell>
            <TableCell width='15%'>
              <Text size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.borrow.history.outstanding'
                  defaultMessage='Outstanding'
                />
              </Text>
            </TableCell>
          </TableHeader>
          {props.borrowHistory.map(loan => {
            return (
              <TableRow>
                <TableCell width='20%'>
                  <Value>{moment(loan.openedAt).format('lll')}</Value>
                </TableCell>
                <TableCell width='15%'>
                  <Status {...loan} />
                </TableCell>
                <TableCell width='15%'>
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
                <TableCell width='15%'>
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
                <TableCell width='15%'>-</TableCell>
                <ViewDetailsCell
                  width='20%'
                  onClick={() => props.showLoanDetails(loan)}
                >
                  <Link size='14px'>View Details</Link>
                </ViewDetailsCell>
              </TableRow>
            )
          })}
        </Table>
      </div>
    </History>
  )
}

export default Success
