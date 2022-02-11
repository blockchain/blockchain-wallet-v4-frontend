import React, { useState } from 'react'
import { map } from 'ramda'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import { Form, SelectBox, TextBox } from 'components/Form'
import { debounce } from 'utils/helpers'

import { Props as OwnProps } from '..'
import { maxWidth } from '../components'
import OpenSeaStatusComponent from '../components/openSeaStatus'

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  display: inline-block;
  width: 100%;
  z-index: 3;
  margin-bottom: 16px;
  background: ${(props) => props.theme.white};
  border-bottom: 1px solid ${(props) => props.theme.grey000};
`
const InnerContainer = styled.div`
  max-width: ${maxWidth};
  padding: 8px 0px 8px 0px;
  background: ${(props) => props.theme.white};
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  gap: 24px;
`

const TabsContainer = styled.div`
  display: inline-block;
`

const StyledForm = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  gap: 8px;
  > div {
    min-width: 200px;
    max-width: 400px;
  }
`

const CollectionsContainer = styled.div`
  position: absolute;
  width: 100%;
  border-radius: 8px;
  top: 48px;
  left: 0;
`

const NftHeader: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const handleChange = (e) => {
    props.formActions.change('nftMarketplace', 'collection', e)
    setShowDropdown(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    props.nftsActions.searchNftAssetContract({ asset_contract_address: e.target[0].value })
  }

  return (
    <Wrapper>
      <OpenSeaStatusComponent {...props} />
      <InnerContainer>
        <TabsContainer>
          <TabMenu>
            <TabMenuItem
              onClick={() => props.setActiveTab('explore')}
              selected={props.activeTab === 'explore'}
            >
              Explore
            </TabMenuItem>
            <TabMenuItem
              onClick={() => props.setActiveTab('my-collection')}
              selected={props.activeTab === 'my-collection'}
            >
              My Collection
            </TabMenuItem>
            <TabMenuItem
              onClick={() => props.setActiveTab('offers')}
              selected={props.activeTab === 'offers'}
            >
              Offers
            </TabMenuItem>
          </TabMenu>
        </TabsContainer>
        <StyledForm onSubmit={handleSubmit}>
          <Field
            placeholder='Search Collections'
            name='search'
            height='45px'
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setShowDropdown(false)}
            onChange={debounce((_, val) => {
              setShowDropdown(true)
              props.nftsActions.searchNftAssetContract({ search: val })
            }, 500)}
            component={TextBox}
          />
          <CollectionsContainer>
            {props.collectionSearch.length && showDropdown ? (
              <Field
                name='collections'
                component={SelectBox}
                searchEnabled={false}
                hideIndicator
                hideFocusedControl
                menuIsOpen
                onChange={handleChange}
                templateItem={(templateProps: { img: string; text: string; value: string }) => {
                  const nft = props.collectionSearch.find((nft) => nft.slug === templateProps.value)
                  if (!nft) return null
                  return (
                    <div style={{ alignItems: 'center', display: 'flex' }}>
                      <img
                        style={{ borderRadius: '4px' }}
                        height='24px'
                        width='24px'
                        alt='hello'
                        src={nft.image_url}
                      />
                      <div style={{ marginLeft: '8px' }}>{nft.name}</div>
                    </div>
                  )
                }}
                elements={[
                  {
                    group: '',
                    items: props.collectionSearch.map((item) => ({
                      img: item.image_url,
                      text: item.name,
                      value: item.slug
                    }))
                  }
                ]}
              />
            ) : null}
          </CollectionsContainer>
          <div>
            <Field
              name='sortBy'
              height='45px'
              component={SelectBox}
              elements={[
                {
                  group: '',
                  items: map(
                    (item) => ({
                      text: item.text,
                      value: item.value
                    }),
                    [
                      { text: 'Volume: High to Low', value: 'one_day_vol-DESC' },
                      { text: 'Volume: Low to High', value: 'one_day_vol-ASC' },
                      { text: 'Floor Price: High to Low', value: 'floor_price-DESC' },
                      { text: 'Floor Price: Low to High', value: 'floor_price-ASC' },
                      { text: 'Avg. Price: High to Low', value: 'average_price-DESC' },
                      { text: 'Avg. Price: Low to High', value: 'average_price-ASC' }
                    ]
                  )
                }
              ]}
            />
          </div>
        </StyledForm>
      </InnerContainer>
    </Wrapper>
  )
}

type Props = OwnProps & {
  activeTab: 'explore' | 'my-collection' | 'offers'
  setActiveTab: (tab: 'explore' | 'my-collection' | 'offers') => void
}

export default reduxForm<{}, Props>({
  form: 'nftSearch',
  initialValues: { sortBy: 'one_day_vol-DESC' }
})(NftHeader)
