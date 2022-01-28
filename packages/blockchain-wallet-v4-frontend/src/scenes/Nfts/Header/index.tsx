import React, { useState } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Icon, Link, TabMenu, TabMenuItem, Text } from 'blockchain-info-components'
import { Form, SelectBox, TextBox } from 'components/Form'
import { debounce } from 'utils/helpers'

import { Props as OwnProps } from '..'

const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  border-color: rgb(242, 153, 74);
  background: rgb(239 166 101);
  height: 3em;
  border-radius: 8px;
`
const Wrapper = styled.div`
  display: inline-block;
  width: 100%;
`
const InnerContainer = styled.div`
  z-index: 3;
  padding: 8px 0px 8px 0px;
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

  const handleSubmit = (e) => {
    e.preventDefault()
    nftsActions.searchNftAssetContract({ asset_contract_address: e.target[0].value })
  }

  return (
    <Wrapper>
      <ItemWrapper>
        <Icon name='alert' color='white' size='24px' />
        <Text
          style={{
            fontFamily: 'Inter',
            marginBottom: '1px',
            marginLeft: '12px'
          }}
          color='white'
          size='16px'
          weight={600}
        >
          OpenSea is experiencing technical difficulties...
          <Link
            style={{
              color: 'inherit',
              fontFamily: 'Inter',
              marginBottom: '1px',
              marginLeft: '3px',
              textDecoration: 'underline'
            }}
            weight={400}
            size='16px'
            target='_blank'
            href='https://status.opensea.io/'
          >
            status.opensea.io
          </Link>
        </Text>
      </ItemWrapper>
      <InnerContainer>
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
        <StyledForm onSubmit={handleSubmit}>
          <Field
            placeholder='Search Collections'
            name='search'
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setShowDropdown(false)}
            onChange={debounce((_, val) => {
              setShowDropdown(true)
              nftsActions.searchNftAssetContract({ search: val })
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
      </InnerContainer>
    </Wrapper>
  )
}

type Props = OwnProps & {
  activeTab: 'explore' | 'my-collection' | 'offers'
  setActiveTab: (tab: 'explore' | 'my-collection' | 'offers') => void
}

export default reduxForm<{}, Props>({ form: 'nftSearch' })(NftHeader)
