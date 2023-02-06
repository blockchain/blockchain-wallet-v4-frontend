import React from 'react'
import { useIntl } from 'react-intl'
import { IconSearch, Input, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const TextFilterWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  margin: 16px 0;

  > div:first-child {
    width: 100%;
  }
`

export const SearchIconWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
`

export const SearchField = ({ onChange }: { onChange: (value: string) => void }) => {
  const { formatMessage } = useIntl()

  return (
    <TextFilterWrapper>
      <Input
        id='dexCoinSearch'
        state='default'
        type='text'
        onChange={(event) => onChange((event.target as HTMLInputElement).value)}
        placeholder={formatMessage({
          defaultMessage: 'Search Symbol or Address',
          id: 'dex.searCoin.placeholder'
        })}
      />
      <SearchIconWrapper>
        <IconSearch label='close' size='medium' color={PaletteColors['grey-400']} />
      </SearchIconWrapper>
    </TextFilterWrapper>
  )
}
