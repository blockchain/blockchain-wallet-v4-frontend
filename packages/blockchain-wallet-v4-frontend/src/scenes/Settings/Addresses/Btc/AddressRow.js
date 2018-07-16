import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { Banner, TableCell, TableRow, Text, Link, ComponentDropdown } from 'blockchain-info-components'

const AddressTableCell = styled(TableCell)`
  align-items: center;
  min-height: 23px;
`
const AddressCell = styled(Text)`
  margin-right: 6px;
`

const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.addresses.btc.addressrow.moreoptions' defaultMessage='More Options' />
  </Link>
)

const AddressRow = ({ address, archived, coin, renderOptions }) => {
  return (
    <TableRow>
      <AddressTableCell width='50%' style={{ display: 'flex' }}>
        <AddressCell size='13px'>{address.addr}</AddressCell>
        {address.priv == null && (
          <Banner label type='informational'><FormattedMessage id='scenes.settings.addresses.btc.addressrow.watchonly' defaultMessage='Non-Spendable' /></Banner>
        )}
      </AddressTableCell>
      <TableCell width='30%'>
        {!archived && <SwitchableDisplay size='13px' coin={coin || 'BTC'}>{address.info && address.info.final_balance}</SwitchableDisplay>}
      </TableCell>
      <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
        { renderOptions && <ComponentDropdown down forceSelected color={'gray-5'} selectedComponent={<MoreOptions />} components={renderOptions()} /> }
      </TableCell>
    </TableRow>
  )
}

export default AddressRow
