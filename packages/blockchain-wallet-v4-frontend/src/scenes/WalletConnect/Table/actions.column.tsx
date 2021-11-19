import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

import { CellHeaderText } from '.'

const CellWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-right: 8px;
`

export const getActionsColumn = (modalActions, walletConnectActions) => ({
  Cell: ({ row: { original: values } }) => (
    <CellWrapper>
      <Button
        data-e2e={`${values.sessionDetails.peerMeta.name}LaunchBtn`}
        height='32px'
        nature='primary'
        onClick={() => {
          walletConnectActions.launchDappConnection(values)
        }}
        width='68px'
        style={{ marginRight: '8px' }}
      >
        <Text size='14px' color='white' weight={600}>
          <FormattedMessage id='buttons.launch' defaultMessage='Launch' />
        </Text>
      </Button>
      <Button
        data-e2e={`${values.sessionDetails.peerMeta.name}RemoveBtn`}
        height='32px'
        nature='empty-red'
        onClick={() => {
          walletConnectActions.removeDappConnection(values)
        }}
        width='68px'
      >
        <Text size='14px' color='red600' weight={600}>
          <FormattedMessage id='buttons.remove' defaultMessage='Remove' />
        </Text>
      </Button>
    </CellWrapper>
  ),
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.actions' defaultMessage='Actions' />
    </CellHeaderText>
  ),
  accessor: 'actions',
  disableSortBy: true
})
