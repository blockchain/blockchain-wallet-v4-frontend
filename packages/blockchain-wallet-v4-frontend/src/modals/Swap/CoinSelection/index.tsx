import {
  BalanceRow,
  CircleBorder,
  CircleSelected,
  CoinOption,
  TopText
} from '../components'
import { Props as BaseProps, SuccessStateType } from '..'
import { coinOrder, getData } from './selectors'
import { connect, ConnectedProps } from 'react-redux'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import { InitSwapFormValuesType } from 'data/components/swap/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { SuccessCartridge } from 'components/Cartridge'
import { SwapAccountType } from 'data/types'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { PureComponent } from 'react'
class CoinSelection extends PureComponent<Props> {
  state = {}

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
        </FlyoutWrapper>
        {coinOrder.map(coin => {
          const accounts = this.props.accounts[coin] as Array<SwapAccountType>
          return accounts.map(account => {
            const isAccountSelected =
              !!((this.props.side === 'BASE' &&
                values?.BASE?.label === account.label) ||
              (this.props.side === 'COUNTER' &&
                values?.COUNTER?.label === account.label))
            const isCoinSelected =
              !!((this.props.side === 'BASE' &&
                values?.COUNTER?.coin === account.coin) ||
              (this.props.side === 'COUNTER' &&
                values?.BASE?.coin === account.coin))
            return (
              !isCoinSelected && (
                <CoinOption
                  role='button'
                  onClick={() =>
                    this.props.swapActions.changePair(this.props.side, account)
                  }
                >
                  <Icon
                    name={coins[account.coin].icons.circleFilled}
                    color={coins[account.coin].colorCode}
                    size='32px'
                    style={{ marginRight: '16px' }}
                  />
                  <div>
                    <Text
                      color='grey900'
                      weight={600}
                      style={{ marginTop: '4px' }}
                    >
                      {account.label}
                    </Text>
                    <BalanceRow>
                      <FiatDisplay
                        color='grey800'
                        coin={account.coin}
                        currency={walletCurrency}
                        loadingHeight='24px'
                        style={{ lineHeight: '1.5' }}
                        weight={600}
                      >
                        {account.balance}
                      </FiatDisplay>
                      <Text>
                        ({convertBaseToStandard(account.coin, account.balance)})
                      </Text>
                    </BalanceRow>
                  </div>
                  {account.type === 'CUSTODIAL' && (
                    <SuccessCartridge>Low Fees</SuccessCartridge>
                  )}
                  <CircleBorder>
                    {isAccountSelected && <CircleSelected />}
                  </CircleBorder>
                </CoinOption>
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
