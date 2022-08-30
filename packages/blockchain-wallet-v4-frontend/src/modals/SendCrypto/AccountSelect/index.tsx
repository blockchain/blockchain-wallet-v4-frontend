import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { Icon, Padding } from '@blockchain-com/constellation'
import { IconCloseCircleV2 } from '@blockchain-com/icons'
import { bindActionCreators, compose } from 'redux'
import reduxForm, { InjectedFormProps } from 'redux-form/lib/reduxForm'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent } from 'components/Flyout/Layout'
import CoinAccountOption from 'components/Form/CoinAccountOption'
import { actions } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'

import { Title } from '../../components'
import { Props as OwnProps } from '..'
import { SEND_FORM } from '../model'
import { getData } from './selectors'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 480px;
  background-color: ${(props) => props.theme.white};
`

const HeaderRow = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;
`
const NoAccountsText = styled.div`
  border-top: ${(props) => `1px solid ${props.theme.grey000}`};
  padding: 40px 40px 0;
  text-align: center;
`
const InfoRow = styled.div`
  background: rgba(240, 242, 247, 0.32);
`

const CloseIconContainer = styled.div`
  cursor: pointer;
`

class SendAccountSelect extends React.PureComponent<InjectedFormProps<{}, Props> & Props> {
  render() {
    const { close, data, formActions, sendCryptoActions, showNewSendFlow, walletCurrency } =
      this.props
    return (
      <FlyoutContainer>
        <HeaderWrapper>
          <Padding top={40} left={40} right={40} bottom={16}>
            <HeaderRow>
              <Title color='textBlack'>
                <FormattedMessage id='buttons.send' defaultMessage='Send' />
              </Title>
              <CloseIconContainer onClick={() => close()}>
                <Icon label='close' color='grey600' data-e2e='sendNoFundsCloseModalIcon' size='md'>
                  <IconCloseCircleV2 />
                </Icon>
              </CloseIconContainer>
            </HeaderRow>
            <Text size='16px' color='grey600' weight={500} style={{ marginTop: '10px' }}>
              <FormattedMessage
                id='modals.sendCrypto.accountSelect.subtitle'
                defaultMessage='Select where to send from.'
              />
            </Text>
          </Padding>
        </HeaderWrapper>

        <InfoRow>
          <Padding left={40} top={8} bottom={8}>
            <Text size='12px' color='grey900' weight={500}>
              <FormattedMessage
                id='modals.sendCrypto.accountSelect.availableFunds'
                defaultMessage='Available Funds'
              />
            </Text>
          </Padding>
        </InfoRow>

        <FlyoutContent mode='top'>
          {data.accounts.map((account) => (
            <CoinAccountOption
              key={account.coin + account.address}
              account={account}
              coin={account.coin}
              onClick={() => {
                formActions.reset(SEND_FORM)
                formActions.change(SEND_FORM, 'selectedAccount', account)
                sendCryptoActions.setStep({
                  step: showNewSendFlow
                    ? SendCryptoStepType.ENTER_AMOUNT
                    : SendCryptoStepType.ENTER_TO
                })
                sendCryptoActions.fetchSendLimits({ account })
              }}
              walletCurrency={walletCurrency}
            />
          ))}
          {data.accounts.length === 0 && (
            <NoAccountsText>
              <Text size='16px' color='grey900' weight={500} style={{ marginTop: '10px' }}>
                <FormattedMessage
                  id='modals.sendcrypto.coinselect.noaccounts'
                  defaultMessage='Currently there are no accounts for the selected crypto.'
                />
              </Text>
            </NoAccountsText>
          )}
        </FlyoutContent>
      </FlyoutContainer>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  // coinList: selectors.balances.getTotalWalletBalancesSorted(state),
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
const enhance = compose(
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: SEND_FORM
  }),
  connector
)

type Props = ConnectedProps<typeof connector> & OwnProps

export default enhance(SendAccountSelect) as React.ComponentType<OwnProps>
