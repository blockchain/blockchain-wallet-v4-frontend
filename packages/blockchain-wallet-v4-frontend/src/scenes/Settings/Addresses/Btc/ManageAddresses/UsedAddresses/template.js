import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import UsedAddressesTable from './UsedAddressesTable'
import UsedAddressesTableEntry from './UsedAddressesTableEntry'
import { Text, Link } from 'blockchain-info-components'

const Fragment = React.Fragment
const Header = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const UsedAddressesTemplate = ({ onShowUsedAddresses, usedAddressesVisible, usedAddresses }) => (
  <Fragment>
    <Header>
      <Text weight={400} size='14px' style={{ marginRight: '16px' }}>
        <FormattedMessage id='scenes.settings.manage_addresses.used_addresses' defaultMessage='Used Addresses' />
      </Text>
      <Link weight={200} size='12px' onClick={onShowUsedAddresses}>
        { usedAddressesVisible ? <FormattedMessage id='scenes.settings.manage_addresses.hide_used_addresses' defaultMessage='Hide' /> : (
          <FormattedMessage id='scenes.settings.manage_addresses.show_used_addresses' defaultMessage='Show' />
        )}
      </Link>
    </Header>
    { !usedAddressesVisible ? null : (
      <UsedAddressesTable>
        {usedAddresses.map((address, i) => (
          <UsedAddressesTableEntry key={i} address={address} />
        ))}
      </UsedAddressesTable>
    )}
  </Fragment>
)

export default UsedAddressesTemplate
