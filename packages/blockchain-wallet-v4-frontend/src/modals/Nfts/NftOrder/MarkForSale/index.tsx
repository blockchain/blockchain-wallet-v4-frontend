import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { PaletteColors, Switch } from '@blockchain-com/constellation'
import { IconPending, IconTag } from '@blockchain-com/icons'
import { format } from 'date-fns'
import { map } from 'ramda'
import { bindActionCreators, compose } from 'redux'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { getRatesSelector } from '@core/redux/data/misc/selectors'
import { RatesType } from '@core/types'
import { Icon, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Title, Value } from 'components/Flyout'
import FlyoutHeader from 'components/Flyout/Header'
import AmountFieldInput from 'components/Form/AmountFieldInput'
import NumberBox from 'components/Form/NumberBox'
import SelectBox from 'components/Form/SelectBox'
import { actions, selectors } from 'data'
import { Analytics } from 'data/types'
import { useRemote } from 'hooks'
import { required } from 'services/forms'
import { media } from 'services/styles'

import { NftFlyoutRow, StickyCTA } from '../../components'
import GreyMessage from '../../components/GreyMessage'
import NftAssetHeaderRow from '../../components/NftAssetHeader'
import NftFlyoutFailure from '../../components/NftFlyoutFailure'
import NftFlyoutLoader from '../../components/NftFlyoutLoader'
import { Props as OwnProps } from '..'
import MarkForSaleCTA from './cta'
import MarkForSaleFees from './fees'
import { NftMarkForSaleFormValues } from './MarkForSale.types'
import { getQuoteAmts } from './MarkForSale.utils'
import { endingLessThanStarting, reserveGreaterThanStarting } from './MarkForSale.validaton'

const FormWrapper = styled.div`
  gap: 8px;
  max-height: 500px;
  ${media.tabletL`
    max-height: 170px;
  `}
`
const SaleType = styled.div`
  justify-content: center;
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
  const { analyticsActions, close, formValues, openSeaAssetR, orderFlow, rates } = props
  const { fix } = formValues || { fix: 'CRYPTO' }
  const [saleType, setSaleType] = useState<'fixed-price' | 'timed-auction'>('fixed-price')
  const [isReservedChecked, setIsReserveChecked] = useState<boolean>(false)
  const [open, setOpen] = useState(true)

  const resetForms = () => {
    formValues.fixAmount = ''
    formValues.starting = ''
    formValues.ending = ''
    formValues.expirationMinutes = 1440
    formValues.timedAuctionType = 'decliningPrice'
  }
  const setToFixed = () => {
    setSaleType('fixed-price')
  }
  const setToTimedAuction = () => {
    setSaleType('timed-auction')
  }

  const coin =
    saleType === 'timed-auction' && formValues?.timedAuctionType === 'highestBidder'
      ? 'WETH'
      : 'ETH'

  const {
    endingFiatAmt,
    fixCryptoAmt,
    fixFiatAmt,
    reserveFiatAmt,
    startingCryptoAmt,
    startingFiatAmt
  } = getQuoteAmts(formValues, rates, coin, props.walletCurrency)

  const amount = saleType === 'fixed-price' ? fixCryptoAmt : startingCryptoAmt

  const enteredAmountAnalytics = () => {
    analyticsActions.trackEvent({
      key: Analytics.NFT_ENTERED_AMOUNT,
      properties: {
        currency: coin,
        input_amount: Number(amount)
      }
    })
  }
  const feesR = useRemote(() => orderFlow.fees)
  const fees = feesR?.data

  return (
    <>
      {openSeaAssetR.cata({
        Failure: (e) => <NftFlyoutFailure error={e} close={close} />,
        Loading: () => <NftFlyoutLoader close={props.close} />,
        NotAsked: () => <NftFlyoutLoader close={props.close} />,
        Success: (asset) => (
          <>
            <FlyoutHeader sticky data-e2e='wrapEthHeader' mode='back' onClick={() => close()}>
              Sell Item
            </FlyoutHeader>
            <NftAssetHeaderRow asset={asset} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {saleType === 'fixed-price' ? (
                <>
                  <NftFlyoutRow>
                    <Value>
                      <AmountFieldInput
                        coin={coin}
                        fiatCurrency={props.walletCurrency}
                        amountError={false}
                        quote={fix === 'CRYPTO' ? fixFiatAmt : fixCryptoAmt}
                        fix={fix as 'CRYPTO' | 'FIAT'}
                        name='fixAmount'
                        showCounter
                        showToggle
                        // @ts-ignore
                        onChange={enteredAmountAnalytics}
                        data-e2e='amountField'
                        onToggleFix={() => {
                          props.formActions.change(
                            'nftMarkForSale',
                            'fix',
                            fix === 'CRYPTO' ? 'FIAT' : 'CRYPTO'
                          )
                          props.formActions.change(
                            'nftMarkForSale',
                            'fixAmount',
                            fix === 'CRYPTO' ? fixFiatAmt : fixCryptoAmt
                          )
                        }}
                      />
                    </Value>
                  </NftFlyoutRow>
                </>
              ) : (
                // Time Based Auction
                <>
                  <NftFlyoutRow>
                    <Value>
                      <Text style={{ marginBottom: '2px' }} size='14px' weight={600}>
                        <FormattedMessage
                          id='copy.starting_price'
                          defaultMessage='Starting Price'
                        />
                      </Text>
                      <Field
                        validate={[required]}
                        autoFocus
                        name='starting'
                        component={NumberBox}
                      />
                      <Flex justifyContent='flex-end'>
                        <Text style={{ marginTop: '4px' }} size='12px' weight={600}>
                          {startingFiatAmt} {props.walletCurrency}
                        </Text>
                      </Flex>
                    </Value>
                  </NftFlyoutRow>
                  {formValues?.timedAuctionType === 'decliningPrice' ? (
                    <NftFlyoutRow>
                      <Value>
                        <Text style={{ marginBottom: '2px' }} size='14px' weight={600}>
                          <FormattedMessage id='copy.ending_price' defaultMessage='Ending Price' />
                        </Text>
                        <Field
                          validate={[endingLessThanStarting, required]}
                          name='ending'
                          component={NumberBox}
                        />
                        <Flex justifyContent='flex-end'>
                          <Text style={{ marginTop: '4px' }} size='12px' weight={600}>
                            {endingFiatAmt} {props.walletCurrency}
                          </Text>
                        </Flex>
                      </Value>
                    </NftFlyoutRow>
                  ) : (
                    <NftFlyoutRow>
                      <Value>
                        <Flex justifyContent='space-between' alignItems='center'>
                          <Text style={{ marginBottom: '2px' }} size='14px' weight={600}>
                            <FormattedMessage
                              id='copy.reserve_price'
                              defaultMessage='Reserve Price'
                            />
                          </Text>
                          <Switch
                            checked={isReservedChecked}
                            onClick={() => setIsReserveChecked((x) => !x)}
                          />
                        </Flex>
                        {isReservedChecked ? (
                          <div style={{ marginTop: '8px' }}>
                            <Field
                              errorLeft
                              errorBottom
                              validate={[reserveGreaterThanStarting]}
                              name='reserve'
                              component={NumberBox}
                            />
                            <Flex justifyContent='flex-end'>
                              <Text style={{ marginTop: '4px' }} size='12px' weight={600}>
                                {reserveFiatAmt} {props.walletCurrency}
                              </Text>
                            </Flex>
                          </div>
                        ) : null}
                      </Value>
                    </NftFlyoutRow>
                  )}
                </>
              )}
              <NftFlyoutRow>
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
                              background: PaletteColors['blue-000'],
                              border: `1px solid ${PaletteColors['blue-600']}`,
                              color: PaletteColors['blue-600']
                            }
                          : { border: `1px solid ${PaletteColors['grey-100']}` }
                      }
                    >
                      <IconTag
                        color='grey600'
                        name='tag'
                        fontSize={32}
                        style={
                          saleType === 'fixed-price'
                            ? {
                                color: PaletteColors['blue-600'],
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
                                color: PaletteColors['blue-600'],
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
                              background: PaletteColors['blue-000'],
                              border: `1px solid ${PaletteColors['blue-600']}`
                            }
                          : { border: `1px solid ${PaletteColors['grey-100']}` }
                      }
                    >
                      <IconPending
                        color='grey600'
                        name='timer'
                        fontSize={32}
                        style={
                          saleType === 'timed-auction'
                            ? {
                                color: PaletteColors['blue-600'],
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
                                color: PaletteColors['blue-600'],
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
              </NftFlyoutRow>
              {saleType === 'timed-auction' && (
                <NftFlyoutRow>
                  <Title>
                    <b>
                      <FormattedMessage id='buttons.method' defaultMessage='Method' />
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
                </NftFlyoutRow>
              )}
              <NftFlyoutRow>
                <Title>
                  <b>
                    <FormattedMessage id='copy.select_coin' defaultMessage='Expires After' />
                  </b>
                </Title>
                <Value>
                  <Field
                    name='expirationMinutes'
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(minutes: any) => {
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
                            { text: '3 Mins', value: 3 },
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
              <NftFlyoutRow>
                {open && feesR.hasData && fees?.totalFees === 0 ? (
                  <>
                    <GreyMessage>
                      <Flex alignItems='center' justifyContent='space-between'>
                        <Text color='grey900' weight={600}>
                          <FormattedMessage
                            id='copy.listing_is_free'
                            defaultMessage='Listing Is Free'
                          />
                        </Text>
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
                            padding: '0.3em'
                          }}
                        />
                      </Flex>
                      <Text size='12px'>
                        Once sold, the below fees will be deducted from the sale.{' '}
                        <Link
                          href='https://support.opensea.io/hc/en-us/articles/1500011590241-What-are-Service-and-Creator-fees'
                          size='12px'
                          target='_blank'
                        >
                          Learn more about fees.
                        </Link>
                      </Text>
                    </GreyMessage>
                  </>
                ) : null}
              </NftFlyoutRow>
            </div>
            <StickyCTA>
              {formValues.timedAuctionType === 'highestBidder' ? (
                <>
                  <GreyMessage>
                    <Text color='grey900' weight={600}>
                      <FormattedMessage
                        id='copy.english_auction_not_supported'
                        defaultMessage='English Auctions Not Supported'
                      />
                    </Text>
                    <Text size='12px'>
                      <FormattedMessage
                        id='copy.english_auction_explainer'
                        defaultMessage='We are working closely with the OpenSea team to add support for selling to the highest bidder. In the meantime, please select another method.'
                      />
                    </Text>
                  </GreyMessage>
                  <br />
                </>
              ) : null}
              <MarkForSaleFees {...props} asset={asset} />
              <br />
              <MarkForSaleCTA {...props} asset={asset} amount={amount} saleType={saleType} />
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}

const mapStateToProps = (state) => ({
  formValues: selectors.form.getFormValues('nftMarkForSale')(state) as NftMarkForSaleFormValues,
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
      expirationMinutes: 1440,
      fix: 'CRYPTO',
      listingTime: format(new Date(), 'yyyy-MM-dd'),
      timedAuctionType: 'decliningPrice'
    }
  }),
  connector
)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(MarkForSale) as React.FC<OwnProps>
