import styled from 'styled-components'

const InfoWell = styled.div`
  padding: 15px;
  margin-bottom: 10px;
  box-sizing: border-box;
  background-color: ${props => props.theme['moccasin']};
  border-left: 5px solid ${props => props.theme['dandelion']};
  text-align: justify;

  & > * { display: inline; margin-right: 5px; }
`

export default InfoWell
