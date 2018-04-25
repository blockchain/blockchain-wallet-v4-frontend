import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { TableCell, TableRow, Text, Link, ComponentDropdown } from 'blockchain-info-components'

const AddressTableCell = styled(TableCell)`
  align-items: center;
  min-height: 23px;
`
const InfoLabel = styled(Text)`
  display: block;
  margin-left: 10px;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 3px;
  background-color: ${props => props.theme['gray-3']};
  color: ${props => props.theme['white']};
  font-size: 12px;
  font-weight: 400;
  height: 22px;
`

const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.manage_addresses.more_options' defaultMessage='More Options' />
  </Link>
)

const AddressRow = ({ address, coin, renderOptions }) => {
  return (
    <TableRow>
      <AddressTableCell width='40%' style={{ display: 'flex' }}>
        <Text size='13px'>{address.addr}</Text>
        {address.priv == null && (
          <InfoLabel>
            <FormattedMessage id='scenes.settings.manage_addresses.watch_only' defaultMessage='Watch Only' />
          </InfoLabel>
        )}
      </AddressTableCell>
      <TableCell width='40%'>
        <SwitchableDisplay size='13px' coin={coin || 'BTC'}>{address.info && address.info.final_balance}</SwitchableDisplay>
      </TableCell>
      <TableCell width='20%'>
        { renderOptions && <ComponentDropdown down forceSelected color={'gray-5'} selectedComponent={<MoreOptions />} components={renderOptions()} /> }
      </TableCell>
    </TableRow>
  )
}

export default AddressRow
