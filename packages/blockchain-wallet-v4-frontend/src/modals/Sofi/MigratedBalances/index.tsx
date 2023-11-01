// import React from 'react'
// import { useSelector } from 'react-redux'
// import { FormattedMessage } from 'react-intl'
// import styled from 'styled-components'

// import { selectors } from 'data'

// import { CoinType } from '@core/types'
// import { Button, Icon, Modal, ModalBody, Text } from 'blockchain-info-components'
// import modalEnhancer from 'providers/ModalEnhancer'

// import CoinBalanceDisplay from 'components/CoinWithBalance/CoinBalanceDisplay'
// import { ModalName } from 'data/types'

// import { ModalPropsType } from '../../types'

// const BalanceTable = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   width: 100%;
//   margin: 16px 0 72px;
//   > div:first-child {
//     border-top-left-radius: 16px;
//     border-top-right-radius: 16px;
//   }
//   > div:last-child {
//     border-bottom-left-radius: 16px;
//     border-bottom-right-radius: 16px;
//   }
// `
// const BalanceRow = styled.div`
//   flex: auto;
//   display: flex;
//   padding: 20px 10px;
//   flex-direction: column;
//   justify-content: center;
//   background-color: ${(props) => props.theme.grey000}
//   &:not(:last-child) {
//     border-bottom: 1px solid ${(props) => props.theme.grey000};
//   }
// `

// const Amount = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-end;
//   > div:last-child {
//     margin-top: 5px;
//   }
// `
// const CoinNames = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   > div:last-child {
//     margin-top: 5px;
//   }
// `

// const Wrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `

// const IconRow = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: flex-start;
//   align-items: center;
//   & > :first-child {
//     margin-right: 4px;
//   }
// `

// const Coin = styled.div`
//   display: flex;
//   align-items: center;
// `
// const CoinName = styled(Text)`
//   font-size: 14px;
//   font-weight: 600;
//   color: ${(props) => props.theme.grey800};
// `
// const CoinSymbol = styled(Text)`
//   font-size: 12px;
//   font-weight: 500;
//   color: ${(props) => props.theme.grey600};
// `
// const CoinIcon = styled(Icon)`
//   font-size: 32px;
//   margin-right: 16px;
// `

// const Body = styled(ModalBody)`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
// `

// const SofiMigratedBalances = (props: Props) => {
//   const sbBalances = useSelector(selectors.components.buySell.getBSBalances).getOrElse({})
//   const sbBalancesArray = Object.entries(sbBalances).map(([key, value]) => ({
//     symbol: key,
//     ...value
//   }))

//   return (
//     <Modal size='medium' position={props.position} total={props.total}>
//       <Body>
//         <Text
//           size='20px'
//           weight={600}
//           color='grey900'
//           lineHeight='1.5'
//           style={{ marginTop: '24px' }}
//         >
//           <FormattedMessage
//             id='scenes.sofi.modal.migratedbalances.header'
//             defaultMessage='You’re all set! 🎉'
//           />
//         </Text>
//         <Text
//           size='16px'
//           weight={500}
//           color='grey600'
//           lineHeight='1.5'
//           style={{ textAlign: 'center', marginTop: '16px' }}
//         >
//           <FormattedMessage
//             id='scenes.sofi.welcome.modal.body'
//             defaultMessage='Here’s a list of all the assets migrated from your SoFi account. '
//           />
//         </Text>
//         <BalanceTable>
//           {sbBalancesArray.map(({ symbol, mainBalanceToDisplay }) => {
//             const { coinfig } = window.coins[symbol]

//             return (
//               <BalanceRow key={symbol}>
//                 <Wrapper>
//                   <Coin>
//                     <CoinIcon name={symbol as CoinType} size='32px' />
//                     <CoinNames>
//                       <CoinName>{coinfig.name}</CoinName>
//                       <CoinSymbol>{symbol}</CoinSymbol>
//                     </CoinNames>
//                   </Coin>
//                   <Amount>
//                     <CoinBalanceDisplay
//                       coin={symbol}
//                       balance={mainBalanceToDisplay || 0}
//                       size='14px'
//                     />
//                   </Amount>
//                 </Wrapper>
//               </BalanceRow>
//             )
//           })}
//         </BalanceTable>
//         <Button nature='primary' fullwidth data-e2e='sofiContinue'>
//           <FormattedMessage id='buttons.view_my_account' defaultMessage='View my account' />
//         </Button>
//       </Body>
//     </Modal>
//   )
// }

// type Props = ModalPropsType

// export default modalEnhancer(ModalName.SOFI_MIGRATED_BALANCES)(SofiMigratedBalances)
