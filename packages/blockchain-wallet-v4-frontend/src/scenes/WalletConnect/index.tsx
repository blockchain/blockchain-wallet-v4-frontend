import React, { useEffect, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { useSortBy, useTable } from 'react-table'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Header, PageTitle, SceneWrapper, SubTitle, Title } from 'components/Layout'
import { actions, selectors } from 'data'
import { WalletConnectStep } from 'data/components/walletConnect/types'
import { ModalName } from 'data/modals/types'

import { CellText, getTableColumns, HeaderText, TableWrapper } from './Table'

const TableBodyWrapper = styled.div`
  height: calc(100% - 52px);
`
const NoResultsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 120px;
`

const WalletConnect = ({ dappList, modalActions, walletConnectActions }) => {
  useEffect(() => {
    walletConnectActions.initLSWalletConnect()
  }, [])

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns: useMemo(
        () => getTableColumns({ modalActions, walletConnectActions }),
        [modalActions, walletConnectActions]
      ),
      data: useMemo(() => dappList, [dappList]),
      disableMultiSort: true,
      disableSortRemove: true,
      initialState: {
        sortBy: [{ id: 'name' }]
      }
    },
    useSortBy
  )

  return (
    <SceneWrapper>
      <Header>
        <PageTitle>
          <div>
            <Title>
              <Image name='walletconnect-circle-logo' height='36px' />
              <Text color='grey800' size='32px' weight={600}>
                Dapps
              </Text>
            </Title>
            <SubTitle>
              <Text color='grey600' size='16px' weight={500}>
                <FormattedMessage
                  id='scenes.walletconnect.subtitle'
                  defaultMessage='Interact with and manage the Decentralized Applications (Dapps) connected to your wallet via {poweredBy}.'
                  values={{ poweredBy: 'WalletConnect' }}
                />
              </Text>
            </SubTitle>
          </div>
          <Button
            data-e2e='addNewConnectionBtn'
            nature='primary'
            onClick={walletConnectActions.showAddNewDapp}
          >
            <Text size='14px' color='white' weight={600}>
              <FormattedMessage id='buttons.connect-dapp' defaultMessage='Connect Dapp' />
            </Text>
          </Button>
        </PageTitle>
      </Header>
      <TableWrapper>
        {!rows.length ? (
          <NoResultsWrapper>
            <CellText color='grey700' size='18px'>
              <span role='img' aria-label='detective emoji'>
                🕵️‍♀️
              </span>
              &nbsp;&nbsp;&nbsp;
              <FormattedMessage
                id='scenes.walletconnect.noresults'
                defaultMessage='Connect a dapp to get started!'
              />
            </CellText>
          </NoResultsWrapper>
        ) : (
          <div {...getTableProps()} className='table'>
            <div>
              {headerGroups.map((headerGroup) => (
                <div {...headerGroup.getHeaderGroupProps()} className='tr' key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <div
                      key={column.key}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className='th'
                    >
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
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <TableBodyWrapper>
              <div {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row)
                  return (
                    <div key={`row-${row.id}`} {...row.getRowProps()} className='tr'>
                      {row.cells.map((cell) => (
                        <div key={`cell-${cell.row.id}`} {...cell.getCellProps()} className='td'>
                          {cell.render('Cell')}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </TableBodyWrapper>
          </div>
        )}
      </TableWrapper>
    </SceneWrapper>
  )
}

const mapStateToProps = () => ({
  dappList: selectors.components.walletConnect.getAuthorizedDappsList()
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  walletConnectActions: bindActionCreators(actions.components.walletConnect, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnect)
