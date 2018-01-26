import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { Table, TableHeader, TableCell, TableRow, Text } from 'blockchain-info-components'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const AddressesSettingDescription = SettingDescription.extend`
  margin-bottom: 10px;
`
const ArchivedAddressesContainer = SettingHeader.extend`
  justify-content: flex-start;
  margin-top: 30px;
`

const Success = (props) => {
  const { archivedAddresses } = props

  const archivedAddressesTableRows = archivedAddresses.map((address, i) => {
    return (
      <TableRow key={i}>
        <TableCell width='30%'>
          <Text size='13px'>{address}</Text>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <ArchivedAddressesContainer>
        <FormattedMessage id='scenes.settings.addresses.archived_addrs' defaultMessage='Archived Bitcoin Addresses' />
      </ArchivedAddressesContainer>
      <AddressesSettingDescription>
        <FormattedMessage id='scenes.settings.addresses.archived_addrs_desc' defaultMessage='Archived addresses are addresses you may not need anymore that are hidden from the main view but still a part of your wallet. You can unarchive them any time.' />
      </AddressesSettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.archived_addrs.address' defaultMessage='Address' />
            </Text>
          </TableCell>
        </TableHeader>
        { archivedAddressesTableRows }
      </Table>
    </Wrapper>
  )
}

export default Success
