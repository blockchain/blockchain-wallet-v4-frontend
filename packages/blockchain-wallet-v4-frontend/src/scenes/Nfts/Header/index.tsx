import React, { useState } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import { Form, SelectBox, TextBox } from 'components/Form'
import { debounce } from 'utils/helpers'

import { Props as OwnProps } from '..'

const Wrapper = styled.div`
  width: 100%;
  z-index: 3;
  padding-bottom: 8px;
  background: ${(props) => props.theme.white};
  position: sticky;
  top: 0;
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
  align-items: center;
  position: relative;
  gap: 8px;
  > div {
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

const NftHeader: React.FC<InjectedFormProps<{}, Props> & Props> = ({
  activeTab,
  nftsActions,
  setActiveTab,
  ...rest
}) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleChange = (e) => {
    rest.formActions.change('nftMarketplace', 'collection', e)
    setShowDropdown(false)
  }

  return (
    <Wrapper>
      <TabsContainer>
        <TabMenu>
          <TabMenuItem onClick={() => setActiveTab('explore')} selected={activeTab === 'explore'}>
            Explore
          </TabMenuItem>
          <TabMenuItem
            onClick={() => setActiveTab('my-collection')}
            selected={activeTab === 'my-collection'}
          >
            My Collection
          </TabMenuItem>
          <TabMenuItem onClick={() => setActiveTab('offers')} selected={activeTab === 'offers'}>
            Offers
          </TabMenuItem>
        </TabMenu>
      </TabsContainer>
      <StyledForm>
        <Field
          placeholder='Search Collections'
          name='search'
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
          onChange={debounce((_, val) => {
            setShowDropdown(true)
            nftsActions.searchNftAssetContract({ asset_contract_address: val })
          }, 500)}
          component={TextBox}
        />
        <CollectionsContainer>
          {rest.collectionSearch.length && showDropdown ? (
            <Field
              name='collections'
              component={SelectBox}
              searchEnabled={false}
              hideIndicator
              hideFocusedControl
              menuIsOpen
              onChange={handleChange}
              templateItem={(props: { img: string; text: string; value: string }) => {
                const nft = rest.collectionSearch.find((nft) => nft.slug === props.value)
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
                  items: rest.collectionSearch.map((item) => ({
                    img: item.image_url,
                    text: item.name,
                    value: item.slug
                  }))
                }
              ]}
            />
          ) : null}
        </CollectionsContainer>
      </StyledForm>
    </Wrapper>
  )
}

type Props = OwnProps & {
  activeTab: 'explore' | 'my-collection' | 'offers'
  setActiveTab: (tab: 'explore' | 'my-collection' | 'offers') => void
}

export default reduxForm<{}, Props>({ form: 'nftSearch' })(NftHeader)
