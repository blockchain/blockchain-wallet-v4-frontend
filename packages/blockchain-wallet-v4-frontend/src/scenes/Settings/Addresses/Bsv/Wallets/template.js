import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter, take } from 'ramda'

import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import {
  Banner,
  Link,
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
const BchWalletsAddressesSettingHeader = styled(SettingHeader)`
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
const NoSearchMatchCell = styled(WalletTableCell)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px;
`
const LabelCell = styled(Text)`
  margin-right: 6px;
`

const ClickableText = styled(Text)`
  color: ${props => props.theme['brand-secondary']};
  :hover {
    cursor: pointer;
  }
`

const Pipeline = styled.span`
  background: ${props => props.theme['gray-2']};
  margin-right: 8px;
  width: 2px;
`

const Success = props => {
  const { accounts, wallets, defaultIndex } = props.data
  const { search, onSendBsv, onSwapBsv, onUnarchiveWallet } = props
  const isMatch = wallet =>
    !search || wallet.label.toLowerCase().indexOf(search) > -1
  const matchedWallets = filter(isMatch, take(accounts.length, wallets))

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
          id='scenes.settings.addresses.bsv.wallets.desc2'
          defaultMessage='Bitcoin SV was a fork of Bitcoin Cash. You can now send your BSV or Swap for other cryptocurrencies.'
        />
      </SettingDescription>
      <Table dataE2e='bsvWalletsTable'>
        <TableHeader>
          <TableCell style={{ flexBasis: '55%' }}>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.bsv.wallets.name'
                defaultMessage='Wallet Name'
              />
            </Text>
          </TableCell>
          <TableCell style={{ flexBasis: '35%' }}>
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.bsv.wallets.balance'
                defaultMessage='Balance'
              />
            </Text>
          </TableCell>
          <TableCell
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexBasis: '20%'
            }}
          >
            <Text size='13px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.bsv.wallets.actions'
                defaultMessage='Actions'
              />
            </Text>
          </TableCell>
        </TableHeader>
        {search && !matchedWallets.length ? (
          <TableRow dataE2e='bsvWalletNoResults'>
            <NoSearchMatchCell>
              <LabelCell size='13px'>
                <Text size='13px' weight={500}>
                  <FormattedMessage
                    id='scenes.settings.addresses.bsv.wallets.nomatch'
                    defaultMessage='No wallets matched your search'
                  />
                </Text>
              </LabelCell>
            </NoSearchMatchCell>
          </TableRow>
        ) : (
          matchedWallets.map((wallet, i) => {
            const isDefault = i === defaultIndex
            const isArchived = wallet.value.archived
            return (
              <TableRow key={i} dataE2e='bsvWalletRow'>
                <WalletTableCell style={{ flexBasis: '55%' }}>
                  <LabelCell size='13px' data-e2e='bsvWalletName'>
                    {wallet.label}
                  </LabelCell>
                  {isDefault && (
                    <Banner label data-e2e='bsvWalletDefaultBadge'>
                      <FormattedMessage
                        id='scenes.settings.addresses.bsv.wallets.defaultlabel'
                        defaultMessage='Default'
                      />
                    </Banner>
                  )}
                  {isArchived && (
                    <Banner
                      label
                      type='informational'
                      data-e2e='bsvWalletArchivedBadge'
                    >
                      <FormattedMessage
                        id='scenes.settings.addresses.bsv.wallets.archivedlabel'
                        defaultMessage='Archived'
                      />
                    </Banner>
                  )}
                </WalletTableCell>
                <TableCell style={{ flexBasis: '35%' }}>
                  <SwitchableDisplay size='13px' coin='BSV'>
                    {wallet.value.balance}
                  </SwitchableDisplay>
                </TableCell>
                <TableCell
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexBasis: '20%'
                  }}
                >
                  {isArchived ? (
                    <ClickableText
                      weight={400}
                      size='13px'
                      onClick={() => onUnarchiveWallet(i)}
                      data-e2e='bsvUnarchiveWalletLink'
                    >
                      <FormattedMessage
                        id='scenes.settings.addresses.bsv.wallets.unarchive'
                        defaultMessage='Unarchive'
                      />
                    </ClickableText>
                  ) : (
                    <React.Fragment>
                      <ClickableText
                        weight={400}
                        size='13px'
                        onClick={() => onSendBsv(i)}
                        style={{ marginRight: '8px' }}
                        data-e2e='bsvSendLink'
                      >
                        <FormattedMessage
                          id='scenes.settings.addresses.bsv.wallets.send'
                          defaultMessage='Send'
                        />
                      </ClickableText>
                      <Pipeline />
                      <ClickableText
                        weight={400}
                        size='13px'
                        onClick={onSwapBsv}
                        style={{ marginRight: '8px' }}
                        data-e2e='bsvSwapLink'
                      >
                        <Link weight={400} size='13px'>
                          <FormattedMessage
                            id='scenes.settings.addresses.bsv.wallets.swap'
                            defaultMessage='Swap'
                          />
                        </Link>
                      </ClickableText>
                    </React.Fragment>
                  )}
                </TableCell>
              </TableRow>
            )
          })
        )}
      </Table>
    </Wrapper>
  )
}

export default Success
