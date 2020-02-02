import styled from 'styled-components'

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
