import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { ModalName } from 'data/modals/types'

import { CellHeaderText } from '.'

const CellWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-right: 8px;
`

export const getManageColumn = (modalActions) => ({
  Cell: ({ row: { original: values } }) => (
    <CellWrapper>
      {values.connected ? (
        <>
          <Button
            data-e2e={`${values.name}LaunchBtn`}
            height='32px'
            nature='primary'
            onClick={() => {
              modalActions.showModal(ModalName.WALLET_CONNECT_MODAL, {
                origin: 'WalletConnect',
                uri: '' // TODO
              })
            }}
            width='68px'
          >
            <Text size='14px' color='white' weight={600}>
              <FormattedMessage id='buttons.launch' defaultMessage='Launch' />
            </Text>
          </Button>
          <Button
            data-e2e={`${values.name}DisconnectBtn`}
            height='32px'
            nature='warning'
            onClick={() => {
              modalActions.showModal(ModalName.WALLET_CONNECT_MODAL, {
                origin: 'WalletConnect',
                uri: '' // TODO
              })
            }}
            width='68px'
          >
            <Text size='14px' color='white' weight={600}>
              <FormattedMessage id='buttons.disconnect' defaultMessage='Disconnect' />
            </Text>
          </Button>
        </>
      ) : (
        <Button
          data-e2e={`${values.name}ConnectBtn`}
          height='32px'
          nature='empty-blue'
          onClick={() => {
            modalActions.showModal(ModalName.WALLET_CONNECT_MODAL, {
              origin: 'WalletConnect',
              uri: '' // TODO
            })
          }}
          width='68px'
        >
          <Text size='14px' color='blue600' weight={600}>
            <FormattedMessage id='buttons.connect' defaultMessage='Connect' />
          </Text>
        </Button>
      )}
    </CellWrapper>
  ),
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.actions' defaultMessage='Actions' />
    </CellHeaderText>
  ),
  accessor: 'manage',
  disableSortBy: true
})
