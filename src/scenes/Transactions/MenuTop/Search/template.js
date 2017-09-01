import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`
const SearchBox = styled.input.attrs({
  type: 'text'
})`
  display: block;
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding: 6px 12px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.42;
  color: ${props => props.theme['text']};
  background-color: ${props => props.theme['white']};
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: 1px solid ${props => props.theme['bordergrey']};
`
const SearchIcon = styled(Icon)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const Search = (props) => {
  const { value, handleChange } = props
  return (
    <SearchContainer>
      <SearchBox value={value} onChange={handleChange} />
      <SearchIcon name='search' />
    </SearchContainer>
  )
}

export default Search
