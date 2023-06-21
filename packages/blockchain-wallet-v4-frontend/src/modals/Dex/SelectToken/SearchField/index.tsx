import React from 'react'
import { useIntl } from 'react-intl'
import { IconSearch, Input, PaletteColors } from '@blockchain-com/constellation'

import { SearchIconWrapper, TextFilterWrapper } from './styles'
import { SearchFieldProps } from './types'

const SearchField = ({ onChange }: SearchFieldProps) => {
  const { formatMessage } = useIntl()

  return (
    <TextFilterWrapper>
      <Input
        id='dexCoinSearch'
        state='default'
        type='text'
        onChange={(event) => onChange((event.target as HTMLInputElement).value)}
        placeholder={formatMessage({
          defaultMessage: 'Search Token Symbol or Name',
          id: 'dex.searchCoin.placeholder'
        })}
      />
      <SearchIconWrapper>
        <IconSearch label='close' size='medium' color={PaletteColors['grey-400']} />
      </SearchIconWrapper>
    </TextFilterWrapper>
  )
}

export default SearchField
