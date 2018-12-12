import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter, take } from 'ramda'

import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import {
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Text
} from 'blockchain-info-components'
import media from 'services/ResponsiveService'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const BchWalletsAddressesSettingHeader = SettingHeader.extend`
  justify-content: flex-start;
`
const WalletTableCell = styled(TableCell)`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 23px;

  ${media.mobile`
    flex-direction: column;
    align-items: flex-start;
  `};
`
const ActionsCell = styled(TableCell)`
  display: flex;
  justify-content: flex-end;
  & > :first-child {
    margin-right: 10px;
  }
`
const ClickableText = styled(Text)`
  cursor: pointer;
  color: ${props => props.theme['brand-secondary']};
`
const LabelCell = styled(Text)`
  margin-right: 6px;
`

const BsvWallets = props => {
  const { bchAccounts, wallets } = props.data
  const { search } = props

  const isMatch = wallet =>
    !search || wallet.label.toLowerCase().indexOf(search) > -1

  return (
    <Wrapper>
      <BchWalletsAddressesSettingHeader>
        <FormattedMessage
          id='scenes.settings.addresses.bsv.wallets.title'
          defaultMessage='Bitcoin SV Wallets'
        />
      </BchWalletsAddressesSettingHeader>
      <SettingDescription>
        <FormattedMessage
          id='scenes.settings.addresses.bsv.wallets.description'
          defaultMessage='Bitcoin SV was a fork of Bitcoin Cash. Claim your shitcoins today.'
        />
      </SettingDescription>
      <Table>
        <TableHeader>
          <TableCell width='50%'>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.bch.wallets.walletname'
                defaultMessage='Wallet Name'
              />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.bch.wallets.balance'
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
                id='scenes.settings.addresses.bch.wallets.actions'
                defaultMessage='Actions'
              />
            </Text>
          </TableCell>
        </TableHeader>
        {filter(isMatch, take(bchAccounts.length, wallets)).map((wallet, i) => (
          <TableRow key={i}>
            <WalletTableCell width='50%'>
              <LabelCell size='13px'>{wallet.label}</LabelCell>
            </WalletTableCell>
            <TableCell width='30%'>
              <SwitchableDisplay size='13px' coin='BCH'>
                {wallet.value.balance}
              </SwitchableDisplay>
            </TableCell>
            <ActionsCell width='20%'>
              <ClickableText size='13px' onClick={() => {}}>
                <FormattedMessage
                  id='scenes.settings.addresses.bsv.send'
                  defaultMessage='Send'
                />
              </ClickableText>
              <ClickableText size='13px' onClick={() => {}}>
                <FormattedMessage
                  id='scenes.settings.addresses.bsv.swap'
                  defaultMessage='Swap'
                />
              </ClickableText>
            </ActionsCell>
          </TableRow>
        ))}
      </Table>
    </Wrapper>
  )
}

export default BsvWallets
