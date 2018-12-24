import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import {
  Banner,
  TableCell,
  TableRow,
  Text,
  Link,
  ComponentDropdown
} from 'blockchain-info-components'
import media from 'services/ResponsiveService'

const AddressTableCell = styled(TableCell)`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 23px;

  ${media.mobile`
    flex-direction: column;
    align-items: flex-start;
  `};
`
const AddressCell = styled(Text)`
  margin-right: 6px;
  word-break: break-all;
`
const AddressLink = styled(Link)`
  color: ${props => props.archived && props.theme['gray-5']};
  &:hover {
    color: ${props => props.archived && props.theme['gray-5']};
    cursor: ${props => props.archived && 'default'};
  }
`

export const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage
      id='scenes.settings.addresses.btc.addressrow.moreoptions'
      defaultMessage='More Options'
    />
  </Link>
)

const AddressRow = ({ address, archived, coin, renderOptions, onAddressClick }) => {
  return (
    <TableRow>
      <AddressTableCell width='50%'>
        <AddressCell>
          <AddressLink size='13px' weight={300} onClick={onAddressClick} archived={archived}>
            {address.addr}
          </AddressLink>
        </AddressCell>
        {address.priv == null && (
          <Banner label type='informational'>
            <FormattedMessage
              id='scenes.settings.addresses.btc.addressrow.watchonly'
              defaultMessage='Non-Spendable'
            />
          </Banner>
        )}
      </AddressTableCell>
      <TableCell width='30%'>
        {!archived && (
          <SwitchableDisplay size='13px' coin={coin || 'BTC'}>
            {address.info && address.info.final_balance}
          </SwitchableDisplay>
        )}
      </TableCell>
      <TableCell
        width='20%'
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        {renderOptions && (
          <ComponentDropdown
            down
            forceSelected
            color={'gray-5'}
            selectedComponent={<MoreOptions />}
            components={renderOptions()}
          />
        )}
      </TableCell>
    </TableRow>
  )
}

export default AddressRow
