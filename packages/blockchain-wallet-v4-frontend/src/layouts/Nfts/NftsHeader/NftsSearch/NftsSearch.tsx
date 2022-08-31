import React, { useCallback, useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { InputActionMeta } from 'react-select'
import { IconCloseCircleV2, IconSearch, PaletteColors } from '@blockchain-com/constellation'
import NftCollectionImageSmall from 'blockchain-wallet-v4-frontend/src/scenes/Nfts/components/NftCollectionImageSmall'
import Avatar from 'boring-avatars'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { Remote } from '@core'
import { ExplorerGatewaySearchType } from '@core/network/api/nfts/types'
import { Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import SelectBox from 'components/Form/SelectBox'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media, useMedia } from 'services/styles'
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
    width: auto;
    &.isActive {
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      position: fixed;
      overflow: scroll;
      background: ${(props) => props.theme.white};
    }
  `}
`

const MobileMenu = styled(Flex)`
  padding: 12px;
  background: ${(props) => props.theme.white};
  z-index: 100;
  position: sticky;
  top: 0;
`

const InputResultWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.grey000};
  padding: 12px;
  ${media.tablet`
    .bc__menu {
      box-shadow: none;
    }
    .bc__menu-list {
      margin: 0;
      max-height: 100%;
    }
    .bc__group-heading {
      font-size: 14px;
    }
    .bc__option {
      overflow: hidden;
      padding: 16px 8px;
      border-top: 1px solid ${(props) => props.theme.grey000};
    }
  `}
`

const IconWrapper = styled.div`
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey100};
`

const NftsSearch: React.FC<Props> = ({ nftActions, nftSearch, routerActions }) => {
  const [input, setInput] = useState('')
  const isTablet = useMedia('tablet')
  const [isActive, setIsActive] = useState(false)

  const handleInputChange = (value: string, actionMeta: InputActionMeta) => {
    if (actionMeta.action === 'input-change') {
      setInput(value)
    }
  }

  const handleClose = () => {
    setIsActive(false)
  }

  const handleOpen = () => {
    setIsActive(true)
  }

  const search = useCallback(
    debounce((input) => nftActions.nftSearch({ search: input }), 500),
    []
  )

  useEffect(() => {
    if (input) {
      search(input)
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

    setIsActive(false)
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
                ) : (
                  <Avatar
                    size={24}
                    name={item.slug || ''}
                    variant='marble'
                    colors={[
                      PaletteColors['blue-600'],
                      PaletteColors['purple-600'],
                      PaletteColors['purple-300'],
                      PaletteColors['green-300'],
                      PaletteColors['grey-900']
                    ]}
                  />
                )}
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
    <Wrapper className={isActive ? 'isActive' : ''}>
      {isTablet && isActive ? (
        <MobileMenu justifyContent='space-between'>
          <Image width='25px' name='blockchain-icon' />
          <div role='button' aria-hidden='true' onClick={handleClose}>
            <IconCloseCircleV2 label='close' />
          </div>
        </MobileMenu>
      ) : null}
      {!isTablet || (isTablet && isActive) ? (
        <InputResultWrapper>
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
            inputValue={input}
            onInputChange={(value: string, actionMeta: InputActionMeta) =>
              handleInputChange(value, actionMeta)
            }
            noOptionsMessage={() => null}
            isLoading={Remote.Loading.is(nftSearch)}
            placeholder='Collections or items'
          />
        </InputResultWrapper>
      ) : null}
      {isTablet && !isActive ? (
        <IconWrapper role='button' onClick={handleOpen}>
          <IconSearch color={PaletteColors['purple-600']} label='search' size='small' />
        </IconWrapper>
      ) : null}
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
