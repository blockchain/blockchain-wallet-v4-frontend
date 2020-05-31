import {
  Banner,
  ComponentDropdown,
  Link,
  TableCell,
  TableRow,
  Text
} from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'

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

const MoreOptions = () => (
  <Link
    weight={400}
    size='small'
    data-e2e='importedAddressesMoreOptionsDropdown'
  >
    <FormattedMessage
      id='scenes.settings.addresses.btc.addressrow.moreoptions'
      defaultMessage='More Options'
    />
  </Link>
)

const AddressRow = ({ address, archived, coin, renderOptions, dataE2e }) => {
  return (
    <TableRow dataE2e={dataE2e}>
      <AddressTableCell width='50%'>
        <AddressCell
          size='13px'
          data-e2e={`${
            archived ? 'archived' : 'unarchived'
          }ImportedAddressName`}
        >
          {address.addr}
        </AddressCell>
        {address.priv == null && (
          <Banner label type='informational' data-e2e='nonSpendableBadge'>
            <FormattedMessage
              id='scenes.settings.addresses.btc.addressrow.watchonly'
              defaultMessage='Non-Spendable'
            />
          </Banner>
        )}
      </AddressTableCell>
      <TableCell width='20%'>
        <Text size='13px' weight={300}>
          {address.label ? address.label : ''}
        </Text>
      </TableCell>
      <TableCell width='10%'>
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
            color={'grey700'}
            selectedComponent={<MoreOptions />}
            components={renderOptions()}
          />
        )}
      </TableCell>
    </TableRow>
  )
}

export default AddressRow
