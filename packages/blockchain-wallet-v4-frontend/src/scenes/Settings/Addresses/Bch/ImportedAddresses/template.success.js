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
const ImportedAddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
  margin-top: 30px;
`

const Success = (props) => {
  const { importedAddresses } = props

  const importedAddressesTableRows = importedAddresses.map((address, i) => {
    return (
      <TableRow key={i}>
        <TableCell width='50%'>
          <Text size='13px'>{address.addr}</Text>
        </TableCell>
        <TableCell width='30%'>
          <Text size='13px'><SwitchableDisplay coin='BCH'>{address.info && address.info.final_balance}</SwitchableDisplay></Text>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <ImportedAddressesSettingHeader>
        <FormattedMessage id='scenes.settings.addresses.imported_bch_addrs' defaultMessage='Imported Bitcoin Cash Addresses' />
      </ImportedAddressesSettingHeader>
      <AddressesSettingDescription>
        <FormattedMessage id='scenes.settings.addresses.imported_bch_addrs_desc' defaultMessage='⚠️ Not backed up by your Recovery Phrase. Transfer into a wallet to secure funds.' />
      </AddressesSettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='50%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.imported_addresses.address' defaultMessage='Address' />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.imported_addresses.wallet_description' defaultMessage='Balance' />
            </Text>
          </TableCell>
        </TableHeader>
        {importedAddressesTableRows}
      </Table>
    </Wrapper>
  )
}

export default Success
