import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import { IconPending, IconTag } from '@blockchain-com/icons'
import { format } from 'date-fns'
import { map } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import { GasCalculationOperations } from '@core/network/api/nfts/types'
import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { RatesType } from '@core/types'
import {
  Button,
  HeartbeatLoader,
  Icon,
  Link,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import { StickyHeaderWrapper, Title } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import { Row, Value } from 'components/Flyout/model'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import SelectBox from 'components/Form/SelectBox'
import { actions, selectors } from 'data'
import { Analytics } from 'data/types'
import { media } from 'services/styles'

import { AssetDesc, StickyCTA } from '../../components'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import SellFees from '../ShowAsset/Sell/fees'
import MarkForSaleFees from './fees'

const FormWrapper = styled.div`
  gap: 8px;
  max-height: 500px;
  ${media.tabletL`
    max-height: 170px;
  `}
`
const SaleType = styled.div`
  justify-content: center;
  margin-top: 1.5em;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`
const SaleSelection = styled.div`
  display: flex;
  cursor: pointer;
  padding: 0.5em 1em;
  flex-direction: column;
  width: 10em;
  height: 5em;
  gap: 10px;
  border-radius: 8px;
`

const MarkForSale: React.FC<Props> = (props) => {
  const { analyticsActions, close, formValues, nftActions, orderFlow, rates } = props
  const { amount, fix } = formValues
  const [saleType, setSaleType] = useState('fixed-price')
  const [open, setOpen] = useState(true)
  const disabled =
    saleType === 'fixed-price'
      ? // Fixed Price
        !formValues.amount || props.orderFlow.isSubmitting
      : // Dutch (Declining)
        ((!formValues.starting ||
          !formValues.ending ||
          props.orderFlow.isSubmitting ||
          formValues.ending > formValues.starting) &&
          formValues?.timedAuctionType === 'decliningPrice') ||
        // English (Ascending)
        (!formValues.starting && formValues?.timedAuctionType === 'highestBidder')

  const resetForms = () => {
    formValues.amount = ''
    formValues.starting = ''
    formValues.ending = ''
    formValues.expirationDays = 1
    formValues.timedAuctionType = 'highestBidder'
  }
  const setToFixed = () => {
    setSaleType('fixed-price')
  }
  const setToTimedAuction = () => {
    setSaleType('timed-auction')
  }
  const coin = () => {
    return saleType === 'timed-auction' && formValues?.timedAuctionType === 'highestBidder'
      ? 'WETH'
      : 'ETH'
  }

  const enteredAmountAnalytics = () => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_ENTERED_AMOUNT,
      properties: {
        currency: coin(),
        input_amount: Number(amount)
      }
    })
  }

  const cryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin: coin(),
          currency: props.walletCurrency,
          maxPrecision: 8,
          rates,
          value: amount
        })
      : amount
  const fiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin: coin(),
          currency: props.walletCurrency,
          isStandard: true,
          rates,
          value: amount || 0
        })
      : amount
  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => <NftFlyoutLoader />,
        NotAsked: () => <NftFlyoutLoader />,
        Success: (val) => (
          <>
            <StickyHeaderWrapper>
              <FlyoutHeader data-e2e='wrapEthHeader' mode='back' onClick={() => close()}>
                Sell Item
              </FlyoutHeader>
            </StickyHeaderWrapper>
            <AssetDesc>
              <img
                style={{
                  borderRadius: '8px',
                  height: '64px',
                  marginRight: '12px',
                  width: 'auto'
                }}
                alt='nft-asset'
                src={val.image_url.replace(/=s\d*/, '')}
              />
              <div>
                <Text style={{ marginTop: '4px' }} size='20px' color='grey900' weight={600}>
                  {val?.name}
                </Text>
                <Text
                  size='14px'
                  weight={600}
                  color='orange600'
                  style={{
                    background: colors.orange100,
                    borderRadius: '8px',
                    padding: '5px 8px',
                    textAlign: 'center',
                    width: 'fit-content'
                  }}
                >
                  Not Verified
                </Text>
              </div>
            </AssetDesc>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {saleType === 'fixed-price' ? (
                <>
                  <Row>
                    <Value>
                      <AmountFieldInput
                        coin={coin()}
                        fiatCurrency={props.walletCurrency}
                        amtError={false}
                        quote={fix === 'CRYPTO' ? fiatAmt : cryptoAmt}
                        fix={fix as 'CRYPTO' | 'FIAT'}
                        name='amount'
                        showCounter
                        showToggle
                        data-e2e='amountField'
                        onToggleFix={() => {
                          props.formActions.change(
                            'nftMarkForSale',
                            'fix',
                            fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO'
                          )
                          props.formActions.change(
                            'nftMarkForSale',
                            'amount',
                            fix === 'CRYPTO' ? fiatAmt : cryptoAmt
                          )
                        }}
                      />
                    </Value>
                  </Row>
                </>
              ) : (
                // Time Based Auction
                <>
                  <Row>
                    <Value>
                      <AmountFieldInput
                        coin={coin()}
                        fiatCurrency={props.walletCurrency}
                        amtError={false}
                        quote={fix === 'CRYPTO' ? fiatAmt : cryptoAmt}
                        fix={fix as 'CRYPTO' | 'FIAT'}
                        name='starting'
                        showCounter
                        showToggle
                        data-e2e='amountField'
                        onToggleFix={() => {
                          props.formActions.change(
                            'nftMarkForSale',
                            'fix',
                            fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO'
                          )
                          props.formActions.change(
                            'nftMarkForSale',
                            'amount',
                            fix === 'CRYPTO' ? fiatAmt : cryptoAmt
                          )
                        }}
                      />
                    </Value>
                  </Row>
                  {formValues?.timedAuctionType === 'decliningPrice' && (
                    <Row>
                      <Value>
                        <AmountFieldInput
                          coin={coin()}
                          fiatCurrency={props.walletCurrency}
                          amtError={false}
                          quote={fix === 'CRYPTO' ? fiatAmt : cryptoAmt}
                          fix={fix as 'CRYPTO' | 'FIAT'}
                          name='ending'
                          showCounter
                          // validate={[required, validDecliningPrice]}
                          showToggle
                          onChange={() => {
                            nftActions.fetchFees({
                              asset: val,
                              endPrice: undefined,
                              expirationDays: formValues.expirationDays,
                              operation: GasCalculationOperations.Sell,
                              paymentTokenAddress: window.coins.WETH.coinfig.type.erc20Address,
                              startPrice: Number(formValues.starting)
                            })
                          }}
                          data-e2e='amountField'
                          onToggleFix={() => {
                            props.formActions.change(
                              'nftMarkForSale',
                              'fix',
                              fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO'
                            )
                            props.formActions.change(
                              'nftMarkForSale',
                              'amount',
                              fix === 'CRYPTO' ? fiatAmt : cryptoAmt
                            )
                          }}
                        />
                      </Value>
                    </Row>
                  )}
                </>
              )}
              <Row>
                <Value>
                  <SaleType>
                    <SaleSelection
                      onClick={() => {
                        setToFixed()
                        resetForms()
                      }}
                      style={
                        saleType === 'fixed-price'
                          ? {
                              background: colors.blue000,
                              border: `1px solid ${colors.blue600}`,
                              color: colors.blue600
                            }
                          : { border: `1px solid ${colors.grey100}` }
                      }
                    >
                      <IconTag
                        color='grey600'
                        name='tag'
                        fontSize={32}
                        style={
                          saleType === 'fixed-price'
                            ? {
                                color: colors.blue600,
                                padding: '0em 2em'
                              }
                            : {
                                padding: '0em 2em'
                              }
                        }
                      />
                      <Text
                        size='16px'
                        weight={600}
                        style={
                          saleType === 'fixed-price'
                            ? {
                                alignItems: 'center',
                                color: colors.blue600,
                                display: 'block',
                                textAlign: 'center'
                              }
                            : {
                                alignItems: 'center',
                                display: 'block',
                                textAlign: 'center'
                              }
                        }
                      >
                        Fixed Price
                      </Text>
                    </SaleSelection>
                    <SaleSelection
                      onClick={() => {
                        setToTimedAuction()
                        resetForms()
                      }}
                      style={
                        saleType === 'timed-auction'
                          ? {
                              background: colors.blue000,
                              border: `1px solid ${colors.blue600}`
                            }
                          : { border: `1px solid ${colors.grey100}` }
                      }
                    >
                      <IconPending
                        color='grey600'
                        name='timer'
                        fontSize={32}
                        style={
                          saleType === 'timed-auction'
                            ? {
                                color: colors.blue600,
                                padding: '0em 2em'
                              }
                            : {
                                padding: '0em 2em'
                              }
                        }
                      />
                      <Text
                        size='16px'
                        weight={600}
                        style={
                          saleType === 'timed-auction'
                            ? {
                                alignItems: 'center',
                                color: colors.blue600,
                                display: 'block',
                                textAlign: 'center'
                              }
                            : {
                                alignItems: 'center',
                                display: 'block',
                                textAlign: 'center'
                              }
                        }
                      >
                        Timed Auction
                      </Text>
                    </SaleSelection>
                  </SaleType>
                </Value>
              </Row>
              {saleType === 'timed-auction' && (
                <Row>
                  <Title>
                    <b>
                      <FormattedMessage id='copy.starting_price' defaultMessage='Method' />
                    </b>
                  </Title>
                  <Value>
                    <FormWrapper>
                      <div style={{ marginBottom: '8px' }}>
                        <Field
                          name='timedAuctionType'
                          component={SelectBox}
                          onChange={resetForms}
                          elements={[
                            {
                              group: '',
                              items: map(
                                (item) => ({
                                  text: item.text,
                                  value: item.value
                                }),
                                [
                                  { text: 'Sell with declining price', value: 'decliningPrice' },
                                  { text: 'Sell to highest bidder', value: 'highestBidder' }
                                ]
                              )
                            }
                          ]}
                        />
                      </div>
                    </FormWrapper>
                  </Value>
                </Row>
              )}
              <Row>
                <Title>
                  <b>
                    <FormattedMessage id='copy.select_coin' defaultMessage='Expires After' />
                  </b>
                </Title>
                <Value>
                  <Field
                    name='expirationDays'
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                            { text: '1 Day', value: 1 },
                            { text: '3 Days', value: 3 },
                            { text: '7 Days', value: 7 },
                            { text: '1 Months', value: 30 },
                            { text: '3 Months', value: 90 },
                            { text: '6 Months', value: 180 }
                          ]
                        )
                      }
                    ]}
                  />
                </Value>
              </Row>
              <Row>
                <MarkForSaleFees {...props} asset={val} />
              </Row>
              <Row style={{ border: 'unset' }}>
                {open && (
                  <>
                    <Icon
                      onClick={() => {
                        setOpen(false)
                      }}
                      name='close'
                      cursor
                      role='button'
                      style={{
                        background: 'lightgrey',
                        borderRadius: '12px',
                        color: 'grey',
                        fontSize: '16px',
                        marginTop: '1.1em',
                        padding: '0.3em',
                        position: 'absolute',
                        right: '3.5em'
                      }}
                    />
                    <div
                      style={{ background: colors.grey000, borderRadius: '8px', padding: '1em' }}
                    >
                      <Text weight={600} style={{ padding: '0.5em 0em' }}>
                        Listing Is Free
                      </Text>
                      <Text size='14px' weight={500} style={{ paddingBottom: '1em' }}>
                        Once sold, the above fees will be deducted from the sale.{' '}
                        <Link
                          href='https://support.opensea.io/hc/en-us/articles/1500011590241-What-are-Service-and-Creator-fees'
                          size='14px'
                          target='_blank'
                        >
                          Learn more about fees.
                        </Link>
                      </Text>
                    </div>
                  </>
                )}
              </Row>
            </div>
            <StickyCTA>
              <div style={{ display: 'none' }}>
                <SellFees {...props} asset={val} />
              </div>

              {props.orderFlow.fees.cata({
                Failure: () => (
                  <Button jumbo nature='sent' fullwidth data-e2e='sellNft' disabled>
                    <FormattedMessage id='copy.sell_item' defaultMessage='Sell Item' />
                  </Button>
                ),
                Loading: () => (
                  <Button jumbo nature='primary' fullwidth data-e2e='sellNft' disabled>
                    <FormattedMessage id='copy.sell_item' defaultMessage='Sell Item' />
                  </Button>
                ),
                NotAsked: () => null,
                Success: (fees) => (
                  <Button
                    jumbo
                    nature='primary'
                    fullwidth
                    data-e2e='sellNft'
                    disabled={disabled}
                    onClick={() => {
                      enteredAmountAnalytics()
                      analyticsActions.trackEvent({
                        key: Analytics.NFT_SELL_ITEM_CLICKED,
                        properties: {
                          amount: Number(amount),
                          collection: val.collection.name,
                          collection_id: val.token_id,
                          selling_fees: Number(fees.totalFees),
                          type: saleType === 'fixed-price' ? 'FIXED_PRICE' : 'TIME_AUCTION'
                        }
                      })
                      if (saleType === 'fixed-price') {
                        nftActions.createSellOrder({
                          asset: val,
                          endPrice: null,
                          expirationDays: formValues.expirationDays,
                          gasData: fees,
                          paymentTokenAddress: undefined,
                          startPrice: Number(formValues.amount),
                          waitForHighestBid: false
                        })
                        // English Auction
                      } else if (
                        saleType === 'timed-auction' &&
                        formValues?.timedAuctionType === 'highestBidder'
                      ) {
                        nftActions.createSellOrder({
                          asset: val,
                          endPrice: null,
                          expirationDays: formValues.expirationDays,
                          gasData: fees,
                          paymentTokenAddress: window.coins.WETH.coinfig.type.erc20Address,
                          startPrice: Number(formValues.starting),
                          waitForHighestBid: true
                        })
                      }
                      // Dutch Auction
                      else {
                        nftActions.createSellOrder({
                          asset: val,
                          endPrice: Number(formValues.ending),
                          expirationDays: formValues.expirationDays,
                          gasData: fees,
                          paymentTokenAddress: undefined,
                          startPrice: Number(formValues.starting),
                          waitForHighestBid: false
                        })
                      }
                    }}
                  >
                    {formValues.amount || formValues.starting ? (
                      props.orderFlow.isSubmitting ? (
                        <HeartbeatLoader color='blue100' height='20px' width='20px' />
                      ) : (
                        <FormattedMessage
                          id='copy.sell_item_value'
                          defaultMessage='Sell Item for {val}'
                          values={{
                            val: formValues.amount
                              ? `${formValues.amount} ${coin()}`
                              : `${formValues.starting} ${coin()}`
                          }}
                        />
                      )
                    ) : (
                      <FormattedMessage id='copy.sell_item' defaultMessage='Sell Item' />
                    )}
                  </Button>
                )
              })}
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('nftMarkForSale')(state) as {
    amount: string
    ending: string
    expirationDays: number
    fix: string
    starting: string
    timedAuctionType: string
  },
  rates: getRatesSelector('WETH', state).getOrElse({} as RatesType),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  reduxForm<{}, OwnProps>({
    form: 'nftMarkForSale',
    initialValues: {
      coin: 'ETH',
      expirationDays: 1,
      fix: 'CRYPTO',
      listingTime: format(new Date(), 'yyyy-MM-dd'),
      timedAuctionType: 'highestBidder'
    }
  }),
  connector
)

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MarkForSale) as React.FC<OwnProps>
