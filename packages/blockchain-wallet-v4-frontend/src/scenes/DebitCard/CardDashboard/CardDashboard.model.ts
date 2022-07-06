import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const BoxContainer = styled.div<{ width?: string }>`
  border: 1px solid ${(props) => props.theme.grey000};
  box-sizing: border-box;
  border-radius: 16px;
  margin: 16px 40px;
  width: fit-content;
  display: inline-block;
  vertical-align: top;
  width: ${(props) => (props.width ? props.width : 'inherit')};
`

export const BoxRow = styled.div`
  display: flex;
  padding: 16px 24px;
`

export const BoxRowWithBorder = styled(BoxRow)`
  border-bottom: 1px solid ${(props) => props.theme.grey000};
  align-items: center;
`

export const BoxRowItemTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 16px;
  padding-left: 16px;
  font-weight: 600;
  line-height: 150%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`

export const BoxRowItemSubTitle = styled(Text)`
  color: ${(props) => props.theme.grey600};
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
`

export const Iframe = styled.iframe`
  border: 0;
  width: 340px;
  height: 220px;
`

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  margin-top: 40px;
  font-family: 'Inter';
`

export const CardListHeader = styled.div`
  margin-top: 8px;
  font-family: 'Inter';
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
`

export const CardList = styled.div`
  margin-right: 36px;
  width: 287px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: start;
`

export const CardItem = styled.div`
  padding: 16px;
  width: 287px;
  height: 76px;
  background: ${(props) => props.theme.grey000};
  border: 1px solid ${(props) => props.theme.grey100};
  box-sizing: border-box;
  border-radius: 8px;
  margin: 8px 0px;

  > div {
    display: flex;
    justify-content: space-between;
  }
`

export const CardItemTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
`

export const Last4Wrapper = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.grey600};
`

export const DashboardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const ColumnWrapper = styled.div`
  flex-direction: column;
  display: flex;
`
