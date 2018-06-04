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
// TODO: finish this feature
const usedAddresses = []
const UsedAddressesTemplate = ({ onShowUsedAddresses, usedAddressesVisible }) => (
  <Fragment>
    <Header>
      <Text weight={400} size='14px' style={{ marginRight: '16px' }}>
        <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.title' defaultMessage='Used Addresses' />
      </Text>
      <Link weight={200} size='12px' onClick={onShowUsedAddresses}>
        { usedAddressesVisible ? <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.hide' defaultMessage='Hide' /> : (
          <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.show' defaultMessage='Show' />
        )}
      </Link>
    </Header>
    { !usedAddressesVisible ? null : (
      <UsedAddressesTable>
        {usedAddresses.map((address, i) => (
          <UsedAddressesTableEntry key={i} />
        ))}
      </UsedAddressesTable>
    )}
  </Fragment>
)

export default UsedAddressesTemplate
