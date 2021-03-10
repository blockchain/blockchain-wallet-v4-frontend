import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Banner,
  ComponentDropdown,
  Link,
  TableCell,
  TableRow,
  Text
} from 'blockchain-info-components'
import { CoinType, ImportedAddrType } from 'blockchain-wallet-v4/src/types'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { media } from 'services/styles'

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
    weight={500}
    size='13px'
    data-e2e='importedAddressesMoreOptionsDropdown'
  >
    <FormattedMessage id='buttons.manage' defaultMessage='Manage' />
  </Link>
)

const AddressRow = ({
  address,
  archived,
  coin,
  dataE2e,
  renderOptions
}: {
  address: ImportedAddrType
  archived?: boolean
  coin?: CoinType
  dataE2e: string
  renderOptions: any
}) => {
  return (
    <TableRow data-e2e={dataE2e}>
      <AddressTableCell width='50%'>
        <AddressCell
          weight={500}
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
        {!archived && (
          <SwitchableDisplay size='13px' coin={coin || 'BTC'} weight={500}>
            {address.info && address.info.final_balance}
          </SwitchableDisplay>
        )}
      </TableCell>
      <TableCell width='20%'>
        <Text size='13px' weight={500}>
          {address.label ? address.label : ''}
        </Text>
      </TableCell>
      <TableCell
        width='10%'
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        {renderOptions && (
          <div>
            <ComponentDropdown
              color='grey900'
              components={renderOptions()}
              down
              forceSelected
              margin='0 3px 0 0'
              selectedComponent={<MoreOptions />}
              textAlign='end'
              width='100px'
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

export default AddressRow
