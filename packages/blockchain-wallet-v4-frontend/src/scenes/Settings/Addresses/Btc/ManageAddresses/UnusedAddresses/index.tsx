import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Toggler, TogglerItem } from '@blockchain-com/components'
import { any, equals, length, prop, propEq } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'

import {
  Banner,
  Button,
  ComponentDropdown,
  FlatLoader,
  Link,
  Text
} from 'blockchain-info-components'
import { Types } from 'blockchain-wallet-v4/src'
import { SettingDescription, SettingHeader } from 'components/Setting'
import { HDDerivationType } from 'core/types'
import { actions, selectors } from 'data'
import * as C from 'services/alerts'

import UnusedAddresses from './template'

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  > :nth-child(2) {
    margin: 0 16px;
  }
`
const UnusedAddressesHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-content: space-between;
  align-items: center;
  margin-top: 24px;
  > :first-child {
    padding-right: 100px;
  }
`
const ClickableText = styled(Text)`
  cursor: pointer;
`
const ToggledLink = styled(Link)`
  &.active {
    color: ${({ theme }) => theme.grey000};
  }
`
const UnusedTitle = styled(SettingHeader)`
  justify-content: flex-start;
  font-weight: 500;
  font-size: 16px;
`

class UnusedAddressesContainer extends React.PureComponent<Props> {
  componentDidMount() {
    const { componentActions, derivation, walletIndex } = this.props
    componentActions.fetchUnusedAddresses(walletIndex, derivation)
  }

  componentDidUpdate(prevProps) {
    if (this.props.derivation !== prevProps.derivation) {
      this.props.componentActions.fetchUnusedAddresses(
        this.props.walletIndex,
        this.props.derivation
      )
    }
  }

  onEditLabel = (i) => {
    const { accountIndex, componentActions, derivation, walletIndex } = this.props
    componentActions.editAddressLabel(accountIndex, walletIndex, derivation, i)
  }

  onDeleteLabel = (i) => {
    const { accountIndex, derivation, modalsActions, walletIndex } = this.props
    modalsActions.showModal('DELETE_ADDRESS_LABEL_MODAL', {
      accountIdx: accountIndex,
      addressIdx: i,
      derivation,
      origin: 'SettingsPage',
      walletIdx: walletIndex
    })
  }

  onEditBtcAccountLabel = () => {
    const {
      accountIndex,
      accountLabel,

      walletActions
    } = this.props
    walletActions.editBtcAccountLabel(accountIndex, accountLabel)
  }

  onShowXPub = () => {
    const { modalsActions, xpub } = this.props
    modalsActions.showModal('SHOW_XPUB_MODAL', { origin: 'SettingsPage', xpub })
  }

  onShowFundRecovery = (accountIndex) => {
    const { modalsActions } = this.props
    modalsActions.showModal('FUND_RECOVERY_MODAL', {
      accountIndex,
      coin: 'BTC',
      origin: 'SettingsPage'
    })
  }

  onMakeDefault = () => {
    const { accountIndex, coreActions } = this.props
    coreActions.setDefaultAccountIdx(accountIndex)
  }

  onGenerateNextAddress = () => {
    const { alertActions, componentActions, derivation, unusedAddresses, walletIndex } = this.props
    if (length(unusedAddresses.getOrElse([])) >= 15) {
      alertActions.displayError(C.ADDRESS_LABEL_MAXIMUM_ERROR)
    } else {
      componentActions.generateNextReceiveAddress(walletIndex, derivation)
    }
  }

  onSetArchived = () => {
    const { accountIndex, coreActions, routerActions } = this.props
    coreActions.setAccountArchived(accountIndex, true)
    routerActions.push('/settings/addresses/btc')
  }

  render() {
    const {
      accountLabel,
      derivation,
      hasLegacyDerivation,
      isDefault,
      search,
      unusedAddresses,
      walletIndex
    } = this.props
    return (
      <>
        <HeaderWrapper>
          <WalletHeader>
            <Text color='grey900' data-e2e='btcWalletName' size='20px' weight={500}>
              {accountLabel}
            </Text>
            {hasLegacyDerivation && (
              <Toggler>
                <TogglerItem selected={equals('bech32', derivation)}>
                  <LinkContainer to={`/settings/addresses/btc/${walletIndex}/bech32`}>
                    <ToggledLink weight={500} size='13px' data-e2e='btcManageSegwitWalletLink'>
                      Segwit
                    </ToggledLink>
                  </LinkContainer>
                </TogglerItem>
                <TogglerItem selected={equals('legacy', derivation)}>
                  <LinkContainer to={`/settings/addresses/btc/${walletIndex}/legacy`}>
                    <ToggledLink weight={500} size='13px' data-e2e='btcManageLegacyWalletLink'>
                      Legacy
                    </ToggledLink>
                  </LinkContainer>
                </TogglerItem>
              </Toggler>
            )}
            {isDefault && (
              <Banner label data-e2e='btcDefaultWallet'>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.isdefault'
                  defaultMessage='Default'
                />
              </Banner>
            )}
          </WalletHeader>
          <div>
            <ComponentDropdown
              color='grey900'
              down
              forceSelected
              margin='0 3px 0 0'
              width='100px'
              textAlign='end'
              selectedComponent={
                <Link weight={500} size='13px' data-e2e='btcWalletMoreOptionsDropdown'>
                  <FormattedMessage id='buttons.manage' defaultMessage='Manage' />
                </Link>
              }
              components={[
                <ClickableText
                  key='editName'
                  size='small'
                  onClick={this.onEditBtcAccountLabel}
                  data-e2e='btcEditWalletNameLink'
                >
                  <FormattedMessage
                    id='scenes.settings.manage_addresses.edit_name'
                    defaultMessage='Edit Name'
                  />
                </ClickableText>,
                !isDefault && (
                  <>
                    <ClickableText
                      size='small'
                      onClick={this.onMakeDefault}
                      data-e2e='btcMakeWalletDefaultLink'
                    >
                      <FormattedMessage
                        id='scenes.settings.manage_addresses.make_default'
                        defaultMessage='Make Default'
                      />
                    </ClickableText>
                    <ClickableText
                      size='small'
                      onClick={this.onSetArchived}
                      data-e2e='btcArchiveWalletLink'
                    >
                      <FormattedMessage
                        id='scenes.settings.manage_addresses.archive'
                        defaultMessage='Archive'
                      />
                    </ClickableText>
                  </>
                ),
                <ClickableText
                  key='showXpub'
                  size='small'
                  onClick={this.onShowXPub}
                  data-e2e='btcShowWalletXpubLink'
                >
                  <FormattedMessage
                    id='scenes.settings.manage_addresses.show_xpub'
                    defaultMessage='Show xPub'
                  />
                </ClickableText>,
                <ClickableText
                  key='recoverFunds'
                  size='small'
                  onClick={() => this.onShowFundRecovery(walletIndex)}
                  data-e2e='btcShowWalletXpubLink'
                >
                  <FormattedMessage
                    id='scenes.settings.addresses.show_fund_recovery'
                    defaultMessage='Recover Funds'
                  />
                </ClickableText>
              ].filter((x) => x)}
            />
          </div>
        </HeaderWrapper>
        <UnusedAddressesHeader>
          <div>
            <UnusedTitle>
              <FormattedMessage
                id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.title'
                defaultMessage='Unused Addresses'
              />
            </UnusedTitle>
            <SettingDescription>
              <FormattedMessage
                id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.desc'
                defaultMessage='Wallets contain an unlimited number of addresses that you can use to receive funds. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are only a subset that you have manually created and labeled.'
              />
            </SettingDescription>
          </div>
          <div>
            <Button
              data-e2e='btcAddNextAddressButton'
              height='36px'
              nature='primary'
              onClick={this.onGenerateNextAddress}
              size='14px'
            >
              <FormattedMessage
                id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.addnext'
                defaultMessage='Add Next Address'
              />
            </Button>
          </div>
        </UnusedAddressesHeader>
        {!unusedAddresses
          ? null
          : unusedAddresses.cata({
              Failure: () => <div />,
              Loading: () => (
                <FlatLoader style={{ margin: '25px auto' }} width='100px' height='12px' />
              ),
              NotAsked: () => <div />,
              Success: (unusedAddresses) => (
                <UnusedAddresses
                  search={search}
                  onDeleteLabel={this.onDeleteLabel}
                  onEditLabel={this.onEditLabel}
                  unusedAddresses={unusedAddresses}
                />
              )
            })}
      </>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { derivation, walletIndex } = ownProps
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(walletIndex)
  const isDefault =
    parseInt(walletIndex, 10) ===
    Types.HDWallet.selectDefaultAccountIdx(
      Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0)
    )
  const unusedAddresses = selectors.components.manageAddresses.getWalletUnusedAddresses(
    state,
    walletIndex,
    derivation
  )

  return {
    accountIndex: prop('index', account),
    accountLabel: prop('label', account),
    // TODO: SEGWIT remove w/ DEPRECATED_V3
    hasLegacyDerivation:
      account.derivations && any(propEq('type', 'legacy'), prop('derivations', account.toJS())),
    isDefault,
    search: formValueSelector('manageAddresses')(state, 'search'),
    unusedAddresses,
    xpub: Types.HDAccount.selectXpub(account, derivation)
  }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  componentActions: bindActionCreators(actions.components.manageAddresses, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = {
  derivation: HDDerivationType
  walletIndex: number
} & ConnectedProps<typeof connector>

export default connector(UnusedAddressesContainer)
