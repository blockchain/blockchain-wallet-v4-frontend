import styled from 'styled-components'

const ButtonGroup = styled.div`
  margin: 0 5px;
  & > * {
    display: inline-block;
  }
  & :first-child { 
    border-top-right-radius: initial!important;
    border-bottom-right-radius: initial!important;
  }
  & :last-child { 
    border-top-left-radius: initial!important;
    border-bottom-left-radius: initial!important;
  }
`
export default ButtonGroup
