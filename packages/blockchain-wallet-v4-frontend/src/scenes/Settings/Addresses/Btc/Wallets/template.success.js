import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { Table, TableHeader, TableCell, TableRow, Text, IconButton, Link } from 'blockchain-info-components'
import { filter, take } from 'ramda'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const BitcoinWalletsAddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
`
const WalletTableCell = styled(TableCell)`
  align-items: center;
  min-height: 23px;
`
const InfoLabel = styled(Text)`
  display: block;
  margin-left: 10px;
  padding: 4px;
  box-sizing: border-box;
  border-radius: 3px;
  background-color: ${props => props.theme[props.bgcolor]};
  color: ${props => props.theme['white']};
  font-size: 12px;
  font-weight: 400;
  height: 22px;
`

const Success = ({ wallets, handleClick, onUnarchive, search }) => {
  const isMatch = (wallet) => !search || wallet.label.toLowerCase().indexOf(search) > -1

  const walletTableRows = filter(isMatch, wallets).map((wallet) => {
    return (
      <TableRow key={wallet.index}>
        <WalletTableCell width='40%' style={{ display: 'flex' }}>
          <Text size='13px'>{wallet.label}</Text>
          {wallet.default && <InfoLabel bgcolor='brand-primary'>Default</InfoLabel>}
          {wallet.archived && <InfoLabel bgcolor='gray-3'>Archived</InfoLabel>}
        </WalletTableCell>
        <TableCell width='40%'>
          <SwitchableDisplay size='13px' coin='BTC'>{wallet.balance}</SwitchableDisplay>
        </TableCell>
        <TableCell width='20%'>
          {wallet.archived ? (
            <Link weight={200} size='small' onClick={() => onUnarchive(wallet.index)}>
              <FormattedMessage id='scenes.settings.addresses.unarchive' defaultMessage='Unarchive' />
            </Link>
          ) : (
            <LinkContainer to={`/settings/addresses/btc/${wallet.index}`}>
              <Link weight={200} size='small'>
                <FormattedMessage id='scenes.settings.addresses.manage' defaultMessage='Manage' />
              </Link>
            </LinkContainer>
          )}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <BitcoinWalletsAddressesSettingHeader>
        <FormattedMessage id='scenes.settings.addresses.bitcoin_wallets' defaultMessage='Bitcoin Wallets' />
      </BitcoinWalletsAddressesSettingHeader>
      <SettingDescription>
        <FormattedMessage id='scenes.settings.addresses.bitcoin_wallets_description' defaultMessage='Wallets are a way of organizing your funds. Common ways to organize your funds include dividing them up into categories like spending, savings, or business related expenses. Your wallet automatically manages your bitcoin addresses for you by generating a new one each time you need one to receive a payment. You can click on Manage to the right of a wallet to see all of the individual addresses that have been generated for that specific wallet.' />
      </SettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='40%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.addresses.wallet_name' defaultMessage='Wallet Name' />
            </Text>
          </TableCell>
          <TableCell width='40%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.settings.addresses.wallet_description' defaultMessage='Balance' />
            </Text>
          </TableCell>
        </TableHeader>
        { walletTableRows }
      </Table>
      <IconButton style={{ marginTop: 10 }} name='up-arrow-in-circle' onClick={handleClick}>
        <FormattedMessage id='scenes.settings.wallets.new_hd_account' defaultMessage='New Wallet' />
      </IconButton>
    </Wrapper>
  )
}

export default Success
