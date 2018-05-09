import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Table, TableCell, TableHeader, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import TradeItem from './TradeItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;

  & > :first-child { margin-bottom: 20px; }
`
const Container = styled.div`
  width: 100%;
`

const List = props => {
  const { complete, incomplete, showComplete, showIncomplete } = props

  return (
    <Wrapper>
      {showIncomplete &&
        <Container>
          <Table>
            <TableHeader >
              <TableCell width='15%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.exchangehistory.list.status' defaultMessage='Status' />
                </Text>
              </TableCell>
              <TableCell width='15%' />
              <TableCell width='30%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.exchangehistory.list.date' defaultMessage='Date' />
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.exchangehistory.list.exchanged' defaultMessage='Exchanged' />
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.exchangehistory.list.received' defaultMessage='To Be Received' />
                </Text>
              </TableCell>
            </TableHeader>
            {incomplete.map((trade, index) => <TradeItem key={index} trade={trade} />)}
          </Table>
        </Container>
      }
      {showComplete &&
        <Container>
          <Text style={spacing('mb-15')} size='16px' weight={500} capitalize>
            <FormattedMessage padding-bottom='10px' id='scenes.exchangehistory.list.exchanges' defaultMessage='Completed Exchanges' />
          </Text>
          <Table>
            <TableHeader>
              <TableCell width='15%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.exchangehistory.list.status' defaultMessage='Status' />
                </Text>
              </TableCell>
              <TableCell width='15%' />
              <TableCell width='30%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.exchangehistory.list.date' defaultMessage='Date' />
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.exchangehistory.list.exchanged' defaultMessage='Exchanged' />
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage id='scenes.exchangehistory.list.received' defaultMessage='Received' />
                </Text>
              </TableCell>
            </TableHeader>
            {complete.map((trade, index) => <TradeItem key={index} trade={trade} />)}
          </Table>
        </Container>
      }

    </Wrapper>
  )
}

List.propTypes = {
  complete: PropTypes.array,
  incomplete: PropTypes.array,
  showComplete: PropTypes.bool.isRequired,
  showIncomplete: PropTypes.bool.isRequired
}

List.defaultProps = {
  complete: [],
  incomplete: []
}

export default List
