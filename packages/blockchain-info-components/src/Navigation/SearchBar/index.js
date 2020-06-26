import React from 'react'
import styled from 'styled-components'

const TextField = styled.input`
  background: rgba(255, 255, 255, 0.05)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 41.38 42.38'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23ffffff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3EAsset 2%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='surface1'%3E%3Cpath class='cls-1' d='M19.18.13a17,17,0,1,0,6.92,31.21L36.25,41.5a3,3,0,0,0,4.25,0h0a3,3,0,0,0,0-4.25l-10-10a16.88,16.88,0,0,0,3.37-12.36A17,17,0,0,0,19.18.13ZM17,4A13,13,0,1,1,4,17,13,13,0,0,1,17,4Z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    no-repeat 10px center;
  background-size: 14px;
  border: 1px solid ${props => props.theme.white};
  border-radius: 16px;
  color: ${props => props.theme.white};
  font-size: 14px;
  font-weight: 400;
  height: 32px;
  line-height: 14px;
  padding: 0 10px 2px 32px;
  position: relative;
  width: 260px;

  &:focus {
    background: ${props => props.theme.white}
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 41.38 42.38'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23979797;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3EAsset 2%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='surface1'%3E%3Cpath class='cls-1' d='M19.18.13a17,17,0,1,0,6.92,31.21L36.25,41.5a3,3,0,0,0,4.25,0h0a3,3,0,0,0,0-4.25l-10-10a16.88,16.88,0,0,0,3.37-12.36A17,17,0,0,0,19.18.13ZM17,4A13,13,0,1,1,4,17,13,13,0,0,1,17,4Z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      no-repeat 10px center;
    background-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #454545;
    outline: none;
    padding: 0 10px 0 32px;
  }

  &::placeholder {
    /* Chrome 57, Firefox 51, Opera 44, Safari 10.1 */
    color: ${props => props.theme.white};
    font-size: 11px;
    font-weight: 400;
    line-height: 30px;
    text-transform: uppercase;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  &::-webkit-input-placeholder {
    /* Safari */
    line-height: 20px;
  }

  &::-moz-placeholder {
    /* Firefox < 51 */
    line-height: 30px;
    opacity: 1;
  }

  &:-ms-input-placeholder {
    /* IE 10, 11 */
    color: ${props => props.theme.white};
    font-size: 11px;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
  }

  &::-ms-input-placeholder {
    /* MS EDGE */
    color: ${props => props.theme.white};
    font-size: 11px;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
  }

  @media screen and (max-width: 1024px) {
    background: ${props => props.theme.white}
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 41.38 42.38'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23979797;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3EAsset 2%3C/title%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cg id='surface1'%3E%3Cpath class='cls-1' d='M19.18.13a17,17,0,1,0,6.92,31.21L36.25,41.5a3,3,0,0,0,4.25,0h0a3,3,0,0,0,0-4.25l-10-10a16.88,16.88,0,0,0,3.37-12.36A17,17,0,0,0,19.18.13ZM17,4A13,13,0,1,1,4,17,13,13,0,0,1,17,4Z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
      no-repeat 12px center;
    background-size: 16px;
    border: none;
    border-radius: 20px;
    color: #454545;
    height: 40px;
    line-height: 14px;
    opacity: 0;
    padding: 0 10px 0 36px;
    width: inherit;

    &::placeholder {
      color: #979797;
      font-size: 14px;
      line-height: 18px;
    }

    &::-moz-placeholder {
      line-height: 40px;
    }

    &::-webkit-input-placeholder {
      color: #979797;
      font-size: 14px;
      line-height: 18px;
    }
  }
`

const SearchBar = props => {
  return (
    <TextField
      name='search'
      placeholder='block, hash, transaction, etc...'
      type='text'
    />
  )
}

export default SearchBar
