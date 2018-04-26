import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Table, TableHeader, TableCell } from 'blockchain-info-components'

const AddressesTable = ({ children }) => (
  <Table>
    <TableHeader>
      <TableCell width='40%'>
        <Text size='13px' weight={500} capitalize>
          <FormattedMessage id='scenes.settings.addresses.address' defaultMessage='Address' />
        </Text>
      </TableCell>
      <TableCell width='40%'>
        <Text size='13px' weight={500} capitalize>
          <FormattedMessage id='scenes.settings.addresses.address_label' defaultMessage='Label' />
        </Text>
      </TableCell>
    </TableHeader>
    {children}
  </Table>
)

export default AddressesTable
