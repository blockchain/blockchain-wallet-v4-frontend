import React from 'react'
import { FormattedMessage } from 'react-intl'

import { displayCoinToCoin } from '@core/exchange'
import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { BlueCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Row, Title, Value } from 'components/Flyout/model'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'

const ShowAsset: React.FC<Props> = ({ close, orderFlow }) => {
  // activeOrder ? User wants to buy : User wants to sell
  const { activeOrder } = orderFlow
  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => <Text>{e}</Text>,
        Loading: () => (
          <AssetDesc>
            <SpinningLoader width='14px' height='14px' borderWidth='3px' />
          </AssetDesc>
        ),
        NotAsked: () => null,
        Success: (val) => (
          <>
            <div style={{ position: 'relative' }}>
              <Icon
                onClick={() => close()}
                name='close'
                cursor
                role='button'
                style={{ position: 'absolute', right: '40px', top: '40px' }}
              />
              <FullAssetImage backgroundImage={val?.image_url.replace(/=s\d*/, '')} />
            </div>
            <AssetDesc>
              <Text size='16px' color='grey900' weight={600}>
                {val?.collection?.name}
              </Text>
              <Text style={{ marginTop: '4px' }} size='20px' color='grey900' weight={600}>
                {val?.name}
              </Text>
            </AssetDesc>
            <Row>
              <Title>
                <FormattedMessage id='copy.description' defaultMessage='Description' />
              </Title>
              <Value>
                {val?.description || (
                  <FormattedMessage id='copy.none_found' defaultMessage='None found.' />
                )}
              </Value>
            </Row>
            {activeOrder && (
              <Row>
                <Title>
                  <FormattedMessage id='copy.current_price' defaultMessage='Current Price' />
                </Title>
                <Value>
                  <div style={{ display: 'flex' }}>
                    <CoinDisplay
                      size='14px'
                      color='black'
                      weight={600}
                      coin={activeOrder.paymentTokenContract?.symbol}
                    >
                      {activeOrder.basePrice}
                    </CoinDisplay>
                    &nbsp;-&nbsp;
                    <FiatDisplay
                      size='12px'
                      color='grey600'
                      weight={600}
                      coin={activeOrder.paymentTokenContract?.symbol}
                    >
                      {activeOrder.basePrice}
                    </FiatDisplay>
                  </div>
                </Value>
              </Row>
            )}
            {val?.traits?.map((trait, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Row key={index}>
                <div>
                  <Title>{trait.trait_type}</Title>
                  <Value>
                    {trait.value}{' '}
                    {val?.collection?.stats?.count && (
                      <BlueCartridge>
                        {((trait.trait_count / val?.collection?.stats.count) * 100).toFixed(2)}%
                      </BlueCartridge>
                    )}
                  </Value>
                </div>
              </Row>
            ))}
            <StickyCTA>
              {/* TODO: make a bid */}
              {/* activeOrder, user can buy now */}
              {activeOrder && (
                <Button jumbo nature='primary' fullwidth data-e2e='buyNft'>
                  <FormattedMessage
                    id='copy.buy_now_for'
                    values={{
                      for: displayCoinToCoin({
                        coin: activeOrder.paymentTokenContract?.symbol || 'ETH',
                        value: activeOrder.basePrice.toString()
                      })
                    }}
                    defaultMessage='Buy Now for {for}'
                  />
                </Button>
              )}
              {/* TODO: show fee required to cancel */}
              {/* User has 1 or more sell_orders, cancel them */}
              {!!val.orders?.length && (
                <Button jumbo nature='primary' fullwidth data-e2e='cancelListingNft'>
                  <FormattedMessage id='copy.cancel_listings' defaultMessage='Cancel Listing(s)' />
                </Button>
              )}
              {/* TODO: show fee required to list (if needed) */}
              {!val.orders?.length && (
                <Button jumbo nature='empty-blue' fullwidth data-e2e='sellNft'>
                  <FormattedMessage id='copy.mark_for_sale' defaultMessage='Mark for Sale' />
                </Button>
              )}
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}

type Props = OwnProps

export default ShowAsset
