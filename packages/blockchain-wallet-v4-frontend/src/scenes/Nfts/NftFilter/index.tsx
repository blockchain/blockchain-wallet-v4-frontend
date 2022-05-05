import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { colors, Icon } from '@blockchain-com/constellation'
import {
  IconChevronDown,
  IconChevronUp,
  IconCloseCircleV2,
  IconFilter
} from '@blockchain-com/icons'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon as ComponentIcon, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Form from 'components/Form/Form'
import NumberBox from 'components/Form/NumberBox'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { CollectionsQuery, OwnerQuery } from 'generated/graphql.types'
import { FIXED_HEADER_HEIGHT } from 'layouts/Nfts/NftsHeader'
import { media } from 'services/styles'

import { CollectionImageSmall } from '../components'
import EventTypeName from '../components/EventTypeName'

const Wrapper = styled.div<{ isOpen: boolean }>`
  top: calc(${FIXED_HEADER_HEIGHT + 20}px);
  position: sticky;
  transition: width 0.3s ease;
  width: ${(props) => (props.isOpen ? '300px' : '20px')};
  min-width: ${(props) => (props.isOpen ? '300px' : '20px')};
  margin-right: 20px;
  overflow: scroll;
  height: calc(100vh - ${FIXED_HEADER_HEIGHT + 20}px);
  ${media.tablet`
    display: none;
  `}
`
const IconWrapper = styled.div<{ isOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.isOpen ? 'flex-end' : 'center')};
`
const FilterHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  padding-bottom: 16px;
  border-bottom: ${(props) => (props.isOpen ? `1px solid ${props.theme.grey000}` : '')};
  margin-bottom: 24px;
`
const FilterHeaderText = styled(Text)<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`

const TraitWrapper = styled.div`
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid ${colors.grey100};
`

const TraitList = styled.div<{ isActive: boolean }>`
  transition: all 0.3s ease;
  max-height: ${(props) => (props.isActive ? '200px' : '0px')};
  overflow: auto;
`

const TraitHeader = styled.div`
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`

const TraitItem = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.grey000};
  box-sizing: border-box;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:first-child {
    border-top: 1px solid ${(props) => props.theme.grey000};
  }
  &:last-child {
    border-bottom: 0;
  }
`

const NftFilter: React.FC<Props> = ({
  analyticsActions,
  collections,
  forSaleFilter,
  formActions,
  formValues,
  minMaxPriceFilter,
  opensea_event_types,
  total_supply,
  traits
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [activeTraits, setActiveTraits] = useState<string[]>([])

  if (!traits) return null

  const organizedTraits = traits.reduce(
    (acc, curr) => {
      if (curr && curr?.trait_type && curr?.value && curr.count) {
        return {
          ...acc,
          [curr.trait_type]: {
            ...acc[curr.trait_type],
            [curr.value]: curr.count
          }
        }
      }

      return acc
    },
    {} as {
      [key: string]: {
        [key: string]: number
      }
    }
  )

  return (
    <Wrapper ref={ref} isOpen={isOpen}>
      <FilterHeader isOpen={isOpen}>
        <FilterHeaderText isOpen={isOpen} size='20px' weight={500} color='black'>
          <FormattedMessage defaultMessage='Filter' id='copy.filter' />
        </FilterHeaderText>
        <IconWrapper isOpen={isOpen}>
          {isOpen ? (
            <Icon label='filter-control' color='grey500'>
              <IconCloseCircleV2
                role='button'
                onClick={() => {
                  setIsOpen(false)
                  analyticsActions.trackEvent({
                    key: Analytics.NFT_LEFT_MENU_CLOSED,
                    properties: {}
                  })
                }}
                cursor='pointer'
              />
            </Icon>
          ) : (
            <Icon label='filter-control' color='grey500'>
              <IconFilter
                role='button'
                onClick={() => {
                  setIsOpen(true)
                  analyticsActions.trackEvent({
                    key: Analytics.NFT_LEFT_MENU_EXPANDED,
                    properties: {}
                  })
                }}
                cursor='pointer'
              />
            </Icon>
          )}
        </IconWrapper>
      </FilterHeader>
      <Form>
        <div style={{ display: isOpen ? 'block' : 'none' }}>
          {forSaleFilter ? (
            <div>
              <Button
                onClick={() => formActions.change('nftFilter', 'forSale', !formValues?.forSale)}
                nature={formValues?.forSale ? 'primary' : 'empty-blue'}
                data-e2e='buyNowToggle'
              >
                <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
              </Button>
            </div>
          ) : null}
          {minMaxPriceFilter ? (
            <div style={{ marginTop: '24px' }}>
              <Text style={{ marginBottom: '8px' }} size='14px' weight={600} color='black'>
                <FormattedMessage id='copy.price' defaultMessage='Price' />
              </Text>
              <div style={{ alignItems: 'center', display: 'flex', gap: '12px' }}>
                <Field name='min' component={NumberBox} placeholder='Min' />
                <Field name='max' component={NumberBox} placeholder='Max' />
                <ComponentIcon size='18px' name='ETH' />
              </div>
            </div>
          ) : null}
          {opensea_event_types?.length ? (
            <div style={{ marginTop: '24px' }}>
              <TraitWrapper>
                <TraitHeader>
                  <Text size='14px' weight={500} color='black'>
                    <FormattedMessage id='copy.events' defaultMessage='Events' />
                  </Text>
                </TraitHeader>
                <TraitList isActive>
                  {opensea_event_types.map((event) => {
                    return (
                      <TraitItem key={event}>
                        <div
                          style={{
                            alignItems: 'center',
                            display: 'flex',
                            overflow: 'hidden',
                            width: '100%'
                          }}
                        >
                          <Field
                            component='input'
                            name='event'
                            type='radio'
                            value={event}
                            id={event}
                          />
                          <label
                            htmlFor={event}
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              justifyContent: 'space-between',
                              whiteSpace: 'nowrap',
                              width: '100%'
                            }}
                          >
                            <Text
                              style={{ marginLeft: '4px' }}
                              size='12px'
                              weight={600}
                              color='black'
                              capitalize
                            >
                              {/* @ts-ignore */}
                              <EventTypeName event_type={event} />
                            </Text>
                          </label>
                        </div>
                      </TraitItem>
                    )
                  })}
                </TraitList>
              </TraitWrapper>
            </div>
          ) : null}
          {collections?.length ? (
            <div style={{ marginTop: '24px' }}>
              <TraitWrapper>
                <TraitHeader>
                  <Text size='14px' weight={500} color='black'>
                    <FormattedMessage id='copy.collections' defaultMessage='Collections' />
                  </Text>
                </TraitHeader>
                <TraitList isActive>
                  {collections.map((collection) => {
                    return (
                      <TraitItem key={collection.name}>
                        <div
                          style={{
                            alignItems: 'center',
                            display: 'flex',
                            overflow: 'hidden',
                            width: '100%'
                          }}
                        >
                          <Field
                            component='input'
                            name='collection'
                            type='radio'
                            id={collection.slug}
                            value={collection.slug}
                          />
                          <label
                            htmlFor={collection.slug}
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              justifyContent: 'space-between',
                              whiteSpace: 'nowrap',
                              width: '100%'
                            }}
                          >
                            <Flex alignItems='center' gap={4}>
                              <div />
                              <CollectionImageSmall src={collection.image_url || ''} />
                              <Text
                                style={{ marginLeft: '4px' }}
                                size='12px'
                                weight={600}
                                color='black'
                                capitalize
                              >
                                {collection.name}
                              </Text>
                            </Flex>
                          </label>
                        </div>
                      </TraitItem>
                    )
                  })}
                </TraitList>
              </TraitWrapper>
            </div>
          ) : null}
          {Object.keys(organizedTraits).length ? (
            <div style={{ marginTop: '24px' }}>
              <Text size='14px' weight={600} color='black'>
                <FormattedMessage id='copy.attributes' defaultMessage='Attributes' />
              </Text>
              {Object.keys(organizedTraits).map((trait) => {
                const isActive = activeTraits.indexOf(trait) > -1

                return (
                  <TraitWrapper key={trait}>
                    <TraitHeader
                      role='button'
                      onClick={() => {
                        if (activeTraits.indexOf(trait) === -1) {
                          setActiveTraits([...activeTraits, trait])
                        } else {
                          setActiveTraits(activeTraits.filter((t) => t !== trait))
                        }
                      }}
                    >
                      <Text size='14px' weight={500} color='black'>
                        {trait}
                      </Text>
                      <Icon label='control' color='grey400'>
                        {isActive ? <IconChevronUp /> : <IconChevronDown />}
                      </Icon>
                    </TraitHeader>
                    <TraitList isActive={isActive}>
                      {Object.keys(organizedTraits[trait])
                        .sort((a, b) =>
                          organizedTraits[trait][a] < organizedTraits[trait][b] ? 1 : -1
                        )
                        .map((value) => {
                          return (
                            <TraitItem key={value}>
                              <div
                                style={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  overflow: 'hidden',
                                  width: '100%'
                                }}
                              >
                                <Field
                                  component='input'
                                  name={`${trait}.${value}`}
                                  type='checkbox'
                                  id={`${trait}.${value}`}
                                />
                                <label
                                  htmlFor={`${trait}.${value}`}
                                  style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    whiteSpace: 'nowrap',
                                    width: '100%'
                                  }}
                                >
                                  <Text
                                    style={{ marginLeft: '4px' }}
                                    size='12px'
                                    weight={600}
                                    color='black'
                                    capitalize
                                  >
                                    {value}
                                  </Text>
                                  <div style={{ alignItems: 'center', display: 'flex' }}>
                                    <Text size='12px' weight={500} color='grey500'>
                                      {organizedTraits[trait][value]}
                                    </Text>
                                    &nbsp;
                                    <Text size='12px' weight={500} color='grey500'>
                                      {total_supply
                                        ? `(${(
                                            (Number(organizedTraits[trait][value]) /
                                              Number(total_supply)) *
                                            100
                                          ).toFixed(2)}%)`
                                        : null}
                                    </Text>
                                  </div>
                                </label>
                              </div>
                            </TraitItem>
                          )
                        })}
                    </TraitList>
                  </TraitWrapper>
                )
              })}
            </div>
          ) : null}
        </div>
      </Form>
    </Wrapper>
  )
}

export type NftFilterFormValuesType =
  | ({
      collection: string
      event: string
      forSale: boolean
      max: string
      min: string
      sortBy: string
    } & {
      [key: string]: {
        [key: string]: boolean
      }
    })
  | undefined

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})
const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  collections?: OwnerQuery['assets'][0]['collection'][]
  forSaleFilter: boolean
  formActions: typeof actions.form
  formValues: NftFilterFormValuesType
  minMaxPriceFilter: boolean
  opensea_event_types?: string[]
  total_supply?: CollectionsQuery['collections'][0]['total_supply']
  traits?: CollectionsQuery['collections'][0]['traits']
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NftFilter)
