import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import {
  HeartbeatLoader,
  Table,
  TableCell,
  TableRow,
  TableHeader,
  Text
} from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import TradeItem from './TradeItem'
import LazyLoadContainer from 'components/LazyLoadContainer'
import media from 'services/ResponsiveService'

const LazyLoadWrapper = styled(LazyLoadContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;

  ${media.mobile`
    padding: 10px
  `};
`
const Container = styled.div`
  width: 100%;
  & :first-child {
    margin-bottom: 20px;
  }
`
const LoaderRow = styled(TableRow)`
  justify-content: center;
`

const List = props => {
  const {
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
              id='scenes.exchangehistory.list.complete.exchanges'
              defaultMessage='Completed Exchanges'
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
              <TradeItem key={index} trade={trade} />
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
