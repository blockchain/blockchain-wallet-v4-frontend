import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { filter, take } from 'ramda'
import styled from 'styled-components'

import {
  Banner,
  Button,
  Link,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { media } from 'services/styles'

const Wrapper = styled.section`
  box-sizing: border-box;
`
const TableStyled = styled(Table)`
  > div:last-child {
    border-bottom: none;
  }
`
const HeaderWrapper = styled(SettingHeader)`
  align-items: flex-start;
  justify-content: space-between;
`
const TitleHeader = styled(SettingHeader)`
  justify-content: flex-start;
  font-weight: 500;
  font-size: 20px;
`
const SubTitleHeader = styled(SettingDescription)`
  margin-bottom: 20px;
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
const ButtonsWrapper = styled.div`
  display: flex;
  margin-right: 0;
  > button {
    margin-left: 10px;
  }
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
const ErrorWrapper = styled.div`
  margin-bottom: 20px;
`
const ErrorMessageText = styled(Text)`
  margin-top: 5px;
`

const Success = ({
  failure,
  message,
  // onAddNewWallet,
  onClickImport,
  onUnarchive,
  search,
  wallets
}: {
  failure?: any
  message?: any
  // onAddNewWallet: () => void
  onClickImport: () => void
  onUnarchive: (i: any) => void
  search: any
  wallets: Array<any>
}) => {
  const isMatch = wallet =>
    !search || wallet.label.toLowerCase().indexOf(search) > -1
  const matchedWallets = filter(isMatch, take(wallets.length, wallets))

  const walletTableRows = matchedWallets.map(wallet => {
    return (
      <TableRow key={wallet.index} data-e2e='btcWalletRow'>
        <WalletTableCell width='50%'>
          <LabelCell size='13px' weight={500} data-e2e='btcWalletName'>
            {wallet.label}
          </LabelCell>
          {wallet.default && (
            <Banner label='true' data-e2e='btcDefaultWalletBadge'>
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.defaultlabel'
                defaultMessage='Default'
              />
            </Banner>
          )}
          {wallet.archived && (
            <Banner
              label={'true'}
              type='informational'
              data-e2e='btcArchivedWalletBadge'
            >
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.archivedlabel'
                defaultMessage='Archived'
              />
            </Banner>
          )}
        </WalletTableCell>
        <TableCell width='30%'>
          {!wallet.archived && (
            <SwitchableDisplay size='13px' weight={500} coin='BTC'>
              {wallet.balance}
            </SwitchableDisplay>
          )}
        </TableCell>
        <TableCell
          width='20%'
          style={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          {wallet.archived ? (
            <Link
              weight={500}
              size='13px'
              onClick={() => onUnarchive(wallet.index)}
              data-e2e='btcUnarchiveWalletLink'
            >
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.unarchive'
                defaultMessage='Unarchive'
              />
            </Link>
          ) : //   // TODO: SEGWIT remove w/ DEPRECATED_V3
          wallet.type === 'v3' ? (
            <LinkContainer
              to={`/settings/addresses/btc/${wallet.index}/legacy`}
            >
              <Link weight={500} size='13px' data-e2e='btcManageWalletLink'>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.wallets.manage'
                  defaultMessage='Manage'
                />
              </Link>
            </LinkContainer>
          ) : (
            <LinkContainer
              to={`/settings/addresses/btc/${wallet.index}/bech32`}
            >
              <Link weight={500} size='13px' data-e2e='btcManageWalletLink'>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.wallets.manage'
                  defaultMessage='Manage'
                />
              </Link>
            </LinkContainer>
          )}
        </TableCell>
      </TableRow>
    )
  })

  return (
    <Wrapper>
      {failure && (
        <ErrorWrapper>
          <Banner type='warning'>
            <Text size='14px' color='error'>
              <FormattedMessage
                id='scenes.settings.addresses.btc.failurealert'
                defaultMessage='There is an issue with the wallet and this page may have limited functionality, such as balances not showing.'
              />
              <ErrorMessageText size='14px' color='error'>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.failuremessage'
                  defaultMessage='Message: {errorMessage}'
                  values={{
                    errorMessage: message || (
                      <span>
                        Please contact
                        <Link
                          size='14px'
                          href='https://support.blockchain.com/hc/en-us/requests/new'
                          target='_blank'
                        >
                          support
                        </Link>{' '}
                        for help resolving the problem
                      </span>
                    )
                  }}
                />
              </ErrorMessageText>
            </Text>
          </Banner>
        </ErrorWrapper>
      )}
      <HeaderWrapper>
        <div>
          <TitleHeader>
            <FormattedMessage
              id='scenes.settings.addresses.btc.wallets.bitcoinwallets'
              defaultMessage='Bitcoin Wallets'
            />
          </TitleHeader>
          <SubTitleHeader>
            <FormattedMessage
              id='scenes.settings.addresses.btc.wallets.desc'
              defaultMessage='Wallets allow you to organize your funds into categories, like spending or savings.'
            />
          </SubTitleHeader>
        </div>
        <ButtonsWrapper>
          <Button
            data-e2e='btcImportedAddressLink'
            height='36px'
            nature='empty-secondary'
            onClick={onClickImport}
            size='14px'
          >
            <FormattedMessage
              id='scenes.settings.addresses.btc.wallets.import'
              defaultMessage='Import Address'
            />
          </Button>
          {/* // (MAYBE REMOVE FOREVER) TODO: SEGWIT remove w/ DEPRECATED_V3 */}
          {/* <Button
            data-e2e='btcNewWalletButton'
            height='36px'
            nature='primary'
            onClick={onAddNewWallet}
            size='14px'
          >
            <FormattedMessage
              id='scenes.settings.addresses.btc.wallets.newhdaccount'
              defaultMessage='New Wallet'
            />
          </Button> */}
        </ButtonsWrapper>
      </HeaderWrapper>
      <TableStyled>
        <TableHeader>
          <TableCell width='50%'>
            <Text color='grey900' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.walletname'
                defaultMessage='Wallet Name'
              />
            </Text>
          </TableCell>
          <TableCell width='30%'>
            <Text color='grey900' size='14px' weight={500}>
              <FormattedMessage id='copy.balance' defaultMessage='Balance' />
            </Text>
          </TableCell>
          <TableCell
            width='20%'
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Text color='grey900' size='14px' weight={500}>
              <FormattedMessage
                id='scenes.settings.addresses.btc.wallets.manage'
                defaultMessage='Manage'
              />
            </Text>
          </TableCell>
        </TableHeader>
        {search && !matchedWallets.length ? (
          <TableRow data-e2e='btcNoWalletResults'>
            <NoSearchMatchCell>
              <LabelCell size='13px'>
                <Text size='13px' weight={500}>
                  <FormattedMessage
                    id='scenes.settings.addresses.btc.wallets.nomatch'
                    defaultMessage='No wallets matched your search'
                  />
                </Text>
              </LabelCell>
            </NoSearchMatchCell>
          </TableRow>
        ) : (
          walletTableRows
        )}
      </TableStyled>
    </Wrapper>
  )
}

export default Success
