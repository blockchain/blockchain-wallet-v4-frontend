import React, { useEffect } from 'react'
import styled from 'styled-components'

import { displayCoinToCoin } from '@core/exchange'
import { Text } from 'blockchain-info-components'
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

  return (
    <LazyLoadContainer onLazyLoad={() => props.nftsActions.fetchNftOffersMade()}>
      {props.offersMade.list.map((offer, i) => {
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
      })}
    </LazyLoadContainer>
  )
}

type Props = OwnProps

export default Offers
