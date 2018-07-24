import styled from 'styled-components'

const InfoWell = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  box-sizing: border-box;
  background-color: ${props => props.theme['brand-yellow-lighter']};
  border-left: 5px solid ${props => props.theme['brand-yellow']};
  text-align: justify;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: ${props => props.theme['gray-5']};

  & > * { display: inline; margin-right: 5px; }
`

export default InfoWell
