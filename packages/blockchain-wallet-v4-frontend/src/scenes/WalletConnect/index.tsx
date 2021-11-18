import React, { useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { useSortBy, useTable } from 'react-table'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Image, Text } from 'blockchain-info-components'
import { Header, PageTitle, SceneWrapper, SubTitle, Title } from 'components/Layout'
import { actions } from 'data'
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

// useEffect(() => {
//   const walletConnectSession = localStorage.getItem('walletConnectSession')
//   const uri = localStorage.getItem('walletConnectUri')
//
//   if (walletConnectSession && uri) {
//     // props.walletConnectActions.initWalletConnect(uri)
//     modalActions.showModal(ModalName.WALLET_CONNECT_MODAL, {
//       origin: 'WalletConnectSessions',
//       uri
//     })
//     walletConnectActions.setSessionDetails(JSON.parse(walletConnectSession))
//     walletConnectActions.setStep({ name: WalletConnectStep.SESSION_DASHBOARD })
//   }
// }, [])

// props.walletConnectActions.initWalletConnect(this.props.uri)
// props.walletConnectActions.setSessionDetails
// props.walletConnectActions.setStep({ name: WalletConnectStep.SESSION_DASHBOARD })
// actions.modals.showModal(ModalName.WALLET_CONNECT_MODAL, walletConnect.data)

const WalletConnect = ({ data, modalActions, walletConnectActions }) => {
  const [walletConnectData, changeWalletConnectData] = useState([])

  useEffect(() => {
    const walletConnectString = localStorage.getItem('WalletConnect')
    if (walletConnectString) {
      const walletConnectObj = JSON.parse(walletConnectString)

      // console.log(
      //   'walletConnectStuff',
      //   walletConnectObj,
      //   walletConnectObj[0].uri,
      //   walletConnectObj[0].sessionDetails
      // )

      // modalActions.showModal(ModalName.WALLET_CONNECT_MODAL, {
      //   origin: 'WalletConnectSessions',
      //   uri: walletConnectObj[0].uri
      // })
      // walletConnectActions.setSessionDetails(walletConnectObj[0].sessionDetails)
      // walletConnectActions.setStep({ name: WalletConnectStep.SESSION_DASHBOARD })
      changeWalletConnectData(walletConnectObj)
    }
  }, [])

  const columns = useMemo(getTableColumns({ modalActions, walletConnectActions }), [])

  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data: walletConnectData,
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
                WalletConnect
              </Text>
            </Title>
            <SubTitle>
              <Text color='grey600' size='16px' weight={500}>
                <FormattedMessage
                  id='scenes.walletconnect.subtitle'
                  defaultMessage='Manage the decentralized applications (dapps) connected to your wallet.'
                />
              </Text>
            </SubTitle>
          </div>
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

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  walletConnectActions: bindActionCreators(actions.components.walletConnect, dispatch)
})

export default connect(null, mapDispatchToProps)(WalletConnect)
