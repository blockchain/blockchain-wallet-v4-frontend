import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { BlueCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { Row, Title, Value } from 'components/Flyout/model'
import { NftOrderStepEnum } from 'data/components/nfts/types'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import BuyCTA from './BuyNow/cta'
import BuyFees from './BuyNow/fees'
import CancelListingCTA from './CancelListing/cta'
import CancelListingFees from './CancelListing/fees'

const ShowAsset: React.FC<Props> = (props) => {
  const { close, nftActions, orderFlow } = props
  // activeOrder ? User wants to buy : User wants to sell
  const { activeOrder } = orderFlow

  return (
    <>
      {orderFlow.asset.cata({
        Failure: (e) => (
          <div style={{ position: 'relative' }}>
            <Icon
              onClick={() => close()}
              name='close'
              cursor
              role='button'
              style={{ position: 'absolute', right: '40px', top: '40px' }}
            />
            <Text color='red600'>{e}</Text>
          </div>
        ),
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
            {activeOrder ? (
              <BuyFees {...props} />
            ) : val.sell_orders.length > 0 ? (
              <CancelListingFees {...props} asset={val} />
            ) : null}
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
              {/* activeOrder, user can buy now */}
              {activeOrder ? (
                <BuyCTA {...props} />
              ) : /* User has 1 or more sell_orders, cancel them */
              val.sell_orders?.length ? (
                <CancelListingCTA {...props} asset={val} />
              ) : (
                /* TODO: show fee required to list (if needed) */
                !val.sell_orders?.length && (
                  <Button
                    jumbo
                    nature='empty-blue'
                    fullwidth
                    data-e2e='sellNft'
                    onClick={() =>
                      nftActions.setOrderFlowStep({ step: NftOrderStepEnum.MARK_FOR_SALE })
                    }
                  >
                    <FormattedMessage id='copy.mark_for_sale' defaultMessage='Mark for Sale' />
                  </Button>
                )
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
