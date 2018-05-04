import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { Banner, Table, TableHeader, TableCell, TableRow, Text, IconButton, Link } from 'blockchain-info-components'
import { filter } from 'ramda'

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
const LabelCell = styled(Text)`
  margin-right: 6px;
`

const Success = ({ wallets, handleClick, onUnarchive, search }) => {
  const isMatch = (wallet) => !search || wallet.label.toLowerCase().indexOf(search) > -1

  const walletTableRows = filter(isMatch, wallets).map((wallet) => {
    return (
      <TableRow key={wallet.index}>
        <WalletTableCell width='40%' style={{ display: 'flex' }}>
          <LabelCell size='13px'>{wallet.label}</LabelCell>
          {wallet.default && <Banner label><FormattedMessage id='scenes.settings.addresses.default_label' defaultMessage='Default' /></Banner>}
          {wallet.archived && <Banner label type='informational'><FormattedMessage id='scenes.settings.addresses.archived_label' defaultMessage='Archived' /></Banner>}
        </WalletTableCell>
        <TableCell width='40%'>
          <SwitchableDisplay size='13px' coin='BTC'>{wallet.balance}</SwitchableDisplay>
        </TableCell>
        <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        <FormattedMessage id='scenes.settings.addresses.bitcoin_wallets_description' defaultMessage='Wallets allow you to organize your funds into categories, like spending or savings. To see all of the individual addresses that have been generated for each wallet, click on ‘Manage‘.' />
      </SettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='40%'>
            <Text size='13px' weight={500}>
              <FormattedMessage id='scenes.settings.addresses.wallet_name' defaultMessage='Wallet Name' />
            </Text>
          </TableCell>
          <TableCell width='40%'>
            <Text size='13px' weight={500}>
              <FormattedMessage id='scenes.settings.addresses.wallet_description' defaultMessage='Balance' />
            </Text>
          </TableCell>
          <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Text size='13px' weight={500}>
              <FormattedMessage id='scenes.settings.addresses.wallet_actions' defaultMessage='Actions' />
            </Text>
          </TableCell>
        </TableHeader>
        { walletTableRows }
      </Table>
      <IconButton style={{ marginTop: 10 }} name='plus' onClick={handleClick}>
        <FormattedMessage id='scenes.settings.wallets.new_hd_account' defaultMessage='New Wallet' />
      </IconButton>
    </Wrapper>
  )
}

export default Success
