import { FormattedMessage } from 'react-intl'
import { Status, Value } from './model'
import { SuccessStateType } from '.'
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import moment from 'moment'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

export const History = styled.div`
  margin-top: 72px;
`
export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`

function Success (props: SuccessStateType): ReactElement {
  return (
    <History>
      <MainTitle size='24px' color='grey800' weight={600}>
        <FormattedMessage id='scenes.borrow.history' defaultMessage='History' />
      </MainTitle>

      <div style={{ minWidth: '500px', paddingBottom: '45px' }}>
        <Table style={{ minWidth: '500px' }}>
          <TableHeader>
            <TableCell width='22%'>
              <Text size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.borrow.history.created'
                  defaultMessage='Created'
                />
              </Text>
            </TableCell>
            <TableCell width='22%'>
              <Text size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.borrow.history.status'
                  defaultMessage='Status'
                />
              </Text>
            </TableCell>
            <TableCell width='22%'>
              <Text size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.borrow.history.collateral'
                  defaultMessage='Collateral'
                />
              </Text>
            </TableCell>
            <TableCell width='34%'>
              <Text size='12px' weight={500}>
                <FormattedMessage
                  id='scenes.borrow.history.amount'
                  defaultMessage='Loan Amount'
                />
              </Text>
            </TableCell>
          </TableHeader>
          {props.borrowHistory.map(loan => {
            return (
              <TableRow>
                <TableCell width='22%'>
                  <Value>{moment(loan.openedAt).format('lll')}</Value>
                </TableCell>
                <TableCell width='22%'>
                  <Status {...loan} />
                </TableCell>
                <TableCell width='22%'>
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
                <TableCell width='22%'>
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
              </TableRow>
            )
          })}
        </Table>
      </div>
    </History>
  )
}

export default Success
