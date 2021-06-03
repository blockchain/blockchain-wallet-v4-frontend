import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { StickyHeaderFlyoutWrapper } from 'components/Flyout'
import { CoinAccountListOption, SelectBoxCoin } from 'components/Form'
import { actions } from 'data'
import { SwapAccountType } from 'data/components/swap/types'

import { Props as OwnProps } from '..'
import { REQUEST_FORM, StepHeader } from '../model'
import { RequestSteps } from '../types'
import { getData } from './selectors'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`
const Header = styled(StepHeader)`
  margin-bottom: 40px;
`
const SelectCoinWrapper = styled.div`
  margin-top: 24px;
  width: 40%;
`
const NoAccountsText = styled.div`
  border-top: ${(props) => `1px solid ${props.theme.grey000}`};
  padding: 40px 40px 0;
  text-align: center;
`

class RequestCoinSelect extends React.PureComponent<Props> {
  render() {
    const {
      data,
      formActions,
      handleClose,
      requestableCoins,
      setStep,
      supportedCoins,
      walletCurrency
    } = this.props
    return (
      <Wrapper>
        <StickyHeaderFlyoutWrapper>
          <Header spaceBetween>
            <Icon name='arrow-bottom-right' color='blue600' size='24px' />
            <Icon
              name='close'
              color='grey600'
              role='button'
              data-e2e='close'
              size='24px'
              cursor
              onClick={handleClose}
            />
          </Header>
          <div>
            <Text size='24px' color='grey900' weight={600}>
              <FormattedMessage
                id='modals.requestcrypto.coinselect.title'
                defaultMessage='Receive Crypto'
              />
            </Text>
            <Text size='16px' color='grey600' weight={500} style={{ marginTop: '10px' }}>
              <FormattedMessage
                id='modals.requestcrypto.coinselect.subtitle'
                defaultMessage='Select and share your address or QR code to receive crypto from anyone around the world.'
              />
            </Text>
            <SelectCoinWrapper>
              <Field
                component={SelectBoxCoin}
                height='32px'
                name='selectedCoin'
                props={{
                  additionalOptions: [{ text: 'All Wallets', value: 'ALL' }],
                  limitTo: requestableCoins.map((coin) => ({
                    text: coin,
                    value: coin
                  }))
                }}
                type='request'
              />
            </SelectCoinWrapper>
          </div>
        </StickyHeaderFlyoutWrapper>
        {data.accounts.map((account) => (
          <CoinAccountListOption
            key={account.address}
            account={account}
            coinModel={supportedCoins[account.coin]}
            onClick={() => {
              if (account.type === 'CUSTODIAL' && !data.isAtLeastTier1) {
                setStep(RequestSteps.IDV_INTRO)
              } else {
                formActions.change(REQUEST_FORM, 'selectedAccount', account)
                formActions.change(REQUEST_FORM, 'step', RequestSteps.SHOW_ADDRESS)
              }
            }}
            walletCurrency={walletCurrency}
          />
        ))}
        {data.accounts.length === 0 && (
          <NoAccountsText>
            <Text size='16px' color='grey900' weight={500} style={{ marginTop: '10px' }}>
              <FormattedMessage
                id='modals.requestcrypto.coinselect.noaccounts'
                defaultMessage='Currently there are no receivable accounts for the selected crypto.'
              />
            </Text>
          </NoAccountsText>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type Props = ConnectedProps<typeof connector> &
  OwnProps & {
    handleAccountChange: (account: SwapAccountType) => void
    handleClose: () => void
    setStep: (step: RequestSteps) => void
  }

export default connector(RequestCoinSelect)
