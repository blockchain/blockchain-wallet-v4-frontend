import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { NftAsset } from '@core/network/api/nfts/types'
import { SpinningLoader, Text } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay/'
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

const NftCollectionForm: React.FC<Props> = (props: Props) => {
  const collections = props.assets.list.reduce((acc, asset) => {
    if (acc.find((collection) => collection.slug === asset.collection.slug)) {
      return acc
    }
    acc.push(asset.collection)

    return acc
  }, [] as NftAsset['collection'][])
  const balance = props.assets.list.reduce((acc, asset) => {
    return acc + Number(asset.last_sale?.total_price || 0)
  }, 0)

  return (
    <LeftColWrapper>
      <Form>
        <InfoStatsWrapper>
          <Text color='grey400' weight={600} size='18px'>
            <FormattedMessage id='copy.my_collection' defaultMessage='My Collection' />
          </Text>
          <Text style={{ marginTop: '8px' }} color='black' weight={600} size='14px'>
            <FormattedMessage id='copy.balance' defaultMessage='Balance' />
          </Text>
          {props.assets.isLoading ? (
            <div style={{ marginTop: '4px' }}>
              <SpinningLoader width='14px' height='14px' borderWidth='3px' />
            </div>
          ) : (
            <Text color='black' style={{ display: 'flex', marginTop: '4px' }}>
              <CoinDisplay
                coin='ETH'
                weight={600}
                size='16px'
                color='black'
                style={{ marginTop: '1px' }}
              >
                {balance}
              </CoinDisplay>
              &nbsp;-&nbsp;
              <FiatDisplay
                coin='ETH'
                weight={600}
                size='12px'
                color='grey600'
                style={{ marginTop: '1px' }}
              >
                {balance}
              </FiatDisplay>
            </Text>
          )}
        </InfoStatsWrapper>
        <FormWrapper>
          <CollectionField
            key='all'
            // @ts-ignore
            className={props.assets.collection === 'all' ? 'active' : ''}
          >
            <Field
              component='input'
              type='radio'
              id='all'
              name='collection'
              value='all'
              onChange={() => props.formActions.change('nftCollection', 'collection', 'all')}
            />
            <CollectionLabel htmlFor='all'>
              <Text
                cursor='pointer'
                style={{ marginLeft: '4px;', marginTop: '2px' }}
                color='black'
                weight={600}
              >
                <FormattedMessage id='copy.all' defaultMessage='All' />
              </Text>
            </CollectionLabel>
          </CollectionField>
          {collections.map((collection) => (
            <CollectionField
              key={collection.slug}
              // @ts-ignore
              className={props.assets.collection === collection.slug ? 'active' : ''}
            >
              <Field
                component='input'
                type='radio'
                id={collection.slug}
                name='collection'
                value={collection.slug}
                onChange={() =>
                  props.formActions.change('nftCollection', 'collection', collection.slug)
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
          ))}
        </FormWrapper>
      </Form>
    </LeftColWrapper>
  )
}

type Props = OwnProps

export default reduxForm<{}, OwnProps>({
  destroyOnUnmount: false,
  form: 'nftCollection',
  initialValues: { collection: 'all' }
})(NftCollectionForm)
