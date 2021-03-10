import React, { Component } from 'react'
import styled from 'styled-components'

const Button = styled.button`
  display: none;
  @media screen and (max-width: 1024px) {
    background: none;
    border: none;
    display: block;
    float: right;
    height: 20px;
    margin-right: 25px;
    position: relative;
    width: 20px;

    &:after {
      color: ${props => props.theme.white};
      content: '\e92d';
      font-family: 'icomoon', sans-serif;
      font-size: 17px;
      font-style: normal;
      font-variant: normal;
      font-weight: normal;
      left: 2px;
      position: absolute;
      speak: none;
      text-transform: none;
      top: 0px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
`

class SearchButton extends Component {
  render() {
    return <Button />
  }
}

export default SearchButton
