import React from 'react'
import styled from 'styled-components'

import { Icon } from 'blockchain-components'

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
  color: #555555;
  background-color: #FFFFFF;
  background-image: none;
  outline-width: 0;
  user-select: text;
  border: 1px solid #CCCCCC;
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
      <SearchIcon name='icon-search' big />
    </SearchContainer>
  )
}

export default Search
