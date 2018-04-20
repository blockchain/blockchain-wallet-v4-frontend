import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'
import { Icon, TabMenu, TabMenuItem, Text, IconButton, Link, ComponentDropdown } from 'blockchain-info-components'
import HorizontalMenu from 'components/HorizontalMenu'
import AddressesTable from './AddressesTable'
import AddressesTableEntry from './AddressesTableEntry'
import OptionItem from '../OptionItem'

const Wrapper = styled.div`
  width: 100%;
`
const InnerWrapper = styled.div`
  padding: 40px 30px;
`

const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.manage_addresses.more_options' defaultMessage='More Options' />
  </Link>
)

const ManageAddressesTemplate = ({ account, labels, receiveIndex, isDefault, deriveAddress, onSetLabel, onEditLabel, onDeleteLabel, oneditBtcAccountLabel, onShowXPub, onMakeDefault, onSetArchived }) => (
  <Wrapper>
    <HorizontalMenu>
      <TabMenu>
        <LinkContainer to='/settings/addresses'>
          <TabMenuItem selected={0}>
            <Icon name='left-arrow' />
          </TabMenuItem>
        </LinkContainer>
      </TabMenu>
    </HorizontalMenu>
    <InnerWrapper>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ display: 'flex' }} weight={400}>
          {account.label}
          {isDefault && (
            <Text size='small' weight={300} style={{ marginLeft: 15 }}>
              <FormattedMessage id='scene.settings.manage_addresses.is_default' defaultMessage='Default' />
            </Text>
          )}
        </Text>
        <ComponentDropdown
          down
          forceSelected
          color={'gray-5'}
          selectedComponent={<MoreOptions />}
          components={[
            <OptionItem id='scenes.settings.manage_addresses.edit_name' defaultMessage='Edit Name' onClick={oneditBtcAccountLabel} />,
            (!isDefault && <OptionItem id='scenes.settings.manage_addresses.make_default' defaultMessage='Make Default' onClick={onMakeDefault} />),
            (!isDefault && <OptionItem id='scenes.settings.manage_addresses.archive' defaultMessage='Archive' onClick={onSetArchived} />),
            <OptionItem id='scenes.settings.manage_addresses.show_xpub' defaultMessage='Show xPub' onClick={onShowXPub} />
          ].filter(x => x)} />
      </div>
      <Text weight={400} size='small' style={{ marginTop: 25 }}>
        <FormattedMessage id='scenes.settings.manage_addresses.unused_addresses' defaultMessage='Unused Addresses' />
      </Text>
      <Text weight={200} size='small' style={{ marginTop: 10, marginBottom: 15 }}>
        <FormattedMessage id='scenes.settings.manage_addresses.unused_addresses.message' defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are the subset of addresses that are labeled.' />
      </Text>
      {labels.length === 0 ? null : (
        <AddressesTable>
          {labels.map(entry => (
            <AddressesTableEntry key={entry.index} {...{ entry, deriveAddress, onEditLabel, onDeleteLabel }} />
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
