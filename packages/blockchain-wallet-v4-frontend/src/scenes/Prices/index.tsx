import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import { map, not, reject, values } from 'ramda'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { CoinTypeEnum } from 'blockchain-wallet-v4/src/types'
import FiatDisplay from 'components/Display/FiatDisplay'
import { TextBox } from 'components/Form'
import { SceneWrapper } from 'components/Layout'
import { selectors } from 'data'

const Header = styled.div`
  width: 100%;
  margin-bottom: 32px;
`
const PageTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
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
    border: 1px solid ${props => props.theme.grey100};
    border-radius: 8px;

    td {
      border-top: 1px solid ${props => props.theme.grey100};
    }

    th,
    td {
      margin: 0;
      padding: 16px 8px;
      text-align: left;
      /* make sure each cell grows equally */
      width: 1%;
    }
  }
`
const CellHeaderText = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.grey400};
`
const CellText = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${props => (props.color ? props.color : props.theme.grey900)};
`
const HeaderText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > :last-child {
    margin-left: 8px;
    margin-top: -2px;
  }
`

const PricesContainer = ({ coinRates, supportedCoins, walletCurrency }) => {
  const data = React.useMemo(
    () =>
      reject(
        not,
        values(
          map(coin => {
            return (
              coin.coinCode in CoinTypeEnum && {
                coinModel: coin,
                name: `${coin.displayName} (${coin.coinTicker})`,
                price: coinRates[coin.coinCode],
                priceChange: '2.4',
                balance: '0.438054'
              }
            )
          }, supportedCoins)
        )
      ),
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: () => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingLeft: '8px'
            }}
          >
            <CellHeaderText>
              <FormattedMessage id='copy.name' defaultMessage='Name' />
            </CellHeaderText>
          </div>
        ),
        accessor: 'name',
        sortType: 'alphanumeric',
        Cell: ({ row: { original: values } }) => {
          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                paddingLeft: '8px',
                alignItems: 'center'
              }}
            >
              <Icon
                name={values.coinModel?.icons.circleFilled}
                size='32px'
                color={values.coinModel?.colorCode}
              />
              <CellText style={{ marginLeft: '16px' }}>{values.name}</CellText>
            </div>
          )
        }
      },
      {
        Header: () => (
          <CellHeaderText>
            <FormattedMessage id='copy.price' defaultMessage='Price' />
          </CellHeaderText>
        ),
        accessor: 'price',
        disableGlobalFilter: true,
        sortType: (rowA, rowB, id) => {
          const a = rowA.original[id][walletCurrency].last
          const b = rowB.original[id][walletCurrency].last
          if (a > b) return 1
          if (b > a) return -1
          return 0
        },
        Cell: ({ row: { original: values } }) => {
          return (
            <CellText>
              <FiatDisplay
                color='grey900'
                coin={walletCurrency}
                currency={walletCurrency}
                loadingHeight='24px'
                size='16px'
                style={{ lineHeight: '24px' }}
                weight={500}
              >
                {values.price[walletCurrency]?.last}
              </FiatDisplay>
            </CellText>
          )
        }
      },
      {
        Header: () => (
          <CellHeaderText>
            <FormattedMessage
              id='copy.price_change'
              defaultMessage='Price Change'
            />
          </CellHeaderText>
        ),
        accessor: 'priceChange',
        disableGlobalFilter: true,
        sortType: 'basic',
        Cell: ({ cell: { value } }) => {
          return (
            <CellText color={Number(value) >= 0 ? 'green600' : 'red600'}>
              {value}%
            </CellText>
          )
        }
      },
      {
        Header: () => (
          <CellHeaderText>
            <FormattedMessage id='copy.balance' defaultMessage='Balance' />
          </CellHeaderText>
        ),
        accessor: 'balance',
        disableGlobalFilter: true,
        sortType: 'basic',
        Cell: ({ cell: { value } }) => <CellText>{value}</CellText>
      },
      {
        Header: () => (
          <CellHeaderText>
            <FormattedMessage id='copy.actions' defaultMessage='Actions' />
          </CellHeaderText>
        ),
        accessor: 'actions',
        disableGlobalFilter: true,
        disableSortBy: true,
        Cell: () => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingRight: '8px'
            }}
          >
            <Button
              data-e2e='TODO'
              height='32px'
              nature='primary'
              width='96px'
              style={{ marginRight: '12px' }}
            >
              <Text size='14px' color='white' weight={600}>
                <FormattedMessage
                  id='buttons.buy_sell'
                  defaultMessage='Buy & Sell'
                />
              </Text>
            </Button>
            <Button
              data-e2e='TODO'
              height='32px'
              nature='empty-blue'
              width='68px'
            >
              <Text size='14px' color='blue600' weight={600}>
                <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
              </Text>
            </Button>
          </div>
        )
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
    rows,
    setGlobalFilter
  } = useTable(
    { columns, data, initialState, ...options },
    useGlobalFilter,
    useSortBy
  )

  return (
    <SceneWrapper>
      <Header>
        <PageTitle>
          <div>
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
          </div>
          <div>
            <Field
              component={TextBox}
              height='42px'
              data-e2e='pricesTextFilter'
              name='textFilter'
              onChange={(e, val) => setGlobalFilter(val)}
              placeholder='Filter by asset name'
            />
          </div>
        </PageTitle>
      </Header>
      <TableWrapper>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <HeaderText>
                      {column.render('Header')}
                      <div>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <span>▾</span>
                          ) : (
                            <span>▴</span>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </HeaderText>
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

const mapStateToProps = state => ({
  coinRates: selectors.core.data.misc.getAllCoinRatesSelector(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail('Failed to fetch'),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const connector = connect(mapStateToProps, null)

const enhance = compose<any>(reduxForm({ form: 'prices' }), connector)

export default enhance(PricesContainer)
