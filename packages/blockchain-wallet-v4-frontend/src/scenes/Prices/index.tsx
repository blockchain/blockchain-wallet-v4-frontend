import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSortBy, useTable } from 'react-table'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { SceneWrapper } from 'components/Layout'

const Header = styled.div`
  width: 100%;
  margin-bottom: 32px;
`
const PageTitle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const Title = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > :first-child {
    margin-right: 16px;
  }
`
const SubTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 16px;
`
const TableWrapper = styled.div`
  /* make table full page width */
  display: block;
  max-width: 100%;

  /* make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  table {
    /* make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      text-align: left;
      /* make sure each cell grows equally */
      width: 1%;

      :last-child {
        border-right: 0;
      }
    }
  }
`

const PricesContainer = () => {
  const data = React.useMemo(
    () => [
      {
        name: 'Bitcoin',
        price: '56498.65',
        priceChange: '2.4%',
        balance: '0.438054',
        actions: ''
      },
      {
        name: 'Ethereum',
        price: '1421.20',
        priceChange: '5.4%',
        balance: '4.5422',
        actions: ''
      },
      {
        name: 'Aave',
        price: '32.94',
        priceChange: '-0.4%',
        balance: '54.9853',
        actions: ''
      }
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        sortType: 'alphanumeric'
      },
      {
        Header: 'Price',
        accessor: 'price',
        sortType: 'basic'
      },
      {
        Header: 'Price Change',
        accessor: 'priceChange',
        sortType: 'basic'
      },
      {
        Header: 'Your Balance',
        accessor: 'balance',
        sortType: 'basic'
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        disableSortBy: true
      }
    ],
    []
  )

  const options = {
    disableMultiSort: true,
    disableSortRemove: true
  }

  const initialState = {
    sortBy: [{ id: 'price', desc: true }]
  }

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows
  } = useTable({ columns, data, initialState, ...options }, useSortBy)

  return (
    <SceneWrapper>
      <Header>
        <PageTitle>
          <Title>
            <Icon size='36px' color='blue600' name='compass' />
            <Text color='grey800' size='32px' weight={600}>
              <FormattedMessage id='copy.prices' defaultMessage='Prices' />
            </Text>
          </Title>
          <SubTitle>
            <Text color='grey600' size='16px' weight={500}>
              <FormattedMessage
                id='scenes.prices.subtitle'
                defaultMessage='Explore, Buy, Sell and Swap all of assets offered by our wallet.'
              />
            </Text>
          </SubTitle>
        </PageTitle>
      </Header>
      <TableWrapper>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </TableWrapper>
    </SceneWrapper>
  )
}

export default PricesContainer
