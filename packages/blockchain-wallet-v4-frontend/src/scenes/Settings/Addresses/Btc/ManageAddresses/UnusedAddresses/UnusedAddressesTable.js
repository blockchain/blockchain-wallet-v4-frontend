import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Table, TableHeader, TableCell } from 'blockchain-info-components'

const UnusedAddressesTable = ({ children }) => (
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
          <FormattedMessage id='scenes.settings.addresses.actions_label' defaultMessage='Actions' />
        </Text>
      </TableCell>
    </TableHeader>
    {children}
  </Table>
)

export default UnusedAddressesTable
