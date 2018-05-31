import React from 'react'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/Display/CoinDisplay'
import { Link, Text, Table, TableHeader, TableRow, TableCell } from 'blockchain-info-components'

const UsedTable = ({ children }) => (
  <Table>
    <TableHeader>
      <TableCell width='40%'>
        <Text size='13px' weight={500}>
          <FormattedMessage id='scenes.settings.addresses.address' defaultMessage='Address' />
        </Text>
      </TableCell>
      <TableCell width='40%'>
        <Text size='13px' weight={500}>
          <FormattedMessage id='scenes.settings.addresses.address_label' defaultMessage='Label' />
        </Text>
      </TableCell>
      <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Text size='13px' weight={500}>
          <FormattedMessage id='scenes.settings.addresses.address_balance' defaultMessage='Balance' />
        </Text>
      </TableCell>
    </TableHeader>
    {children}
  </Table>
)

const UsedTableEntry = ({ address, search }) => {
  const isMatch = () => {
    return !search ||
      address.address.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      (address.label && address.label.toLowerCase().indexOf(search.toLowerCase()) > -1)
  }

  return !isMatch()
    ? null
    : (
      <TableRow>
        <TableCell width='40%'>
          <Link href={`https://blockchain.info/address/${address.address}`} size='small' weight={300} target='_blank'>
            {address.address}
          </Link>
        </TableCell>
        <TableCell width='40%'>
          <Text size='13px'>
            {address.label}
          </Text>
        </TableCell>
        <TableCell style={{display: 'flex', justifyContent: 'flex-end'}} width='20%'>
          <Text size='13px'>
            <CoinDisplay coin={'BTC'} size='13px' weight={300}>{address.final_balance}</CoinDisplay>
          </Text>
        </TableCell>
      </TableRow>
    )
}

const UsedAddressesTable = ({ usedAddresses, search }) => (
  <React.Fragment>
    <Text weight={200} size='small' style={{ marginTop: 10, marginBottom: 15 }}>
      <FormattedMessage id='scenes.settings.manage_addresses.used_addresses_message' defaultMessage='Previously used addresses are helpful for debugging purposes and viewing associated balances. For privacy reasons, we do not recommend re-using these addresses. Change addresses are not included here.'/>
    </Text>
    { usedAddresses.length
      ? <UsedTable>{usedAddresses.map((address, i) => (<UsedTableEntry key={i} address={address} search={search} />))}</UsedTable>
      : <Text weight={300} style={{ marginTop: 10, textAlign: 'center' }}><FormattedMessage id='scenes.settings.manage_addresses.no_used_addresses_message' defaultMessage='This wallet has no previously used addresses.'/></Text>
    }
  </React.Fragment>
)

export default UsedAddressesTable
