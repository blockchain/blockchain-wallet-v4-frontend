import React from 'react'
import { FormattedMessage } from 'react-intl'

import { NULL_ADDRESS } from '@core/redux/payment/nfts/constants'
import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { BlueCartridge } from 'components/Cartridge'
import { Title } from 'components/Flyout'
import { Row, Value } from 'components/Flyout/model'

import { AssetDesc, FullAssetImage, StickyCTA } from '../../components'
import { Props as OwnProps } from '..'
import ActiveOffers from './ActiveOffers'
import ActiveOrders from './ActiveOrders'
import SellCTA from './Sell/cta'
import TransferCTA from './Transfer/cta'

const ShowAsset: React.FC<Props> = (props) => {
  const { close, defaultEthAddr, orderFlow } = props

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
              <FullAssetImage cropped backgroundImage={val?.image_url.replace(/=s\d*/, '')} />
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
              {/* NOTE: val.owner.address is unreliable and can sometimes be NULL_ADDRESS */}
              {/* The fix is to check if the walletUserIsAssetOwnerHack is true (user initiated modal from 'Your Collection' page) */}
              {/* If that flag is true and owner addr is NULL, check the maker is or is not current user */}
              <>
                <SellCTA {...props} asset={val} />
                <TransferCTA {...props} asset={val} />
                <ActiveOrders
                  {...props}
                  asset={val}
                  orders={
                    val.orders?.filter((order) => {
                      return props.orderFlow.walletUserIsAssetOwnerHack &&
                        val.owner.address === NULL_ADDRESS
                        ? order.maker.address.toLowerCase() === defaultEthAddr.toLowerCase()
                        : order.maker.address === val.owner.address
                    }) || []
                  }
                />
                <ActiveOffers
                  {...props}
                  asset={val}
                  offers={
                    val.orders?.filter((order) => {
                      return props.orderFlow.walletUserIsAssetOwnerHack &&
                        val.owner.address === NULL_ADDRESS
                        ? order.maker.address.toLowerCase() !== defaultEthAddr.toLowerCase()
                        : order.maker.address !== val.owner.address
                    }) || []
                  }
                />
              </>
            </StickyCTA>
          </>
        )
      })}
    </>
  )
}

type Props = OwnProps

export default ShowAsset
