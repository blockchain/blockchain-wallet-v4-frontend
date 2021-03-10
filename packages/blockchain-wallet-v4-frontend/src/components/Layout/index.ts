import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import { Box } from '../Box'

export const StickyHeader = styled.div`
  background-color: ${props => props.theme.white};
  position: sticky;
  width: 100%;
  z-index: 1;
  top: 0;
`

// Default Scene wrapper
// Use to avoid inconsistent padding and margins
// The padding rules should come from https://github.com/blockchain/blockchain-wallet-v4-frontend/blob/feat/development/packages/blockchain-wallet-v4-frontend/src/layouts/Wallet/template.js/#L29-L42
export const SceneWrapper = styled.div<{ centerContent?: boolean }>`
  width: 100%;
  height: 100%;

  ${props =>
    props.centerContent &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`

// Header, Icon, Subheaders for all empty states

export const IconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  background-color: ${props => props.theme.blue000};
  border-radius: 40px;
`
export const SceneHeader = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  > :first-child {
    margin-right: 16px;
  }
  ${media.mobile`
    flex-direction: column;
  `}
`
export const HeaderTextWrapper = styled.div`
  display: flex;
  align-items: center;
  > :first-child {
    margin-right: 16px;
  }
`

export const SceneHeaderText = styled(Text)`
  font-size: 32px;
  color: ${props => props.theme.grey800};
  font-weight: 600;
  margin-right: 14px;
`
export const SceneSubHeaderText = styled(Text)`
  font-size: 16px;
  color: ${props => props.theme.grey600};
  font-weight: 500;
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

export const CustomBox = styled(Box)`
  background-image: url('/img/buy-sell-learn-more.png');
  /* stylelint-disable */
  background-image: -webkit-image-set(
    url('/img/buy-sell-learn-more.png') 1x,
    url('/img/buy-sell-learn-more@2x.png') 2x
  );
  /* stylelint-enable */
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const CustomBoxRightOriented = styled.div`
  position: relative;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.grey000};
  background-image: url('/img/bg-banner-pattern.svg');
  background-repeat: repeat-y;
  background-position: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
