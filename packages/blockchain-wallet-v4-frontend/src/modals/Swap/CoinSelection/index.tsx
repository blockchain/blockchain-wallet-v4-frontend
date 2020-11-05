import {
  BalanceRow,
  CircleBorder,
  FlexStartRow,
  Option,
  OptionTitle,
  OptionValue,
  StickyTopFlyoutWrapper,
  TopText
} from '../components'
import { Props as BaseProps, SuccessStateType } from '..'
import { coinOrder, getData } from './selectors'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import {
  InitSwapFormValuesType,
  SwapSideType
} from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { SuccessCartridge } from 'components/Cartridge'
import { SwapAccountType } from 'data/types'
import CoinBalance from '../components/CoinBalance'
import React, { PureComponent } from 'react'
class CoinSelection extends PureComponent<Props> {
  state = {}
  checkAccountSelected = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'BASE' && values?.BASE?.label === account.label) ||
      (side === 'COUNTER' && values?.COUNTER?.label === account.label)
    ) {
      return true
    } else {
      return false
    }
  }
  checkBaseCustodial = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'COUNTER' &&
        values?.BASE?.type === 'CUSTODIAL' &&
        account.type === 'ACCOUNT') ||
      (side === 'BASE' &&
        values?.COUNTER?.type === 'ACCOUNT' &&
        account.type === 'CUSTODIAL')
    ) {
      return true
    } else {
      return false
    }
  }
  checkCoinSelected = (
    side: SwapSideType,
    values: InitSwapFormValuesType,
    account: SwapAccountType
  ) => {
    if (
      (side === 'COUNTER' && values?.BASE?.coin === account.coin) ||
      (side === 'BASE' && values?.COUNTER?.coin === account.coin)
    ) {
      return true
    } else {
      return false
    }
  }

  checkBaseAccountZero = (side: SwapSideType, account: SwapAccountType) => {
    if ((account.balance === 0 || account.balance === '0') && side === 'BASE') {
      return true
    } else {
      return false
    }
  }

  render () {
    const { coins, values, walletCurrency } = this.props
    return (
      <>
        <StickyTopFlyoutWrapper>
          <TopText spaceBetween={false} marginBottom>
            <Icon
              role='button'
              data-e2e='backToInitSwap'
              name='arrow-back'
              cursor
              size='24px'
              color='grey600'
              onClick={() =>
                this.props.swapActions.setStep({
                  step: 'INIT_SWAP'
                })
              }
            />{' '}
            <Text
              size='20px'
              color='grey900'
              weight={600}
              style={{ marginLeft: '24px' }}
            >
              {this.props.side === 'BASE' ? (
                <FormattedMessage
                  id='copy.swap_from'
                  defaultMessage='Swap from'
                />
              ) : (
                <FormattedMessage
                  id='copy.receive_to'
                  defaultMessage='Receive to'
                />
              )}
            </Text>
          </TopText>
          <Text
            size='16px'
            color='grey600'
            weight={500}
            style={{ margin: '10px 0 0 48px' }}
          >
            {this.props.side === 'BASE' ? (
              <FormattedMessage
                id='copy.swap_from_origin'
                defaultMessage='Which wallet do you want to Swap from?'
              />
            ) : (
              <FormattedMessage
                id='copy.swap_for_destination'
                defaultMessage='Which crypto do you want to Swap for?'
              />
            )}
          </Text>
        </StickyTopFlyoutWrapper>
        {coinOrder.map(coin => {
          const accounts = this.props.accounts[coin] as Array<SwapAccountType>
          return accounts.map(account => {
            const isAccountSelected = this.checkAccountSelected(
              this.props.side,
              values,
              account
            )
            const isCoinSelected = this.checkCoinSelected(
              this.props.side,
              values,
              account
            )
            const hideCustodialToAccount = this.checkBaseCustodial(
              this.props.side,
              values,
              account
            )

            const isBaseAccountZero = this.checkBaseAccountZero(
              this.props.side,
              account
            )
            return (
              !isBaseAccountZero &&
              !isCoinSelected &&
              !hideCustodialToAccount && (
                <Option
                  role='button'
                  data-e2e='changeAcct'
                  onClick={() =>
                    this.props.swapActions.changePair(this.props.side, account)
                  }
                >
                  <FlexStartRow>
                    <Icon
                      name={coins[account.coin].icons.circleFilled}
                      color={coins[account.coin].colorCode}
                      size='32px'
                      style={{ marginRight: '16px' }}
                    />
                    <div>
                      <OptionTitle>{account.label}</OptionTitle>
                      <OptionValue>
                        <BalanceRow>
                          <CoinBalance
                            account={account}
                            walletCurrency={walletCurrency}
                          />
                        </BalanceRow>
                      </OptionValue>
                    </div>
                  </FlexStartRow>
                  <FlexStartRow>
                    {account.type === 'CUSTODIAL' && (
                      <SuccessCartridge>Low Fees</SuccessCartridge>
                    )}
                    {isAccountSelected ? (
                      <Icon
                        name='checkmark-circle-filled'
                        color='green600'
                        size='24px'
                        style={{ padding: '0 2px', marginLeft: '24px' }}
                      />
                    ) : (
                      <CircleBorder />
                    )}
                  </FlexStartRow>
                </Option>
              )
            )
          })
        })}
      </>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  values: selectors.form.getFormValues('initSwap')(
    state
  ) as InitSwapFormValuesType,
  ...getData(state)
})

const connector = connect(mapStateToProps)

type OwnProps = BaseProps & {
  handleClose: () => void
  side: 'BASE' | 'COUNTER'
}
export type Props = OwnProps &
  SuccessStateType &
  ConnectedProps<typeof connector>

export default connector(CoinSelection)
