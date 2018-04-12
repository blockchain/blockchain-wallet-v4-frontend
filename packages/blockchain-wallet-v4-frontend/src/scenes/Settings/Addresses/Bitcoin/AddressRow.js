import React from 'react'
import { FormattedMessage } from 'react-intl'
import { TableCell, TableRow, Text, Link, ComponentDropdown } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.manage_addresses.more_options' defaultMessage='More Options' />
  </Link>
)

const AddressRow = ({ address, renderOptions }) => (
  <TableRow>
    <TableCell width='40%' style={{ display: 'flex' }}>
      <Text size='13px'>{address.addr}</Text>
      {address.priv == null && (
        <Text size='13px' weight={300} style={spacing('ml-10')}>Watch Only</Text>
      )}
    </TableCell>
    <TableCell width='40%'>
      <SwitchableDisplay size='13px' coin='BTC'>{address.info && address.info.final_balance}</SwitchableDisplay>
    </TableCell>
    <TableCell width='20%'>
      <ComponentDropdown down forceSelected color={'gray-5'} selectedComponent={<MoreOptions />} components={renderOptions()} />
    </TableCell>
  </TableRow>
)

export default AddressRow
