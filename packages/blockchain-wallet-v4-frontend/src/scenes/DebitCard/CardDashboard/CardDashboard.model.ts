import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { sizes } from 'services/styles'

export const BoxContainer = styled.div`
  border: 1px solid ${(props) => props.theme.grey000};
  box-sizing: border-box;
  border-radius: 1rem;
  overflow: hidden;
  width: fit-content;
  display: inline-block;
  vertical-align: top;
  width: 100%;
`

export const BoxRow = styled.div`
  display: flex;
  padding: 1rem 1.5rem;
  gap: 1rem;
`

export const BoxRowWithBorder = styled(BoxRow)`
  border-bottom: 1px solid ${(props) => props.theme.grey000};

  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`

export const BoxRowHeader = styled(BoxRow)`
  border-bottom: 1px solid ${(props) => props.theme.grey000};

  align-items: center;
  justify-content: space-between;
`

export const BoxRowItemTitle = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 1rem;
  padding-left: 1rem;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 0.5rem;
`

export const BoxRowItemSubTitle = styled(Text)`
  color: ${(props) => props.theme.grey600};
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
`

export const Iframe = styled.iframe`
  border: 0;
  height: 320px;
  width: 100%;
`

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 1rem 0;
  font-family: 'Inter';
`

export const CardListHeader = styled.div`
  margin-top: 8px;
  font-family: 'Inter';
  font-weight: 600;
  font-size: 1rem;
  line-height: 150%;
`

export const CardList = styled.div`
  box-sizing: border-box;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  align-items: start;
  padding: 0 1.5rem;
`

export const CardItem = styled.div`
  padding: 1rem;
  width: 100%;
  background: ${(props) => props.theme.grey000};
  border: 1px solid ${(props) => props.theme.grey100};
  box-sizing: border-box;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
`

export const CardItemBlock = styled.div`
  display: flex;
  justify-content: space-between;
`

export const CardItemTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
`

export const Last4Wrapper = styled.div`
  font-weight: 500;
  font-size: 0.875rem;

  color: ${(props) => props.theme.grey600};
`

export const DashboardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

export const ColumnWrapper = styled.div`
  flex-direction: column;
  width: calc(50% - 0.5rem);
  display: flex;
  gap: 1rem;

  @media (max-width: ${sizes.laptopM}px) {
    width: 100%;
  }
`
