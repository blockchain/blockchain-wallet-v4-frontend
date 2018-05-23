import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter, take } from 'ramda'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { Banner, ComponentDropdown, Link, Table, TableHeader, TableCell, TableRow, Text } from 'blockchain-info-components'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const BchWalletsAddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
`
const WalletTableCell = styled(TableCell)`
  align-items: center;
  min-height: 23px;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`
const LabelCell = styled(Text)`
  margin-right: 6px;
`

const Manage = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.addresses.bch.wallets.manage' defaultMessage='Manage Wallet' />
  </Link>
)

const Success = (props) => {
  const { bchAccounts, wallets, defaultId } = props.data
  const { onEditBchAccountLabel, onMakeDefault, onSetArchived, onShowXPub, search } = props

  const isMatch = (wallet) => !search || wallet.label.toLowerCase().indexOf(search) > -1

  const walletTableRows = filter(isMatch, take(bchAccounts.length, wallets)).map((wallet, i) => {
    const isDefault = i === defaultId
    const isArchived = bchAccounts[i].archived

    return (
      <TableRow key={i}>
        <WalletTableCell width='50%'>
          <LabelCell size='13px'>{wallet.label}</LabelCell>
          {isDefault && <Banner label><FormattedMessage id='scenes.settings.addresses.bch.wallets.defaultlabel' defaultMessage='Default' /></Banner>}
          {isArchived && <Banner label type='informational'><FormattedMessage id='scenes.settings.addresses.bch.wallets.archivedlabel' defaultMessage='Archived' /></Banner>}
        </WalletTableCell>
        <TableCell width='30%'>
          {!isArchived && <SwitchableDisplay size='13px' coin='BCH'>{wallet.value.balance}</SwitchableDisplay>}
        </TableCell>
        <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ComponentDropdown
            down
            forceSelected
            color={'gray-5'}
            selectedComponent={<Manage />}
            components={[
              <ClickableText size='small' onClick={() => onEditBchAccountLabel(wallet.value)}>
                <FormattedMessage id='scenes.settings.addresses.bch.edit_name' defaultMessage='Edit Wallet Name' />
              </ClickableText>,
              (!isDefault && !isArchived && <ClickableText size='small' onClick={() => onMakeDefault(wallet.value)}>
                <FormattedMessage id='scenes.settings.addresses.bch.make_default' defaultMessage='Make Default' />
              </ClickableText>),
              (!isDefault &&
                (isArchived
                  ? <ClickableText size='small' onClick={() => onSetArchived(wallet.value, false)}>
                    <FormattedMessage id='scenes.settings.addresses.bch.unarchive' defaultMessage='Unarchive' />
                  </ClickableText>
                  : <ClickableText size='small' onClick={() => onSetArchived(wallet.value, true)}>
                    <FormattedMessage id='scenes.settings.addresses.bch.archive' defaultMessage='Archive' />
                  </ClickableText>)),
              (!isArchived && <ClickableText size='small' onClick={() => onShowXPub(wallet.value)}>
                <FormattedMessage id='scenes.settings.addresses.bch.show_xpub' defaultMessage='Show xPub' />
              </ClickableText>)
            ].filter(x => x)} />
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <BchWalletsAddressesSettingHeader>
        <FormattedMessage id='scenes.settings.addresses.bch.wallets.title' defaultMessage='Bitcoin Cash Wallets' />
      </BchWalletsAddressesSettingHeader>
      <SettingDescription>
        <FormattedMessage id='scenes.settings.addresses.bch.wallets.description' defaultMessage='Wallets allow you to organize your funds into categories, like spending or savings. To see all of the individual addresses that have been generated for each wallet, click on ‘Manage‘.' />
      </SettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='50%'>
            <Text size='13px' weight={500}>
              <FormattedMessage id='scenes.settings.addresses.bch.wallets.walletname' defaultMessage='Wallet Name' />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='13px' weight={500}>
              <FormattedMessage id='scenes.settings.addresses.bch.wallets.balance' defaultMessage='Balance' />
            </Text>
          </TableCell>
          <TableCell width='20%' style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Text size='13px' weight={500}>
              <FormattedMessage id='scenes.settings.addresses.bch.wallets.actions' defaultMessage='Actions' />
            </Text>
          </TableCell>
        </TableHeader>
        {walletTableRows}
      </Table>
    </Wrapper>
  )
}

export default Success
