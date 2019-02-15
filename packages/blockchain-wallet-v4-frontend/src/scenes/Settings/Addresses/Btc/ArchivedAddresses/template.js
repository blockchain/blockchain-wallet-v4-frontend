import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { Table, TableHeader, TableCell, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import AddressRow from '../AddressRow'
import { filter } from 'ramda'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const ArchivedAddressesContainer = styled(SettingHeader)`
  justify-content: flex-start;
  margin-top: 30px;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const Success = ({ archivedAddresses, onToggleArchived, onDelete, search }) => {
  const isMatch = address =>
    !search || address.addr.toLowerCase().indexOf(search) > -1
  const archivedAddressesTableRows = filter(isMatch, archivedAddresses).map(
    address => (
      <AddressRow
        key={address.addr}
        archived
        address={address}
        dataE2e='btcArchivedAddressRow'
        renderOptions={() => [
          <ClickableText
            size='small'
            onClick={() => onToggleArchived(address)}
            data-e2e='btcUnarchivedAddressLink'
          >
            <FormattedMessage
              id='scenes.settings.addresses.unarchive'
              defaultMessage='Unarchive'
            />
          </ClickableText>,
          <ClickableText
            size='small'
            onClick={() => onDelete(address)}
            data-e2e='btcDeleteArchivedAddressLink'
          >
            <FormattedMessage
              id='scenes.settings.addresses.delete_address'
              defaultMessage='Delete'
            />
          </ClickableText>
        ]}
      />
    )
  )

  return archivedAddressesTableRows.length > 0 ? (
    <Wrapper>
      <ArchivedAddressesContainer>
        <FormattedMessage
          id='scenes.settings.addresses.btc.archivedaddresses.title'
          defaultMessage='Archived Bitcoin Addresses'
        />
      </ArchivedAddressesContainer>
      <SettingDescription style={spacing('mb-10')}>
        <FormattedMessage
          id='scenes.settings.addresses.btc.archivedaddresses.description'
          defaultMessage='Archived addresses are addresses you may not need anymore that are hidden from the main view but still a part of your wallet. You can unarchive them any time.'
        />
      </SettingDescription>
      <Table dataE2e='btcArchivedAddressesTable'>
        <TableHeader>
          <TableCell width='50%'>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.btc.archivedaddresses.address'
                defaultMessage='Address'
              />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.btc.archivedaddresses.balance'
                defaultMessage='Balance'
              />
            </Text>
          </TableCell>
          <TableCell
            width='20%'
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.btc.archivedaddresses.actions'
                defaultMessage='Actions'
              />
            </Text>
          </TableCell>
        </TableHeader>
        {archivedAddressesTableRows}
      </Table>
    </Wrapper>
  ) : null
}

export default Success
