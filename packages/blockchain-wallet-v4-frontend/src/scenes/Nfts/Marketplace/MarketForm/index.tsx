import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { convertCoinToCoin } from '@core/exchange'
import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Form } from 'components/Form'
import { media } from 'services/styles'

import { Props as OwnProps } from '../..'
import { InfoStatsWrapper, LeftColWrapper } from '../../components'

const FormWrapper = styled.div`
  gap: 8px;
  max-height: 500px;
  overflow: scroll;
  ${media.tabletL`
    max-height: 170px;
  `}
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
    <LeftColWrapper>
      <Form>
        <InfoStatsWrapper>
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
        </InfoStatsWrapper>
        <FormWrapper>
          {props.collections.cata({
            Failure: () => null,
            Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
            NotAsked: () => null,
            Success: (collections) => {
              return collections.map((collection) => (
                <CollectionField
                  key={collection.slug}
                  className={
                    // @ts-ignore
                    props.formValues?.collection === collection.slug ? 'active' : ''
                  }
                >
                  <Field
                    component='input'
                    type='radio'
                    id={collection.slug}
                    name='collection'
                    value={collection.slug}
                    onChange={() =>
                      props.formActions.change('nftMarketplace', 'collection', collection.slug)
                    }
                  />
                  <CollectionLabel htmlFor={collection.slug}>
                    <img src={collection.image_url} alt={collection.name} />
                    <Text
                      cursor='pointer'
                      style={{ marginLeft: '4px;', marginTop: '2px' }}
                      color='black'
                      weight={600}
                    >
                      {collection.name}
                    </Text>
                  </CollectionLabel>
                </CollectionField>
              ))
            }
          })}
        </FormWrapper>
      </Form>
    </LeftColWrapper>
  )
}

type Props = OwnProps

export default reduxForm<{}, OwnProps>({
  destroyOnUnmount: false,
  form: 'nftMarketplace',
  initialValues: { collection: 'doodles-official' }
})(MarketForm)
