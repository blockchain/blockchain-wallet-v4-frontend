import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { map } from 'ramda'
import { compose } from 'redux'
import { Field, reduxForm } from 'redux-form'

import { convertCoinToCoin, convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import { GasDataI } from '@core/network/api/nfts/types'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { RatesType } from '@core/types'
import { Text } from 'blockchain-info-components'
import { Title, Value } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import SelectBox from 'components/Form/SelectBox'
import { actions, selectors } from 'data'
import { NftOrderStepEnum } from 'data/components/nfts/types'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'

import { NftFlyoutRow, StickyCTA } from '../../components'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import MakeOfferCTA from './cta'
import MakeOfferFees from './fees'
import { validate } from './validation'

const MakeOffer: React.FC<Props> = (props) => {
  const {
    analyticsActions,
    close,
    erc20BalanceR,
    ethBalancesR,
    formActions,
    formValues,
    nftActions,
    openSeaAssetR,
    orderFlow,
    rates,
    walletCurrency
  } = props
  useEffect(() => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_MAKE_AN_OFFER_VIEWED,
      properties: {}
    })
  }, [])

  const openSeaAsset = useRemote(() => openSeaAssetR)

  const { fees, wrapEthFees } = orderFlow

  if (!formValues) return null

  const { amount, coin, fix } = formValues
  const { coinfig } = window.coins[coin]
  const [selfCustodyBalance, custodialBalance] = ethBalancesR.getOrElse([
    new BigNumber(0),
    new BigNumber(0)
  ])
  const cryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency: walletCurrency,
          rates,
          value: amount
        })
      : amount
  const fiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency: walletCurrency,
          isStandard: true,
          rates,
          value: amount || 0
        })
      : amount
  const wrapFees = wrapEthFees.getOrElse({ gasPrice: 0, totalFees: 0 } as GasDataI)
  const offerFees = fees.getOrElse({ gasPrice: 0, totalFees: 0 } as GasDataI)
  const ethBalance = new BigNumber(selfCustodyBalance)
  const erc20Balance = erc20BalanceR.getOrElse(0)
  const maxWrapPossible = ethBalance
    .minus(wrapFees.totalFees * wrapFees.gasPrice)
    .minus(offerFees.totalFees * offerFees.gasPrice)
  const maxOfferPossible =
    coin === 'WETH' ? maxWrapPossible.plus(erc20Balance) : new BigNumber(erc20Balance)
  const amtToBuy = maxOfferPossible
    .times(-1)
    .plus(convertCoinToCoin({ baseToStandard: false, coin, value: cryptoAmt }))
  // Standard Values
  const standardErc20Balance = convertCoinToCoin({
    coin: formValues.coin || 'WETH',
    value: erc20Balance
  })
  const standardMaxWrapPossible = convertCoinToCoin({
    coin: 'ETH',
    value: maxWrapPossible.toString()
  })
  // used to avoid precision error caused by AmountFieldInput component, which
  // uses max 8 decimal precision
  const standardMaxOfferPossible =
    (Math.floor(maxOfferPossible.dividedBy(1e8).toNumber()) * 1e8) / 10 ** coinfig.precision

  const amtToWrap = new BigNumber(cryptoAmt || 0).minus(standardErc20Balance)
  const canWrap =
    amtToWrap.isLessThanOrEqualTo(standardMaxWrapPossible) && formValues.coin === 'WETH'
  const needsWrap = amtToWrap.isGreaterThan(0) && formValues.coin === 'WETH'

  if (openSeaAsset.isLoading) return <NftFlyoutLoader close={props.close} />
  if (openSeaAsset.error)
    return <NftFlyoutFailure error={openSeaAsset.error || ''} close={props.close} />

  const asset = openSeaAsset.data

  if (!asset) return <NftFlyoutFailure error='Error fetching asset data.' close={props.close} />

  const enteredAmountAnalytics = () => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_ENTERED_AMOUNT,
      properties: {
        currency: coin,
        input_amount: Number(amount)
      }
    })
  }

  const offerWithChangedAnalytics = (coin) => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_MAKE_OFFER_WITH_CLICKED,
      properties: {
        currency: coin
      }
    })
  }

  if (
    asset.collection.safelist_request_status !== 'verified' &&
    orderFlow.prevStep !== NftOrderStepEnum.MAKE_OFFER
  ) {
    nftActions.setOrderFlowPrevStep({ prevStep: NftOrderStepEnum.MAKE_OFFER })
    nftActions.setOrderFlowStep({ step: NftOrderStepEnum.NOT_VERIFIED })
  }

  return (
    <>
      <FlyoutHeader sticky data-e2e='wrapEthHeader' mode='back' onClick={() => close()}>
        Make Offer
      </FlyoutHeader>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <NftAssetHeaderRow asset={asset} />
        <NftFlyoutRow>
          <Value>
            <AmountFieldInput
              coin={coin}
              fiatCurrency={walletCurrency}
              amountError={false}
              quote={fix === 'CRYPTO' ? fiatAmt : cryptoAmt}
              fix={fix as 'CRYPTO' | 'FIAT'}
              name='amount'
              onChange={enteredAmountAnalytics}
              showCounter
              showToggle
              data-e2e='amountField'
              onToggleFix={() => {
                formActions.change('nftMakeOffer', 'fix', fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO')
                formActions.change('nftMakeOffer', 'amount', fix === 'CRYPTO' ? fiatAmt : cryptoAmt)
              }}
            />
          </Value>
        </NftFlyoutRow>
        <NftFlyoutRow>
          <Title>
            <b>
              <FormattedMessage id='copy.offer_with' defaultMessage='Offer With' />
            </b>
          </Title>
          <Value>
            <Field
              name='coin'
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(coin: any) => {
                offerWithChangedAnalytics(coin)
              }}
              component={SelectBox}
              elements={[
                {
                  group: '',
                  items: asset.collection.payment_tokens
                    .map((token) => token.symbol)
                    .filter((symbol) => !!window.coins[symbol])
                    .filter((symbol) => !!window.coins[symbol].coinfig.type.erc20Address)
                    .map((coin) => ({
                      text: window.coins[coin].coinfig.symbol,
                      value: window.coins[coin].coinfig.symbol
                    }))
                }
              ]}
            />
          </Value>
          {canWrap && needsWrap ? (
            <Value>
              <Text size='12px'>ETH will automatically be wrapped to WETH during transaction </Text>
            </Value>
          ) : null}
        </NftFlyoutRow>
        <NftFlyoutRow>
          <Title>
            <b>
              <FormattedMessage id='copy.select_coin' defaultMessage='Expires After' />
            </b>
          </Title>
          <Value>
            <Field
              name='expirationMinutes'
              onChange={(days: any) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              }}
              component={SelectBox}
              elements={[
                {
                  group: '',
                  items: map(
                    (item) => ({
                      text: item.text,
                      value: item.value
                    }),
                    [
                      { text: '30 Mins', value: 30 },
                      { text: '1 Hour', value: 60 },
                      { text: '1 Day', value: 1440 },
                      { text: '3 Days', value: 4320 },
                      { text: '7 Days', value: 10080 },
                      { text: '1 Month', value: 43200 },
                      { text: '3 Months', value: 129600 },
                      { text: '6 Months', value: 259200 }
                    ]
                  )
                }
              ]}
            />
          </Value>
        </NftFlyoutRow>
      </div>

      <StickyCTA>
        <MakeOfferFees {...props} asset={asset} needsWrap={needsWrap} />
        <br />
        <MakeOfferCTA
          {...props}
          amtToBuy={amtToBuy}
          asset={asset}
          canWrap={canWrap}
          needsWrap={needsWrap}
          wrapFees={wrapFees}
          offerFees={offerFees}
          selfCustodyBalance={selfCustodyBalance}
          custodialBalance={custodialBalance}
          cryptoAmt={cryptoAmt}
          amtToWrap={amtToWrap}
          standardMaxOfferPossible={standardMaxOfferPossible}
        />
      </StickyCTA>
    </>
  )
}

export type NftMakeOfferFormValues = {
  amount: string
  coin: string
  expirationMinutes: string
  fix: string
}

const mapStateToProps = (state) => {
  const formValues = selectors.form.getFormValues('nftMakeOffer')(state) as NftMakeOfferFormValues

  return {
    erc20BalanceR: selectors.core.data.eth.getErc20Balance(state, formValues?.coin || 'WETH'),
    ethBalancesR: selectors.balances.getCoinBalancesTypeSeparated('ETH')(state),
    formErrors: selectors.form.getFormSyncErrors('nftMakeOffer')(state) as { amount: boolean },
    formValues,
    rates: getRatesSelector(formValues?.coin || 'WETH', state).getOrElse({} as RatesType),
    walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
  }
}

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  connector,
  reduxForm<{}, Props>({
    destroyOnUnmount: false,
    form: 'nftMakeOffer',
    initialValues: {
      coin: 'WETH',
      expirationMinutes: 1440,
      fix: 'CRYPTO',
      networkFees: 'network'
    },
    validate
  })
)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MakeOffer) as React.FC<OwnProps>
