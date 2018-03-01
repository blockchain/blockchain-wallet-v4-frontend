import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { Table, TableHeader, TableCell, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import OptionItem from '../OptionItem'
import AddressRow from '../AddressRow'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const ArchivedAddressesContainer = SettingHeader.extend`
  justify-content: flex-start;
  margin-top: 30px;
`

const Success = ({ archivedAddresses, onToggleArchived }) => {
  const archivedAddressesTableRows = archivedAddresses.map((address) => (
    <AddressRow key={address.addr} address={address} renderOptions={() => [
      <OptionItem id='scenes.settings.addresses.unarchive' defaultMessage='Unarchive' onClick={() => onToggleArchived(address)} />
    ]} />
  ))

  return (
    <Wrapper>
      <ArchivedAddressesContainer>
        <FormattedMessage id='scenes.settings.addresses.archived_addrs' defaultMessage='Archived Bitcoin Addresses' />
      </ArchivedAddressesContainer>
      <SettingDescription style={spacing('mb-10')}>
        <FormattedMessage id='scenes.settings.addresses.archived_addrs_desc' defaultMessage='Archived addresses are addresses you may not need anymore that are hidden from the main view but still a part of your wallet. You can unarchive them any time.' />
      </SettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='80%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.archived_addrs.address' defaultMessage='Address' />
            </Text>
          </TableCell>
        </TableHeader>
        {archivedAddressesTableRows}
      </Table>
    </Wrapper>
  )
}

export default Success
