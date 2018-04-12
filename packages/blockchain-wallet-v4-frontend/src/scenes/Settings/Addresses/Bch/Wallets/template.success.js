import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { ComponentDropdown, Link, Table, TableHeader, TableCell, TableRow, Text } from 'blockchain-info-components'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const BchWalletsAddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
`
const AddressesSettingDescription = SettingDescription.extend`
  margin-bottom: 10px;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const InfoLabel = styled(Text)`
  display: block;
  padding: 1px 5px;
  box-sizing: border-box;
  border-radius: 3px;
  background-color: ${props => props.theme[props.bgcolor]};
  color: ${props => props.theme['white']};
  font-size: 12px;
  font-weight: 400;
`

const Manage = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.addresses.manage' defaultMessage='Manage Wallet' />
  </Link>
)

const OptionItem = ({ id, text, onClick }) => (
  <ClickableText size='small' onClick={onClick}>
    <FormattedMessage id={id} defaultMessage={text} />
  </ClickableText>
)

const Success = (props) => {
  const { bchAccounts, wallets, defaultId } = props.data
  const { oneditBchAccountLabel, onMakeDefault, onSetArchived, onShowXPub } = props

  const walletTableRows = wallets.map((wallet, i) => {
    const isDefault = i === defaultId
    const isArchived = bchAccounts[i].archived

    return (
      <TableRow key={i}>
        <TableCell width='50%'>
          <Text size='13px'>{wallet.label}</Text>
          {isDefault && <InfoLabel bgcolor='brand-primary'>Default</InfoLabel>}
          {isArchived && <InfoLabel bgcolor='gray-3'>Archived</InfoLabel>}
        </TableCell>
        <TableCell width='30%'>
          <SwitchableDisplay size='13px' coin='BCH'>{wallet.value.balance}</SwitchableDisplay>
        </TableCell>
        <TableCell width='20%'>
          <ComponentDropdown
            down
            forceSelected
            color={'gray-5'}
            selectedComponent={<Manage />}
            components={[
              <OptionItem id='scenes.settings.addresses.bch.edit_name' text='Edit Wallet Name' onClick={() => oneditBchAccountLabel(wallet.value)} />,
              (!isDefault && !isArchived && <OptionItem id='scenes.settings.addresses.bch.make_default' text='Make Default' onClick={() => onMakeDefault(wallet.value)} />),
              (!isDefault &&
                (isArchived
                  ? <OptionItem id='scenes.settings.addresses.bch.unarchive' text='Unarchive' onClick={() => onSetArchived(wallet.value, false)} />
                  : <OptionItem id='scenes.settings.addresses.bch.archive' text='Archive' onClick={() => onSetArchived(wallet.value, true)} />)),
              (!isArchived && <OptionItem id='scenes.settings.addresses.bch.show_xpub' text='Show xPub' onClick={() => onShowXPub(wallet.value)} />)
            ].filter(x => x)} />
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      <BchWalletsAddressesSettingHeader>
        <FormattedMessage id='scenes.settings.addresses.bch_wallets' defaultMessage='Bitcoin Cash Wallets' />
      </BchWalletsAddressesSettingHeader>
      <AddressesSettingDescription>
        <FormattedMessage id='scenes.settings.addresses.bch_wallets_description' defaultMessage='Wallets are a way of organizing your funds. Common ways to organize your funds include dividing them up into categories like spending, savings, or business related expenses. Your wallet automatically manages your bitcoin cash addresses for you by generating a new one each time you need one to receive a payment. You can click on Manage to the right of a wallet to see all of the individual addresses that have been generated for that specific wallet.' />
      </AddressesSettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='50%'>
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
        {walletTableRows}
      </Table>
    </Wrapper>
  )
}

export default Success
