import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { any, equals, length, prop, propEq } from 'ramda'
import PropTypes from 'prop-types'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Toggler, TogglerItem } from '@blockchain-com/components'

import * as C from 'services/AlertService'
import { actions, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import UnusedAddresses from './template'
import {
  Banner,
  ComponentDropdown,
  FlatLoader,
  Link,
  IconButton,
  Text
} from 'blockchain-info-components'

const WalletLabelCell = styled.div`
  display: flex;
  align-items: center;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`
const DerivationSwitchContainer = styled.div`
  margin-left: 12px;
`
const LegacyToggledLink = styled(Link)`
  color: ${({ derivation, theme }) =>
    derivation === 'legacy' ? theme.grey000 : theme['brand-secondary']};
`
const SegWitToggledLink = styled(Link)`
  color: ${({ derivation, theme }) =>
    derivation === 'segwitP2SH' ? theme.grey000 : theme['brand-secondary']};
`
class UnusedAddressesContainer extends React.PureComponent {
  componentDidMount () {
    const { componentActions, derivation, walletIndex } = this.props
    componentActions.fetchUnusedAddresses(walletIndex, derivation)
  }

  componentDidUpdate (prevProps) {
    if (this.props.derivation !== prevProps.derivation) {
      this.props.componentActions.fetchUnusedAddresses(
        this.props.walletIndex,
        this.props.derivation
      )
    }
  }

  onEditLabel = i => {
    const {
      accountIndex,
      componentActions,
      derivation,
      walletIndex
    } = this.props
    componentActions.editAddressLabel(accountIndex, walletIndex, derivation, i)
  }

  onDeleteLabel = i => {
    const { accountIndex, derivation, modalsActions, walletIndex } = this.props
    modalsActions.showModal('DeleteAddressLabel', {
      accountIdx: accountIndex,
      addressIdx: i,
      derivation,
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
    modalsActions.showModal('ShowXPub', { xpub: xpub })
  }

  onMakeDefault = () => {
    const { accountIndex, coreActions } = this.props
    coreActions.setDefaultAccountIdx(accountIndex)
  }

  onGenerateNextAddress = () => {
    const {
      alertActions,
      componentActions,
      derivation,
      unusedAddresses,
      walletIndex
    } = this.props
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

  render () {
    const {
      accountLabel,
      derivation,
      hasLegacyDerivation,
      isDefault,
      search,
      walletIndex,
      unusedAddresses
    } = this.props

    return (
      <React.Fragment>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <WalletLabelCell>
            <Text
              weight={500}
              style={{ marginRight: 10 }}
              data-e2e='btcWalletName'
            >
              {accountLabel}
            </Text>
            {isDefault && (
              <Banner label data-e2e='btcDefaultWallet'>
                <FormattedMessage
                  id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.isdefault'
                  defaultMessage='Default'
                />
              </Banner>
            )}
            {hasLegacyDerivation && (
              <DerivationSwitchContainer>
                <Toggler>
                  <TogglerItem selected={equals('legacy', derivation)}>
                    <LinkContainer
                      to={`/settings/addresses/btc/${walletIndex}/legacy`}
                    >
                      <LegacyToggledLink
                        weight={500}
                        size='13px'
                        derivation={derivation}
                        data-e2e='btcManageLegacyWalletLink'
                      >
                        <FormattedMessage
                          id='scenes.settings.addresses.btc.wallets.managelegacy'
                          defaultMessage='Legacy'
                        />
                      </LegacyToggledLink>
                    </LinkContainer>
                  </TogglerItem>
                  <TogglerItem selected={equals('segwitP2SH', derivation)}>
                    <LinkContainer
                      to={`/settings/addresses/btc/${walletIndex}/segwitP2SH`}
                    >
                      <SegWitToggledLink
                        weight={500}
                        size='13px'
                        derivation={derivation}
                        data-e2e='btcManageSegwitWalletLink'
                      >
                        <FormattedMessage
                          id='scenes.settings.addresses.btc.wallets.managesegwit'
                          defaultMessage='Segwit P2SH'
                        />
                      </SegWitToggledLink>
                    </LinkContainer>
                  </TogglerItem>
                </Toggler>
              </DerivationSwitchContainer>
            )}
          </WalletLabelCell>
          <ComponentDropdown
            down
            forceSelected
            color={'gray-5'}
            selectedComponent={
              <Link
                weight={500}
                size='13px'
                data-e2e='btcWalletMoreOptionsDropdown'
              >
                <FormattedMessage
                  id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.moreoptions'
                  defaultMessage='More Options'
                />
              </Link>
            }
            components={[
              <ClickableText
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
                <React.Fragment>
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
                </React.Fragment>
              ),
              <ClickableText
                size='small'
                onClick={this.onShowXPub}
                data-e2e='btcShowWalletXpubLink'
              >
                <FormattedMessage
                  id='scenes.settings.manage_addresses.show_xpub'
                  defaultMessage='Show xPub'
                />
              </ClickableText>
            ].filter(x => x)}
          />
        </div>
        <Text weight={500} size='14px' style={{ marginTop: 25 }}>
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.title'
            defaultMessage='Unused Addresses'
          />
        </Text>
        <Text
          weight={400}
          size='small'
          style={{ marginTop: 10, marginBottom: 15 }}
        >
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.message'
            defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are the subset of addresses that are labeled.'
          />
        </Text>
        {!unusedAddresses
          ? null
          : unusedAddresses.cata({
              Success: unusedAddresses => (
                <UnusedAddresses
                  search={search}
                  onDeleteLabel={this.onDeleteLabel}
                  onEditLabel={this.onEditLabel}
                  unusedAddresses={unusedAddresses}
                />
              ),
              Failure: () => <div />,
              Loading: () => (
                <FlatLoader
                  style={{ margin: '25px auto' }}
                  width='100px'
                  height='12px'
                />
              ),
              NotAsked: () => <div />
            })}
        <IconButton
          style={{ marginTop: 15 }}
          name='plus'
          onClick={this.onGenerateNextAddress}
          data-e2e='btcAddNextAddressButton'
        >
          <FormattedMessage
            id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.addnext'
            defaultMessage='Add Next Address'
          />
        </IconButton>
      </React.Fragment>
    )
  }
}

UnusedAddressesContainer.propTypes = {
  derivation: PropTypes.string.isRequired,
  walletIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { derivation, walletIndex } = ownProps
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(
    walletIndex
  )
  const isDefault =
    parseInt(walletIndex) ===
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
    hasLegacyDerivation: any(
      propEq('type', 'legacy'),
      prop('derivations', account.toJS())
    ),
    isDefault,
    unusedAddresses,
    search: formValueSelector('manageAddresses')(state, 'search'),
    xpub: Types.HDAccount.selectXpub(account, derivation)
  }
}

const mapDispatchToProps = dispatch => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  componentActions: bindActionCreators(
    actions.components.manageAddresses,
    dispatch
  ),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnusedAddressesContainer)
