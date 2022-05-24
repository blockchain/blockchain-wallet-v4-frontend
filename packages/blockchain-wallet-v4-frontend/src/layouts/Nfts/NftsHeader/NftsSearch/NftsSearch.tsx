import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import NftCollectionImageSmall from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/components/NftCollectionImageSmall'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Remote } from '@core'
import { ExplorerGatewaySearchType } from '@core/network/api/nfts/types'
import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import SelectBox from 'components/Form/SelectBox'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'
import { debounce } from 'utils/helpers'

const Wrapper = styled.div`
  width: 100%;
  .bc__group-heading {
    margin: 4px 0px 8px 0px;
    padding-left: 0;
    display: block;
    text-transform: capitalize;
  }
  ${media.tablet`
    width: 200px;
  `}
`

const NftsSearch: React.FC<Props> = ({ nftActions, nftSearch, routerActions }) => {
  const [input, setInput] = useState('')

  const handleInputChange = (e: any) => {
    setInput(e)
  }

  useEffect(() => {
    if (input) {
      nftActions.nftSearch({ search: input })
    }
  }, [input, nftActions])

  const handleSelect = (
    item:
      | ExplorerGatewaySearchType['accounts'][0]
      | ExplorerGatewaySearchType['assets'][0]
      | ExplorerGatewaySearchType['collections'][0]
      | ExplorerGatewaySearchType['contracts'][0]
  ) => {
    if ('profile_img_url' in item) {
      routerActions.push(`/nfts/address/${item.address}`)
    } else if ('contract_address' in item) {
      routerActions.push(`/nfts/assets/${item.contract_address}/${item.token_id}`)
    } else if ('num_owners' in item) {
      routerActions.push(`/nfts/collection/${item.slug}`)
    } else if ('asset_contract_type' in item) {
      routerActions.push(`/nfts/collection/${item.address}`)
    }
  }

  const elements = Object.keys(nftSearch.getOrElse({} as ExplorerGatewaySearchType))
    .sort((a, b) => (a === 'collections' || b === 'collections' ? -1 : 1))
    .map((key) => {
      return {
        label: key,
        options: nftSearch
          .getOrElse({} as ExplorerGatewaySearchType)
          [key].map((item) => ({
            label: (
              <Flex alignItems='center' gap={8}>
                {item.image_url || item.profile_img_url ? (
                  <NftCollectionImageSmall
                    isVerified={item.safelist_request_status === 'verified'}
                    alt='url'
                    src={item.image_url || item.profile_img_url}
                  />
                ) : null}
                <Text weight={600} size='14px'>
                  {item.name || item.address}
                </Text>
              </Flex>
            ),
            value: item
          }))
          .slice(0, 5)
      }
    })
    .filter((group) => group.options.length > 0)

  return (
    <Wrapper>
      <Field
        component={SelectBox}
        // @ts-ignore
        elements={elements}
        grouped
        hideIndicator
        hideValue
        name='search'
        label='Collections or items'
        cursor='initial'
        filterOption={() => true}
        onChange={(e) => handleSelect(e)}
        onInputChange={debounce((e) => handleInputChange(e), 500)}
        noOptionsMessage={() => null}
        isLoading={Remote.Loading.is(nftSearch)}
        placeholder='Collections or items'
      />
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues('nftSearch')(state),
  nftSearch: selectors.components.nfts.getNftSearch(state)
})

const mapDispatchToProps = (dispatch) => ({
  nftActions: bindActionCreators(actions.components.nfts, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(NftsSearch)
