import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { Table, TableHeader, TableCell, TableRow, Text } from 'blockchain-info-components'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const BitcoinWalletsAddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
`
const AddressesSettingDescription = SettingDescription.extend`
  margin-bottom: 10px;
`

const Success = (props) => {
  const { wallets } = props

  const walletTableRows = wallets.map((wallet, i) => {
    return (
      <TableRow key={i}>
        <TableCell width='30%'>
          <Text size='13px'>{wallet.label}</Text>
        </TableCell>
        <TableCell width='30%'>
          <Text size='13px'><SwitchableDisplay coin='BTC'>{wallet.value.balance}</SwitchableDisplay></Text>
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <BitcoinWalletsAddressesSettingHeader>
        <FormattedMessage id='scenes.settings.addresses.bitcoin_wallets' defaultMessage='Bitcoin Wallets' />
      </BitcoinWalletsAddressesSettingHeader>
      <AddressesSettingDescription>
        <FormattedMessage id='scenes.settings.addresses.bitcoin_wallets_description' defaultMessage='Wallets are a way of organizing your funds. Common ways to organize your funds include dividing them up into categories like spending, savings, or business related expenses. Your wallet automatically manages your bitcoin addresses for you by generating a new one each time you need one to receive a payment. You can click on Manage to the right of a wallet to see all of the individual addresses that have been generated for that specific wallet.' />
      </AddressesSettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.addresses.wallet_name' defaultMessage='Wallet Name' />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.addresses.wallet_description' defaultMessage='Balance' />
            </Text>
          </TableCell>
        </TableHeader>
        { walletTableRows }
      </Table>
    </Wrapper>
  )
}

export default Success
