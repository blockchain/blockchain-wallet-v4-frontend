import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'
import { Icon, TabMenu, TabMenuItem, Text, IconButton } from 'blockchain-info-components'
import HorizontalMenu from 'components/HorizontalMenu'
import AddressesTable from './AddressesTable'
import AddressesTableEntry from './AddressesTableEntry'

const Wrapper = styled.div`
  width: 100%;
`
const InnerWrapper = styled.div`
  padding: 40px 30px;
`

const ManageAddressesTemplate = ({ account, labels, receiveIndex, deriveAddress, onSetLabel, onEditLabel, onDeleteLabel }) => (
  <Wrapper>
    <HorizontalMenu>
      <TabMenu>
        <LinkContainer to='/settings/addresses'>
          <TabMenuItem>
            <Icon name='left-arrow' />
          </TabMenuItem>
        </LinkContainer>
      </TabMenu>
    </HorizontalMenu>
    <InnerWrapper>
      <Text weight={400}>
        {account.label}
      </Text>
      <Text weight={400} size='small' style={{ marginTop: 25 }}>
        <FormattedMessage id='scenes.settings.manage_addresses.unused_addresses' defaultMessage='Unused Addresses' />
      </Text>
      <Text weight={200} size='small' style={{ marginTop: 10, marginBottom: 15 }}>
        <FormattedMessage id='scenes.settings.manage_addresses.unused_addresses.message' defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are the subset of addresses that are labeled.' />
      </Text>
      {labels.length === 0 ? null : (
        <AddressesTable>
          {labels.map(entry => (
            <AddressesTableEntry {...{ entry, deriveAddress, onEditLabel, onDeleteLabel }} />
          ))}
        </AddressesTable>
      )}
      {receiveIndex.cata({
        Success: (index) => (
          <IconButton style={{ marginTop: 15 }} name='build' onClick={() => onSetLabel(index, 'New Address')}>
            <FormattedMessage id='scenes.settings.manage_addresses.add_label' defaultMessage='Add Next Address' />
          </IconButton>
        ),
        Failure: () => null,
        Loading: () => null,
        NotAsked: () => null
      })}
    </InnerWrapper>
  </Wrapper>
)

export default ManageAddressesTemplate
