import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import BigNumber from 'bignumber.js'
import { addMinutes, getUnixTime } from 'date-fns'
import styled from 'styled-components'

import { Remote } from '@core'
import { convertCoinToCoin } from '@core/exchange'
import { GasDataI, NftAsset } from '@core/network/api/nfts/types'
import {
  Button,
  CheckBoxInput,
  Color,
  Image,
  Link,
  SpinningLoader,
  Text
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Flex } from 'components/Flex'
import { DeepLinkGoal } from 'data/types'

import GetMoreEthComponent from '../../components/GetMoreEth'
import NftNotInvited from '../../components/NftNotInvited'
import PendingEthTxMessage from '../../components/PendingEthTxMessage'
import { CheckboxWraper } from '../Buy/cta'
import { Props as OwnProps } from '.'

const CTA: React.FC<Props> = ({
  amtToBuy,
  amtToWrap,
  asset,
  canWrap,
  cryptoAmt,
  custodialBalance,
  formActions,
  formErrors,
  formValues,
  isAuthenticated,
  isInvited,
  maxOfferPossible,
  needsWrap,
  nftActions,
  offerFees,
  orderFlow,
  selfCustodyBalance,
  wrapFees
}) => {
  const { fees, isSubmitting, userHasPendingTxR } = orderFlow
  const userHasPendingTx = userHasPendingTxR.getOrElse(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const disabled =
    !formValues.amount ||
    Number(formValues.amount) <= 0 ||
    formErrors.amount ||
    Remote.Loading.is(fees) ||
    userHasPendingTx ||
    isSubmitting

  const toggleTermsAccepted = () => {
    setTermsAccepted(!termsAccepted)
  }
  const acceptTerms = () => {
    setTermsAccepted(true)
  }

  const { coin } = formValues
  if (!isAuthenticated)
    return (
      <LinkContainer
        to={`/open/${DeepLinkGoal.MAKE_OFFER_NFT}?contract_address=${asset.asset_contract.address}&token_id=${asset.token_id}`}
      >
        <Button jumbo nature='primary' fullwidth data-e2e='login'>
          <FormattedMessage id='copy.login_to_make_offer' defaultMessage='Login to Make an Offer' />
        </Button>
      </LinkContainer>
    )

  if (!isInvited) return <NftNotInvited />

  return (
    <div>
      {needsWrap ? (
        <>
          {canWrap ? (
            <div />
          ) : (
            <>
              <GetMoreEthComponent
                amount={cryptoAmt}
                amtToBuy={amtToBuy}
                selfCustodyBalance={new BigNumber(selfCustodyBalance)}
                custodialBalance={new BigNumber(custodialBalance)}
              />
              <div style={{ padding: '1em 0em' }}>
                <Text
                  size='12px'
                  weight={500}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  The max you can offer from this wallet is&nbsp;
                  <CoinDisplay
                    size='12px'
                    weight={600}
                    color='blue600'
                    style={{ cursor: 'pointer' }}
                    role='button'
                    coin={formValues.coin || 'WETH'}
                    onClick={() => {
                      formActions.change('nftMakeOffer', 'fix', 'CRYPTO')
                      formActions.change(
                        'nftMakeOffer',
                        'amount',
                        Number(
                          convertCoinToCoin({
                            baseToStandard: true,
                            coin,
                            value: Math.max(maxOfferPossible.toNumber(), 0)
                          })
                        ).toFixed(Math.min(8, window.coins[coin].coinfig.precision))
                      )
                    }}
                  >
                    {Math.max(maxOfferPossible.toNumber(), 0)}
                  </CoinDisplay>
                </Text>
              </div>
            </>
          )}
        </>
      ) : null}
      {formErrors.amount ? (
        <Text color='red600' weight={500} style={{ padding: '1em 0em', textAlign: 'center' }}>
          <FormattedMessage
            id='copy.not_enough_funds_make_offer'
            defaultMessage='Not enough {coin} to make an offer.'
            values={{ coin: formValues.coin }}
          />
        </Text>
      ) : null}
      {disabled ? null : (
        <CheckboxWraper termsAccepted={termsAccepted}>
          {' '}
          <div style={{ padding: '1.2em 0em' }}>
            <CheckBoxInput
              name='terms'
              disabled={false}
              onChange={toggleTermsAccepted}
              checked={termsAccepted}
            />
          </div>
          <label htmlFor='terms'>
            <Text weight={500} style={{ padding: '1em 0em', textAlign: 'center' }}>
              <FormattedMessage
                id='copy.agree_to_blockchain'
                defaultMessage='I agree to Blockchain.com’s'
              />{' '}
              <Link
                onClick={acceptTerms}
                href='https://www.blockchain.com/legal/terms'
                target='_blank'
              >
                <FormattedMessage id='copy.terms_of_service' defaultMessage='Terms of Service' />
              </Link>
            </Text>
          </label>
        </CheckboxWraper>
      )}
      {needsWrap && !canWrap ? (
        <Button disabled rounded nature='dark' fullwidth data-e2e='notEnoughEth'>
          <Image width='16px' height='16px' name='alert-orange' style={{ marginRight: '0.5em' }} />
          <FormattedMessage id='copy.not_enough_eth' defaultMessage='Not Enough ETH' />
        </Button>
      ) : (
        <>
          {userHasPendingTx ? (
            <>
              <PendingEthTxMessage />
              <br />
            </>
          ) : null}
          <Button
            jumbo
            nature={formErrors.amount ? 'sent' : 'primary'}
            fullwidth
            data-e2e='makeOfferNft'
            disabled={disabled || !termsAccepted}
            onClick={() =>
              nftActions.createOffer({
                amtToWrap: amtToWrap.isGreaterThan(0) ? amtToWrap.toString() : '',
                asset,
                expirationTime: getUnixTime(
                  addMinutes(new Date(), parseInt(formValues.expirationMinutes))
                ),
                offerFees,
                wrapFees,
                ...formValues
              })
            }
          >
            {formValues.amount && Number(formValues.amount) > 0 ? (
              orderFlow.isSubmitting ? (
                <>
                  {orderFlow.status &&
                    (orderFlow.status === 'WRAP_ETH' ? (
                      <>
                        <SpinningLoader width='14px' height='14px' borderWidth='3px' />
                        <div style={{ paddingLeft: '1em' }}>
                          <FormattedMessage id='copy.wrap_eth' defaultMessage='Wrapping Eth...' />
                        </div>
                      </>
                    ) : (
                      <>{orderFlow.status}</>
                    ))}
                </>
              ) : (
                <FormattedMessage
                  id='copy.make_offer_value'
                  defaultMessage={!needsWrap ? 'Make an Offer for {val}' : 'Wrap ETH & Make Offer'}
                  values={{
                    val: `${formValues.amount} ${formValues.coin}`
                  }}
                />
              )
            ) : (
              <FormattedMessage id='copy.make_an_offer' defaultMessage='Make an Offer' />
            )}
          </Button>
        </>
      )}
    </div>
  )
}

type Props = OwnProps & {
  amtToBuy: BigNumber
  amtToWrap: BigNumber
  asset: NftAsset
  canWrap: boolean
  cryptoAmt: string
  custodialBalance: any
  maxOfferPossible: BigNumber
  needsWrap: boolean
  offerFees: GasDataI
  selfCustodyBalance: any
  wrapFees: GasDataI
}

export default CTA
