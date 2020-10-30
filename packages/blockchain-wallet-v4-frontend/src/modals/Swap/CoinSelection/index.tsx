import {
  BalanceRow,
  CircleBorder,
  CircleSelected,
  FlexStartRow,
  Option,
  OptionTitle,
  OptionValue,
  TopText
} from '../components'
import { Props as BaseProps, SuccessStateType } from '..'
import { coinOrder, getData } from './selectors'
import { connect, ConnectedProps } from 'react-redux'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { InitSwapFormValuesType } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { SuccessCartridge } from 'components/Cartridge'
import { SwapAccountType } from 'data/types'
import CoinBalance from '../components/CoinBalance'
import React, { PureComponent } from 'react'
class CoinSelection extends PureComponent<Props> {
  state = {}
  checkAccountSelected = (side, values, account) => {
    if (
      (side === 'BASE' && values?.BASE?.label === account.label) ||
      (side === 'COUNTER' && values?.COUNTER?.label === account.label)
    ) {
      return true
    } else {
      return false
    }
  }

  checkBaseCustodial = (side, values, account) => {
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
  render () {
    const { coins, values, walletCurrency } = this.props
    return (
      <>
        <FlyoutWrapper>
          <TopText spaceBetween={false} marginBottom>
            <Icon
              role='button'
              name='arrow-left'
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
              <FormattedMessage id='copy.swap' defaultMessage='Swap' />{' '}
              {this.props.side === 'BASE' ? 'from' : 'to'}
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
        </FlyoutWrapper>
        {coinOrder.map(coin => {
          const accounts = this.props.accounts[coin] as Array<SwapAccountType>
          return accounts.map(account => {
            const isAccountSelected = this.checkAccountSelected(
              this.props.side,
              values,
              account
            )
            const hideCustodialToAccount = this.checkBaseCustodial(
              this.props.side,
              values,
              account
            )
            return (
              !isAccountSelected &&
              !hideCustodialToAccount && (
                <Option
                  role='button'
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
                    <CircleBorder>
                      {isAccountSelected && <CircleSelected />}
                    </CircleBorder>
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
