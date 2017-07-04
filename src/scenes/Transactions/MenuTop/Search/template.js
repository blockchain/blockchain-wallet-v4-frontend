import React from 'react'
import styled from 'styled-components'

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const SearchBox = styled.div.attrs({
  type: 'text'
})`
  width: 100%;
`
const SearchIcon = styled.i.attrs({
  className: 'icon-search'
})`
  position: absolute;
  font-size: 24px;
  right: 30px;
`

const Search = (props) => {
  return (
    <SearchContainer>
      <SearchBox value={props.search} onChange={props.change} />
      <SearchIcon />
    </SearchContainer>
  )
}

export default Search
