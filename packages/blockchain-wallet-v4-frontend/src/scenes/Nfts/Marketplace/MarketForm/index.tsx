import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { convertCoinToCoin } from '@core/exchange'
import { Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Form } from 'components/Form'
import { media } from 'services/styles'

import { Props as OwnProps } from '../..'

const Wrapper = styled.div`
  position: sticky;
  height: 100%;
  top: 48px;
  overflow: scroll;
  background: ${(props) => props.theme.white};
  z-index: 20;
  ${media.atLeastTabletL`
    top: 61px;
    margin-right: 20px;
    max-width: 300px;
    width: 25%;
  `} > form {
    ${media.tabletL`
      display: flex;
      > div {
        flex: 1;
      }
    `}
  }
`

const FormWrapper = styled.div`
  gap: 8px;
  max-height: 322px;
  overflow: scroll;
  ${media.tabletL`
    max-height: 170px;
  `}
`

const Collection = styled.div`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.grey100};
  margin-bottom: 16px;
`

const CollectionField = styled.div`
  padding: 8px 4px;
  transition: background-color 0.3s;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  input {
    visibility: hidden;
  }
  &.active,
  &:hover {
    background: ${(props) => props.theme.blue000};
  }
`

const CollectionLabel = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  img {
    margin-left: -8px;
    border-radius: 8px;
    height: 32px;
    margin-right: 8px;
  }
`

const MarketForm: React.FC<Props> = (props: Props) => {
  return (
    <Wrapper>
      <Form>
        <Collection>
          <Text color='grey400' weight={600} size='18px'>
            {props.marketplace.collection?.name}
          </Text>
          <Text style={{ marginTop: '8px' }} color='black' weight={600} size='14px'>
            <FormattedMessage id='copy.7_day_vol' defaultMessage='7 Day Volume' />
          </Text>
          <CoinDisplay
            coin='ETH'
            weight={500}
            size='12px'
            color='grey600'
            style={{ marginTop: '1px' }}
          >
            {convertCoinToCoin({
              baseToStandard: false,
              coin: 'ETH',
              value: props.marketplace.collection?.collection_data?.stats?.seven_day_volume || 0
            })}
          </CoinDisplay>
          <Text style={{ marginTop: '8px' }} color='black' weight={600} size='14px'>
            <FormattedMessage id='copy.30_day_avg' defaultMessage='30 Day Avg. Price' />
          </Text>
          <CoinDisplay
            coin='ETH'
            weight={500}
            size='12px'
            color='grey600'
            style={{ marginTop: '1px' }}
          >
            {convertCoinToCoin({
              baseToStandard: false,
              coin: 'ETH',
              value:
                props.marketplace.collection?.collection_data?.stats?.thirty_day_average_price || 0
            })}
          </CoinDisplay>
          <Text style={{ marginTop: '8px' }} color='black' weight={600} size='14px'>
            <FormattedMessage id='copy.floor_price' defaultMessage='Floor Price' />
          </Text>
          <CoinDisplay
            coin='ETH'
            weight={500}
            size='12px'
            color='grey600'
            style={{ marginTop: '1px' }}
          >
            {convertCoinToCoin({
              baseToStandard: false,
              coin: 'ETH',
              value: props.marketplace.collection?.collection_data?.stats?.floor_price || 0
            })}
          </CoinDisplay>
        </Collection>
        <FormWrapper>
          {props.collections.map((collection) => (
            <CollectionField
              key={collection.opensea_slug}
              // @ts-ignore
              className={props.formValues?.collection === collection.opensea_slug ? 'active' : ''}
            >
              <Field
                component='input'
                type='radio'
                id={collection.opensea_slug}
                name='collection'
                value={collection.opensea_slug}
                onChange={() =>
                  props.formActions.change('nftMarketplace', 'collection', collection.opensea_slug)
                }
              />
              <CollectionLabel htmlFor={collection.opensea_slug}>
                <img src={collection.image_url} alt={collection.display_name} />
                <Text
                  cursor='pointer'
                  style={{ marginLeft: '4px;', marginTop: '2px' }}
                  color='black'
                  weight={600}
                >
                  {collection.display_name}
                </Text>
              </CollectionLabel>
            </CollectionField>
          ))}
        </FormWrapper>
      </Form>
    </Wrapper>
  )
}

type Props = OwnProps

export default reduxForm<{}, OwnProps>({
  form: 'nftMarketplace',
  initialValues: { collection: 'doodles-official' }
})(MarketForm)
