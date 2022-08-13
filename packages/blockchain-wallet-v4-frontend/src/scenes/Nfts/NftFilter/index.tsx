import React, { useRef, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import {
  IconChevronDown,
  IconChevronUp,
  IconCloseCircleV2,
  IconFilter,
  PaletteColors,
  Switch
} from '@blockchain-com/constellation'
import Avatar from 'boring-avatars'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Icon as ComponentIcon, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import Form from 'components/Form/Form'
import NumberBox from 'components/Form/NumberBox'
import { actions } from 'data'
import { Analytics } from 'data/types'
import { CollectionsQuery, OwnerQuery } from 'generated/graphql.types'
import { FIXED_HEADER_HEIGHT } from 'layouts/Nfts/NftsHeader'
import { media } from 'services/styles'

import { AvatarGradientColors } from '../components'
import EventTypeName from '../components/EventTypeName'
import NftCollectionImageSmall from '../components/NftCollectionImageSmall'

export const FILTER_WIDTH = '300'
export const FILTER_WIDTH_CLOSED = '20'

const Wrapper = styled.div<{ hasBanner: boolean; isFilterOpen: boolean }>`
  top: ${(props) => (props.hasBanner ? `calc(151px)` : `calc(${FIXED_HEADER_HEIGHT}px)`)};
  position: sticky;
  padding: 0 24px 0 0;
  transition: width 0.3s ease, min-width 0.3s ease;
  width: ${(props) => (props.isFilterOpen ? `${FILTER_WIDTH}px` : `${FILTER_WIDTH_CLOSED}px`)};
  min-width: ${(props) => (props.isFilterOpen ? `${FILTER_WIDTH}px` : `${FILTER_WIDTH_CLOSED}px`)};
  margin-right: 20px;
  overflow: scroll;
  height: calc(100vh - ${FIXED_HEADER_HEIGHT + 20}px);
  border-right: 1px solid ${(props) => props.theme.grey000};
  background: ${(props) => props.theme.white};
  ${media.tablet`
    display: ${(props) => (props.isFilterOpen ? 'block' : 'none')};
    box-sizing: border-box;
    border-right: 0;
    z-index: 1000;
    height: 100vh;
    width: 100%;
    position: ${(props) => (props.hasBanner ? `sticky` : `initial`)};
    padding: 0 20px;
    top: ${FIXED_HEADER_HEIGHT}px;
    bottom: 0;
    left: 0;
    right: 0;
  `}
`
const IconWrapper = styled.div<{ isFilterOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.isFilterOpen ? 'flex-end' : 'center')};
`
const FilterHeader = styled.div<{ isFilterOpen: boolean }>`
  display: flex;
  padding-bottom: 16px;
  border-bottom: ${(props) => (props.isFilterOpen ? `1px solid ${props.theme.grey000}` : '')};
  margin: 24px 0;
`
const FilterHeaderText = styled(Text)<{ isFilterOpen: boolean }>`
  display: ${(props) => (props.isFilterOpen ? 'block' : 'none')};
`

const TraitWrapper = styled.div`
  margin-top: 8px;
  border-radius: 8px;
  border: 1px solid ${PaletteColors['grey-000']};
`

const TraitList = styled.div<{ isActive: boolean }>`
  transition: all 0.3s ease;
  max-height: ${(props) => (props.isActive ? '342px' : '0px')};
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

const IconBorder = styled.div`
  padding: 12px 16px;
  border: 1px solid ${PaletteColors['grey-100']};
  border-radius: 8px;
`

const NftFilter: React.FC<Props> = ({
  analyticsActions,
  collections,
  forSaleFilter,
  formActions,
  formValues,
  hasBanner = false,
  isFilterOpen,
  minMaxPriceFilter,
  opensea_event_types,
  setIsFilterOpen,
  total_supply,
  traits,
  verifiedFilter
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [activeTraits, setActiveTraits] = useState<string[]>([])
  const [collectionOpen, setCollectionOpen] = useState(false)
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
    <Wrapper ref={ref} isFilterOpen={isFilterOpen} hasBanner={hasBanner}>
      <FilterHeader isFilterOpen={isFilterOpen}>
        <FilterHeaderText isFilterOpen={isFilterOpen} size='20px' weight={500} color='black'>
          <FormattedMessage defaultMessage='Filter' id='copy.filter' />
        </FilterHeaderText>
        <IconWrapper isFilterOpen={isFilterOpen}>
          {isFilterOpen ? (
            <IconCloseCircleV2
              label='filter-control'
              color={PaletteColors['grey-500']}
              role='button'
              onClick={() => {
                setIsFilterOpen(false)
                analyticsActions.trackEvent({
                  key: Analytics.NFT_LEFT_MENU_CLOSED,
                  properties: {}
                })
              }}
            />
          ) : (
            <IconFilter
              label='filter-control'
              color={PaletteColors['grey-500']}
              role='button'
              onClick={() => {
                setIsFilterOpen(true)
                analyticsActions.trackEvent({
                  key: Analytics.NFT_LEFT_MENU_EXPANDED,
                  properties: {}
                })
              }}
            />
          )}
        </IconWrapper>
      </FilterHeader>
      <Form>
        <div style={{ display: isFilterOpen ? 'block' : 'none' }}>
          {forSaleFilter ? (
            <div>
              <TraitWrapper>
                <TraitHeader>
                  <Flex
                    style={{ width: '100%' }}
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Text size='16px' weight={500} color='black'>
                      <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
                    </Text>
                    <Switch
                      onClick={() =>
                        formActions.change('nftFilter', 'forSale', !formValues?.forSale)
                      }
                      checked={formValues?.forSale}
                    />
                  </Flex>
                </TraitHeader>
              </TraitWrapper>
            </div>
          ) : null}
          {verifiedFilter ? (
            <div>
              <TraitWrapper>
                <TraitHeader>
                  <Flex
                    style={{ width: '100%' }}
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <Text size='16px' weight={500} color='black'>
                      <FormattedMessage id='copy.verified_only' defaultMessage='Verified Only' />
                    </Text>
                    <Switch
                      onClick={() =>
                        formActions.change('nftFilter', 'verifiedOnly', !formValues?.verifiedOnly)
                      }
                      checked={formValues?.verifiedOnly}
                    />
                  </Flex>
                </TraitHeader>
              </TraitWrapper>
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
                <IconBorder>
                  <ComponentIcon size='24px' name='ETH' />
                </IconBorder>
              </div>
            </div>
          ) : null}
          {opensea_event_types?.length ? (
            <div style={{ marginTop: '24px' }}>
              <TraitWrapper>
                <TraitHeader>
                  <Text size='16px' weight={500} color='black'>
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
                          <Field
                            component='input'
                            name='event'
                            type='radio'
                            value={event}
                            id={event}
                          />
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
                <TraitHeader
                  onClick={() => {
                    setCollectionOpen(!collectionOpen)
                  }}
                >
                  <Text size='16px' weight={500} color='black'>
                    <FormattedMessage id='copy.collection' defaultMessage='Collection' />
                  </Text>
                  {collectionOpen ? (
                    <IconChevronUp label='control' color={PaletteColors['green-400']} />
                  ) : (
                    <IconChevronDown label='control' color={PaletteColors['green-400']} />
                  )}
                </TraitHeader>
                <TraitList isActive={collectionOpen}>
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
                              {collection.image_url ? (
                                <NftCollectionImageSmall
                                  isVerified={collection.safelist_request_status === 'verified'}
                                  alt='Dapp Logo'
                                  src={collection.image_url}
                                />
                              ) : (
                                <Avatar
                                  size={24}
                                  name={collection.slug || ''}
                                  variant='marble'
                                  colors={AvatarGradientColors}
                                />
                              )}

                              <Text
                                style={{
                                  marginLeft: '4px',
                                  maxWidth: '160px',
                                  overflow: 'hidden',
                                  paddingLeft: '8px',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                                size='12px'
                                weight={600}
                                color='black'
                                capitalize
                              >
                                {collection.name}
                              </Text>
                            </Flex>
                          </label>
                          <Field
                            component='input'
                            name='collection'
                            type='radio'
                            id={collection.slug}
                            value={collection.slug}
                          />
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
                      {isActive ? (
                        <IconChevronUp label='control' color={PaletteColors['grey-400']} />
                      ) : (
                        <IconChevronDown label='control' color={PaletteColors['grey-400']} />
                      )}
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
                                        ? `(${parseFloat(
                                            (
                                              (Number(organizedTraits[trait][value]) /
                                                Number(total_supply)) *
                                              100
                                            ).toFixed(2)
                                          )}%)`
                                        : null}
                                    </Text>
                                  </div>
                                </label>
                                <Field
                                  component='input'
                                  name={`${trait}.${value}`}
                                  type='checkbox'
                                  id={`${trait}.${value}`}
                                />
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
      verifiedOnly: boolean
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
  hasBanner?: boolean
  isFilterOpen: boolean
  minMaxPriceFilter: boolean
  opensea_event_types?: string[]
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>
  total_supply?: CollectionsQuery['collections'][0]['total_supply']
  traits?: CollectionsQuery['collections'][0]['traits']
  verifiedFilter?: boolean
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(NftFilter)
