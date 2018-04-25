import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Banner, Text, IconButton, Link, ComponentDropdown } from 'blockchain-info-components'
import UnusedAddressesTable from './UnusedAddressesTable'
import UnusedAddressesTableEntry from './UnusedAddressesTableEntry'
import OptionItem from '../../OptionItem'

const Fragment = React.Fragment

const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.manage_addresses.more_options' defaultMessage='More Options' />
  </Link>
)

const WalletLabelCell = styled.div`
  display: flex;
  align-items: center;
`

const UnusedAddressesTemplate = ({ account, labels, receiveIndex, isDefault, deriveAddress, onSetLabel, onEditLabel, onDeleteLabel, onEditBtcAccountLabel, onShowXPub, onMakeDefault, onSetArchived }) => (
  <Fragment>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <WalletLabelCell>
        <Text weight={400} style={{ marginRight: 10 }}>
          {account.label}
        </Text>
        {isDefault && (
          <Banner label>
            <FormattedMessage id='scene.settings.manage_addresses.is_default' defaultMessage='Default' />
          </Banner>
        )}
      </WalletLabelCell>
      <ComponentDropdown
        down
        forceSelected
        color={'gray-5'}
        selectedComponent={<MoreOptions />}
        components={[
          <OptionItem id='scenes.settings.manage_addresses.edit_name' defaultMessage='Edit Name' onClick={onEditBtcAccountLabel} />,
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
      <UnusedAddressesTable>
        {labels.map(entry => (
          <UnusedAddressesTableEntry key={entry.index} {...{ entry, deriveAddress, onEditLabel, onDeleteLabel }} />
        ))}
      </UnusedAddressesTable>
    )}
    {receiveIndex.cata({
      Success: (index) => (
        <IconButton style={{ marginTop: 15 }} name='plus' onClick={() => onSetLabel(index, 'New Address')}>
          <FormattedMessage id='scenes.settings.manage_addresses.add_label' defaultMessage='Add Next Address' />
        </IconButton>
      ),
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })}
  </Fragment>
)

export default UnusedAddressesTemplate
