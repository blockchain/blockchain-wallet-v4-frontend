import styled from 'styled-components'

const ButtonGroup = styled.div`
  a {
    color: white !important;
    transition: opacity 0.5s;
    font-weight: 500;
    padding: 0 1rem !important;
    font-size: 1.125rem;
    margin-right: 1rem;
    user-select: none;
    cursor: pointer;
    line-height: 2.5rem;
    display: inline-block;
  }

  a:last-child {
    margin-right: 0;
  }

  ul > li {
    padding: 0px 0.5rem;
    display: inline-block;
    margin-right: 1rem;
  }

  button {
    margin-right: 1rem;
  }
  button:last-child {
    margin-right: 0;
  }
`

export default ButtonGroup
