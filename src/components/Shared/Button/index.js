import styled from 'styled-components'
import Color from 'color'

const BaseButton = styled.button`
  width: ${props => props.fullwidth ? '100%' : 'auto'};
  height: 40px;
  padding: 5px 30px;
  text-align: center;
  cursor: pointer;
  font-weight: ${props => props.weight ? props.weight : '300'};
  font-size: ${props => props.size ? props.size : '1rem'};
  text-transform: ${props => props.transform ? props.transform : 'none'};
  transition: 0.5s;
`

BaseButton.defaultProps = {
  type: 'default'
}

const Button = BaseButton.extend`
  border: 0;
  color: ${props => props.theme.white};
  background-color: ${props => props.theme.brandPrimary};

  &:hover {
    background-color: ${props => Color(props.theme.brandPrimary).darken(0.2).string()};
  }
`

const CircleButton = BaseButton.extend`
  border-radius: 20px;
  color: ${props => props.theme.white};
  background-color: ${props => props.theme.brandPrimary};
  border: 2px solid ${props => props.theme.grayLighter};

  &:hover {
    background-color: ${props => Color(props.theme.brandPrimary).darken(0.2).string()};
  }
`
export { Button, CircleButton }
