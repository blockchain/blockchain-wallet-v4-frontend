import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { useGlobalFilter, useSortBy, useTable } from 'react-table'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { TextBox } from 'components/Form'
import { SceneWrapper } from 'components/Layout'
import { actions, selectors } from 'data'

import { getData } from './selectors'
import { getTableColumns, HeaderText, TableWrapper } from './Table'

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

const options = {
  disableMultiSort: true,
  disableSortRemove: true
}

const initialState = {
  sortBy: [{ id: 'price', desc: true }]
}

const PricesContainer = ({
  modalActions,
  routerActions,
  rowData: { data },
  walletCurrency
}) => {
  const columns = React.useMemo(
    getTableColumns({ modalActions, routerActions, walletCurrency }),
    []
  )

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
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
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
  rowData: getData(state),
  coinRates: selectors.core.data.misc.getAllCoinRatesSelector(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail('Failed to fetch'),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose<any>(reduxForm({ form: 'prices' }), connector)

export default enhance(PricesContainer)
