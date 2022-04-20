import React from 'react'
import { FormattedMessage } from 'react-intl'
import { colors, Icon } from '@blockchain-com/constellation'
import { IconCloseCircle } from '@blockchain-com/icons'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'
import { actions } from 'data'
import { AssetSortFields } from 'generated/graphql'

import { NftFilterFormValuesType } from '../NftFilter'

const ActiveTraitFilter = styled.div`
  align-items: center;
  background: ${colors.blue000};
  border: 1px solid ${colors.blue200};
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  justify-content: space-between;
  padding: 12px 16px;
`

const TraitGrid = styled.div<{ hasSomeFilters: boolean }>`
  display: ${(props) => (props.hasSomeFilters ? 'flex' : 'none')};
  flex-wrap: wrap;
  position: sticky;
  gap: 6px;
  top: 0px;
  background: ${(props) => props.theme.white};
  margin-top: -8px;
  padding-top: ${(props) => (props.hasSomeFilters ? '8px' : '0px')};
  padding-bottom: ${(props) => (props.hasSomeFilters ? '16px' : '0px')};
  z-index: 10;
`

const TraitGridFilters: React.FC<Props> = ({
  collectionFilter,
  formActions,
  formValues,
  hasSomeFilters,
  minMaxFilters,
  traitFilters
}) => {
  return (
    <>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
        <TabMenu style={{ marginBottom: '12px', width: 'fit-content' }}>
          <TabMenuItem selected>
            <FormattedMessage id='copy.items' defaultMessage='Items' />
          </TabMenuItem>
          <TabMenuItem>
            <FormattedMessage id='copy.activity' defaultMessage='Activity' />
          </TabMenuItem>
        </TabMenu>
        <div style={{ height: '56px', width: '300px', zIndex: 20 }}>
          <Field
            name='sortBy'
            component={SelectBox}
            onChange={(e) => {
              if (e.includes('price')) {
                formActions.change('nftFilter', 'forSale', true)
              }
            }}
            // @ts-ignore
            elements={[
              {
                group: '',
                items: [
                  { text: 'Price: Low to High', value: `${AssetSortFields.Price}-ASC` },
                  { text: 'Price: High to Low', value: `${AssetSortFields.Price}-DESC` },
                  { text: 'Recently Listed', value: `${AssetSortFields.ListingDate}-DESC` }
                ]
              }
            ]}
          />
        </div>
      </div>
      <TraitGrid hasSomeFilters={hasSomeFilters}>
        {collectionFilter ? (
          <div style={{ height: '100%' }}>
            <ActiveTraitFilter>
              <Text size='14px' color='black' weight={500} capitalize>
                Collection: {collectionFilter}
              </Text>
              <div
                style={{
                  background: 'white',
                  borderRadius: '50%',
                  lineHeight: '0',
                  marginLeft: '8px'
                }}
              >
                <Icon label='close-circle' color='blue600'>
                  <IconCloseCircle
                    role='button'
                    cursor='pointer'
                    onClick={() => formActions.change('nftFilter', 'collection', undefined)}
                  />
                </Icon>
              </div>
            </ActiveTraitFilter>
          </div>
        ) : null}
        {minMaxFilters
          ? minMaxFilters.map((key) => {
              return (
                <div key={key} style={{ height: '100%' }}>
                  <ActiveTraitFilter>
                    <Text size='14px' color='black' weight={500} capitalize>
                      {key}: {formValues[key]} ETH
                    </Text>
                    <div
                      style={{
                        background: 'white',
                        borderRadius: '50%',
                        lineHeight: '0',
                        marginLeft: '8px'
                      }}
                    >
                      <Icon label='close' color='blue600'>
                        <IconCloseCircle
                          role='button'
                          cursor='pointer'
                          onClick={() => formActions.change('nftFilter', key, undefined)}
                        />
                      </Icon>
                    </div>
                  </ActiveTraitFilter>
                </div>
              )
            })
          : null}
        {traitFilters
          ? traitFilters.map((trait) => {
              return Object.keys(formValues[trait])
                .filter((val) => !!formValues[trait][val])
                .map((value) => {
                  return (
                    <div key={value} style={{ height: '100%' }}>
                      <ActiveTraitFilter>
                        <Text size='14px' color='black' weight={500} capitalize>
                          {trait}: {value}
                        </Text>
                        <div
                          style={{
                            background: 'white',
                            borderRadius: '50%',
                            lineHeight: '0',
                            marginLeft: '8px'
                          }}
                        >
                          <Icon label='close' color='blue600'>
                            <IconCloseCircle
                              role='button'
                              cursor='pointer'
                              onClick={() =>
                                formActions.change('nftFilter', `${trait}.${value}`, undefined)
                              }
                            />
                          </Icon>
                        </div>
                      </ActiveTraitFilter>
                    </div>
                  )
                })
            })
          : null}
      </TraitGrid>
    </>
  )
}

type Props = {
  collectionFilter?: string | null
  formActions: typeof actions.form
  formValues: NftFilterFormValuesType
  hasSomeFilters: boolean
  minMaxFilters: string[] | null
  traitFilters: string[] | null
}

export default TraitGridFilters
