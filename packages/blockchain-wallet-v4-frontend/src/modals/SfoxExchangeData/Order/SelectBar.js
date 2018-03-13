import styled from 'styled-components'

const SelectBar = styled.div`
  display: flex;
  opacity: ${props => props.selection ? 0.5 : 1};

  div {
    border-top: 1px solid ${props => props.theme['brand-primary']};
    border-left: 1px solid ${props => props.theme['brand-primary']};
    border-bottom: 1px solid ${props => props.theme['brand-primary']};
  }

  >:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  >:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-right: 1px solid ${props => props.theme['brand-primary']};
  }
`

export default SelectBar
