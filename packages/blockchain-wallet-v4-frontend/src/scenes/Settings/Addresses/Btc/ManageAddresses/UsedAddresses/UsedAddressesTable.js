import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Table, TableHeader, TableCell } from 'blockchain-info-components'

const Fragment = React.Fragment
const UsedAddressesTable = ({ children }) => (
  <Fragment>
    <Text weight={200} size='small' style={{ marginTop: 10, marginBottom: 15 }}>
      <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.message' defaultMessage='Previously used addresses are helpful for debugging purposes and viewing associated balances. For privacy reasons, we do not recommend re-using these addresses. Change addresses are not included here.' />
    </Text>
    <Table>
      <TableHeader>
        <TableCell width='40%'>
          <Text size='13px' weight={500}>
            <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.address' defaultMessage='Address' />
          </Text>
        </TableCell>
        <TableCell width='40%'>
          <Text size='13px' weight={500}>
            <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.label' defaultMessage='Label' />
          </Text>
        </TableCell>
        <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Text size='13px' weight={500}>
            <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.usedaddresses.usedaddressestable.balance' defaultMessage='Balance' />
          </Text>
        </TableCell>
      </TableHeader>
      {children}
    </Table>
  </Fragment>
)

export default UsedAddressesTable
