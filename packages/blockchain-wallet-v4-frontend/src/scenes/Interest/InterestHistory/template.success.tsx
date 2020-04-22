import { FormattedMessage } from 'react-intl'
import {
  //   Link,
  Table,
  TableCell,
  TableHeader,
  //   TableRow,
  Text
} from 'blockchain-info-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`

function Success (): ReactElement {
  return (
    <div style={{ minWidth: '900px', paddingBottom: '45px' }}>
      <Table style={{ minWidth: '900px' }}>
        <TableHeader>
          <TableCell width='20%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.earninterest.history.type'
                defaultMessage='Type'
              />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.earninterest.history.date'
                defaultMessage='Date'
              />
            </Text>
          </TableCell>
          <TableCell width='15%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.earninterest.history.from'
                defaultMessage='From'
              />
            </Text>
          </TableCell>
          <TableCell width='12.5%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.earninterest.history.to'
                defaultMessage='To'
              />
            </Text>
          </TableCell>
          <TableCell width='12.5%'>
            <Text size='12px' weight={500}>
              <FormattedMessage
                id='scenes.earninterest.history.amount'
                defaultMessage='Amount'
              />
            </Text>
          </TableCell>
        </TableHeader>
      </Table>
    </div>
  )
}

export default Success
