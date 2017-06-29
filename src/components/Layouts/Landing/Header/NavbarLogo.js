import styled from 'styled-components'

const Logo = styled.div`
  display: inline-flex;
  height: 22px;
  width: 200px;
  background-image: url("./img/${props => props.theme.images.logo}");
  background-color: ${props => props.theme.colors.blue.primary};
  background-size: cover;
  border: none;
`

export default Logo
