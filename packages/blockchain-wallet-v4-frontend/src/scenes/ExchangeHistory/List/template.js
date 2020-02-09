import { FormattedMessage } from 'react-intl'
import {
  HeartbeatLoader,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import LazyLoadContainer from 'components/LazyLoadContainer'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import TradeItem from './TradeItem'

const LazyLoadWrapper = styled(LazyLoadContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
`
const Container = styled.div`
  width: 100%;
  &:first-child {
    margin-bottom: 20px;
  }
`
const LoaderRow = styled(TableRow)`
  justify-content: center;
`

const List = props => {
  const {
    coinModels,
    complete,
    incomplete,
    showComplete,
    showIncomplete,
    loadingNextPage,
    handleScrollPastFinish
  } = props

  return (
    <LazyLoadWrapper onLazyLoad={handleScrollPastFinish}>
      {showIncomplete && (
        <Container>
          <Table>
            <TableHeader>
              <TableCell width='15%' mobileWidth='25%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.exchangehistory.list.incomplete.status'
                    defaultMessage='Status'
                  />
                </Text>
              </TableCell>
              <TableCell width='15%' mobileWidth='0%' />
              <TableCell width='30%' mobileWidth='18%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.exchangehistory.list.incomplete.date'
                    defaultMessage='Date'
                  />
                </Text>
              </TableCell>
              <TableCell width='20%' mobileWidth='30%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.exchangehistory.list.incomplete.xchanged'
                    defaultMessage='Exchanged'
                  />
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.exchangehistory.list.incomplete.received'
                    defaultMessage='To Be Received'
                  />
                </Text>
              </TableCell>
            </TableHeader>
            {incomplete.map((trade, index) => (
              <TradeItem key={index} trade={trade} />
            ))}
          </Table>
        </Container>
      )}
      {showComplete && (
        <Container>
          <Text style={spacing('mb-15')} size='16px' weight={500} capitalize>
            <FormattedMessage
              padding-bottom='10px'
              id='scenes.exchangehistory.list.complete.orders'
              defaultMessage='Completed Orders'
            />
          </Text>
          <Table>
            <TableHeader>
              <TableCell width='15%' mobileWidth='25%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.exchangehistory.list.complete.status'
                    defaultMessage='Status'
                  />
                </Text>
              </TableCell>
              <TableCell width='15%' mobileWidth='0%' />
              <TableCell width='30%' mobileWidth='18%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.exchangehistory.list.complete.date'
                    defaultMessage='Date'
                  />
                </Text>
              </TableCell>
              <TableCell width='20%' mobileWidth='30%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.exchangehistory.list.complete.xchanged'
                    defaultMessage='Exchanged'
                  />
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.exchangehistory.list.complete.received'
                    defaultMessage='Received'
                  />
                </Text>
              </TableCell>
            </TableHeader>
            {complete.map((trade, index) => (
              <TradeItem key={index} trade={trade} coinModels={coinModels} />
            ))}
            {loadingNextPage && (
              <LoaderRow>
                <HeartbeatLoader />
              </LoaderRow>
            )}
          </Table>
        </Container>
      )}
    </LazyLoadWrapper>
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
