import styled from 'styled-components'

const SelectBar = styled.div`
  display: flex;
  opacity: ${props => props.selection ? 0.5 : 1};
  height: ${props => props.selection ? 25 : 35}px;
  transition: ${props => `opacity ${props.timing}, height ${props.timing}`};

  div {
    width: ${props => props.selection ? 100 : 150}px;
    transition: ${props => `width ${props.timing}`};
    border-top: 1px solid ${props => props.theme['brand-primary']};
    border-left: 1px solid ${props => props.theme['brand-primary']};
    border-bottom: 1px solid ${props => props.theme['brand-primary']};

    :hover {
      color: ${props => props.selection ? null : 'white'};
      background: ${props => props.selection ? null : props.theme['brand-primary']};
    }
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
