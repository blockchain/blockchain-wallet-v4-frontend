import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const Title = styled(Text)`
  margin: 16px 0 20px;
  text-align: left;
`

export const SubTitle = styled(Title)`
  color: ${props => props.theme.grey600};
  font-size: 12px;
  margin-top: 5px;
`

export const DisplayTitle = styled(Text)`
  font-weight: 600;
  font-size: 14px;
  display: flex;
  color: ${props => props.theme.textBlack};
  width: 100%;
`

export const Subcontent = styled(Text)`
  margin: 38px 0 46px 0;
`

export const NumberDescription = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.grey800};
  margin-left: 16px;
  flex: 1;
  margin-top: 5px;
`

export const NumberWrapper = styled.div`
  width: 32px;
`
export const NumberContainer = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.blue000};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: ${props => props.theme.blue600};
`
export const RowNumber = styled.div`
  display: flex;
  flex-direction: row;
`
