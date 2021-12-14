import React, { useEffect } from 'react'
import styled from 'styled-components'

import { displayCoinToCoin } from '@core/exchange'
import { SpinningLoader, Text } from 'blockchain-info-components'
import LazyLoadWrapper from 'components/LazyLoadContainer'

import { Props as OwnProps } from '..'

const Row = styled(Text)`
  width: 100%;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`

const Col = styled.div`
  display: flex;
  align-items: center;
  > div {
    margin-right: 8px;
  }
`

const LazyLoadContainer = styled(LazyLoadWrapper)`
  max-width: 1200px;
`

const Offers: React.FC<Props> = (props) => {
  useEffect(() => {
    props.nftsActions.fetchNftOffersMade()
  }, [])

  if (props.offersMade.isLoading)
    return (
      <div style={{ marginTop: '20px' }}>
        <SpinningLoader width='14px' height='14px' borderWidth='3px' />
      </div>
    )

  return (
    <LazyLoadContainer onLazyLoad={() => props.nftsActions.fetchNftOffersMade()}>
      {props.offersMade.list.length ? (
        props.offersMade.list.map((offer, i) => {
          return (
            <Row key={i}>
              <Col>
                <img
                  style={{ height: '32px', marginRight: '8px' }}
                  alt=''
                  src={offer.asset.image_thumbnail_url}
                />
                <div>{offer.asset.collection.name}</div>
                <div>-</div>
                <div>({offer.asset.name})</div>
              </Col>
              <Col>
                <div>
                  {displayCoinToCoin({ coin: offer.payment_token.symbol, value: offer.bid_amount })}
                </div>
              </Col>
            </Row>
          )
        })
      ) : (
        <Row>
          <Col>
            <div>
              <span role='img' aria-label='See no evil'>
                🙈
              </span>{' '}
              No offers made yet!
            </div>
          </Col>
        </Row>
      )}
    </LazyLoadContainer>
  )
}

type Props = OwnProps

export default Offers
