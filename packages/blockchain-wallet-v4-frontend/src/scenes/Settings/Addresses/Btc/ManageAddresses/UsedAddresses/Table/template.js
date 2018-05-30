import React from 'react'
import { FormattedMessage } from 'react-intl'

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

const UsedTableEntry = ({ address }) => {
  return (
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
          {address.final_balance}
        </Text>
      </TableCell>
    </TableRow>
  )
}

const UsedAddressesTable = ({ usedAddresses }) => (
  <React.Fragment>
    <Text weight={200} size='small' style={{ marginTop: 10, marginBottom: 15 }}>
      <FormattedMessage id='scenes.settings.manage_addresses.used_addresses_message' defaultMessage='Previously used addresses are helpful for debugging purposes and viewing associated balances. For privacy reasons, we do not recommend re-using these addresses. Change addresses are not included here.'/>
    </Text>
    <UsedTable>
      {usedAddresses && usedAddresses.map((address, i) => (
        <UsedTableEntry key={i} address={address} />
      ))}
    </UsedTable>
  </React.Fragment>
)

export default UsedAddressesTable
