import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { colors, Icon, IconName } from '@blockchain-com/constellation'
import { reduxForm } from 'redux-form'
import styled from 'styled-components'

import { NftCollection } from '@core/network/api/nfts/types'
import { RemoteDataType } from '@core/types'
import { SpinningLoader, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div<{ isOpen: boolean }>`
  transition: all 0.3s ease;
  padding: 0 10px;
  width: ${(props) => (props.isOpen ? '300px' : '80px')};
  margin-right: 20px;
  ${media.tablet`
    display: none;
  `}
`
const IconWrapper = styled.div<{ isOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.isOpen ? 'flex-end' : 'center')};
`
const FilterHeader = styled.div`
  display: flex;
  padding-bottom: 8px;
  border-bottom: ${(props) => props.theme.grey000};
`
const FilterHeaderText = styled(Text)<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
`

const TraitList = styled.div`
  max-height: 200px;
  overflow: auto;
  border-bottom: 1px solid ${colors.grey100};
`

const NftFilter: React.FC<Props> = ({ collection }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper isOpen={isOpen}>
      <FilterHeader>
        <FilterHeaderText isOpen={isOpen} size='20px' weight={500} color='black'>
          <FormattedMessage defaultMessage='Filter' id='copy.filter' />
        </FilterHeaderText>
        <IconWrapper isOpen={isOpen}>
          {isOpen ? (
            <Icon
              cursor='pointer'
              name={IconName.CLOSE_CIRCLE_V2}
              color={colors.grey500}
              role='button'
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <Icon
              cursor='pointer'
              name={IconName.FILTER}
              color={colors.grey500}
              role='button'
              onClick={() => setIsOpen(true)}
            />
          )}
        </IconWrapper>
      </FilterHeader>
      {collection.cata({
        Failure: () => (
          <Text size='12px' weight={500}>
            Error: You must select a collection!
          </Text>
        ),
        Loading: () => (
          <Text size='12px' weight={500}>
            Error: You must select a collection!
          </Text>
        ),
        NotAsked: () => <SpinningLoader height='14px' width='14px' borderWidth='3px' />,
        Success: (val) => (
          <div style={{ display: isOpen ? 'block' : 'none' }}>
            <FormattedMessage id='copy.buy_now' defaultMessage='Buy Now' />
            {Object.keys(val.traits).map((trait) => {
              return (
                <div key={trait}>
                  <Text size='14px' weight={500} color='black'>
                    {trait}
                  </Text>
                  <TraitList>
                    {Object.keys(val.traits[trait])
                      .sort((a, b) => (val.traits[trait][a] < val.traits[trait][b] ? 1 : -1))
                      .map((value) => {
                        return (
                          <div
                            key={value}
                            style={{
                              alignItems: 'center',
                              display: 'flex',
                              marginBottom: '4px'
                            }}
                          >
                            <input
                              // onChange={() => handleTraitChange(trait, value)}
                              type='checkbox'
                              // checked={
                              //   props.collectionFilter.traits[trait] &&
                              //   props.collectionFilter.traits[trait][value]
                              // }
                              id={value}
                            />
                            <label
                              htmlFor={value}
                              style={{
                                alignItems: 'center',
                                display: 'flex',
                                whiteSpace: 'nowrap'
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
                              &nbsp;
                              <Text size='12px' weight={500} color='grey500'>
                                {val.traits[trait][value]}
                              </Text>
                              &nbsp;
                              <Text size='12px' weight={500} color='grey500'>
                                (
                                {(
                                  (Number(val.traits[trait][value]) /
                                    Number(val.stats.total_supply)) *
                                  100
                                ).toFixed(2)}
                                %)
                              </Text>
                            </label>
                          </div>
                        )
                      })}
                  </TraitList>
                </div>
              )
            })}
          </div>
        )
      })}
    </Wrapper>
  )
}

type Props = {
  collection: RemoteDataType<string, NftCollection>
}

export default reduxForm<{}, Props>({ form: 'nftFilter' })(NftFilter)
