import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { length } from 'ramda'
import PropTypes from 'prop-types'
import { formValueSelector } from 'redux-form'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import * as C from 'services/AlertService'
import { actions, selectors } from 'data'
import { Types } from 'blockchain-wallet-v4'
import UnusedAddressesTemplate from './template.success'

import { Banner, ComponentDropdown, FlatLoader, Link, IconButton, Text } from 'blockchain-info-components'

const WalletLabelCell = styled.div`
  display: flex;
  align-items: center;
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

const MoreOptions = () => (
  <Link weight={200} size='small'>
    <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.moreoptions' defaultMessage='More Options' />
  </Link>
)

class UnusedAddressesContainer extends React.PureComponent {
  componentWillMount () {
    this.props.componentActions.fetchUnusedAddresses(this.props.walletIndex)
  }

  render () {
    const { account, unusedAddresses, currentReceiveIndex, isDefault, coreActions, walletActions, modalsActions, routerActions, search } = this.props
    const onEditLabel = (i) => this.props.componentActions.editAddressLabel(account.index, this.props.walletIndex, i)
    const onDeleteLabel = (i) => modalsActions.showModal('DeleteAddressLabel', {
      accountIdx: account.index,
      walletIdx: this.props.walletIndex,
      addressIdx: i
    })
    const onEditBtcAccountLabel = () => walletActions.editBtcAccountLabel(account.index, account.label)
    const onShowXPub = () => modalsActions.showModal('ShowXPub', { xpub: account.xpub })
    const onMakeDefault = () => coreActions.setDefaultAccountIdx(account.index)
    const onGenerateNextAddress = () => {
      if (length(this.props.unusedAddresses.getOrElse([])) >= 15) {
        this.props.alertActions.displayError(C.ADDRESS_LABEL_MAXIMUM_ERROR)
      } else {
        this.props.componentActions.generateNextReceiveAddress(this.props.walletIndex)
      }
    }
    const onSetArchived = () => {
      coreActions.setAccountArchived(account.index, true)
      routerActions.push('/settings/addresses')
    }
    const props = { account, unusedAddresses, currentReceiveIndex, isDefault, onGenerateNextAddress, onEditLabel, search, onDeleteLabel, onEditBtcAccountLabel, onShowXPub, onMakeDefault, onSetArchived }

    return (
      <React.Fragment>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <WalletLabelCell>
            <Text weight={400} style={{ marginRight: 10 }}>
              {account.label}
            </Text>
            {isDefault && (
              <Banner label>
                <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.isdefault' defaultMessage='Default' />
              </Banner>
            )}
          </WalletLabelCell>
          <ComponentDropdown down forceSelected color={'gray-5'} selectedComponent={<MoreOptions />} components={[
            <ClickableText size='small' onClick={onEditBtcAccountLabel}>
              <FormattedMessage id='scenes.settings.manage_addresses.edit_name' defaultMessage='Edit Name' />
            </ClickableText>,
            (!isDefault && <ClickableText size='small' onClick={onMakeDefault}>
              <FormattedMessage id='scenes.settings.manage_addresses.make_default' defaultMessage='Make Default' />
            </ClickableText>),
            (!isDefault && <ClickableText size='small' onClick={onSetArchived}>
              <FormattedMessage id='scenes.settings.manage_addresses.archive' defaultMessage='Archive' />
            </ClickableText>),
            <ClickableText size='small' onClick={onShowXPub}>
              <FormattedMessage id='scenes.settings.manage_addresses.show_xpub' defaultMessage='Show xPub' />
            </ClickableText>
          ].filter(x => x)} />
        </div>
        <Text weight={400} size='14px' style={{ marginTop: 25 }}>
          <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.title' defaultMessage='Unused Addresses' />
        </Text>
        <Text weight={200} size='small' style={{ marginTop: 10, marginBottom: 15 }}>
          <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.message' defaultMessage='Your Blockchain Wallet contains an unlimited collection of bitcoin addresses that you can use to receive funds from anybody, globally. Your wallet will automatically manage your bitcoin addresses for you. The addresses below are the subset of addresses that are labeled.' />
        </Text>
        {
          !unusedAddresses ? null : unusedAddresses.cata({
            Success: (value) => <UnusedAddressesTemplate {...props} unusedAddresses={value} />,
            Failure: () => <div/>,
            Loading: () => <FlatLoader style={{ margin: '25px auto' }} width='100px' height='12px' />,
            NotAsked: () => <div/>
          })
        }
        <IconButton style={{ marginTop: 15 }} name='plus' onClick={() => onGenerateNextAddress()}>
          <FormattedMessage id='scenes.settings.addresses.btc.manageaddresses.unusedaddresses.addnext' defaultMessage='Add Next Address' />
        </IconButton>
      </React.Fragment>
    )
  }
}

UnusedAddressesContainer.propTypes = {
  index: PropTypes.number.required
}

const mapStateToProps = (state, ownProps) => {
  const account = Types.Wallet.selectHDAccounts(state.walletPath.wallet).get(ownProps.walletIndex)
  const isDefault = parseInt(ownProps.walletIndex) === Types.HDWallet.selectDefaultAccountIdx(Types.Wallet.selectHdWallets(state.walletPath.wallet).get(0))
  const unusedAddresses = selectors.components.manageAddresses.getWalletUnusedAddresses(state, ownProps.walletIndex)
  const currentReceiveIndex = selectors.core.data.bitcoin.getReceiveIndex(account.xpub, state)
  const search = formValueSelector('manageAddresses')(state, 'search')

  return { account, isDefault, currentReceiveIndex, unusedAddresses, search }
}

const mapDispatchToProps = (dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  componentActions: bindActionCreators(actions.components.manageAddresses, dispatch),
  coreActions: bindActionCreators(actions.core.wallet, dispatch),
  modalsActions: bindActionCreators(actions.modals, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  walletActions: bindActionCreators(actions.wallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(UnusedAddressesContainer)
