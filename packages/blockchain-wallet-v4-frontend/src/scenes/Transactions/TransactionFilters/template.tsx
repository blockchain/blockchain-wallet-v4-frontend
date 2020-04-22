import { Field } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { IconButton } from 'blockchain-info-components'
import { StickyHeader } from 'components/Layout'
import { TabMenuTransactionStatus, TextBox } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const StyledIconButton = styled(IconButton)`
  border: 1px solid ${props => props.theme['grey100']};
  border-radius: 8px;
  color: ${props => props.theme['blue600']};
  margin-right: 12px;
`
const Search = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  ${media.laptop`
    width: inherit;
    margin-top: 8px;
  `}
`
const SearchField = styled<any>(Field)`
  > div > span {
    top: 14px;
    font-size: 18px;
  }
`

// const PrivateKeysWrapper = styled.div`
//   display: flex;
//   flex-wrap: nowrap;

//   > div > ul {
//     border: 1px solid ${props => props.theme['grey100']};
//     min-width: 180px;
//     margin-top: 20px;
//   }
//   > div > div > span {
//     display: none;
//   }
// `

// const ExportEthPrivateKeyText = styled(Text)`
//   cursor: pointer;
// `
// const PRIVATE_KEY_EXPORT_COINS = ['ETH', 'XLM']

// const EthPrivateKeys = () => (
//   <StyledIconButton
//     data-e2e="ethPrivateKeysDropdown"
//     height="45px"
//     name="chevron-down-large"
//     nature="light"
//   >
//     <FormattedMessage
//       id="scenes.transactions.menu.ethprivatekeys"
//       defaultMessage="Private Keys"
//     />
//   </StyledIconButton>
// )

const TransactionFilters = ({ handleClickReporting }) => (
  <StickyHeader>
    <HorizontalMenu marginBottom='0px'>
      <Field
        name='status'
        statuses={['', 'sent', 'received', 'transferred']}
        component={TabMenuTransactionStatus}
      />
      <Search>
        <StyledIconButton
          data-e2e='generateTxReport'
          height='45px'
          name='download'
          nature='light'
          onClick={handleClickReporting}
          width='120px'
        >
          <FormattedMessage
            id='scenes.transactions.export.download'
            defaultMessage='Download'
          />
        </StyledIconButton>
        <SearchField
          component={TextBox}
          data-e2e='transactionsMenuSearchBox'
          height='45px'
          icon='magnifier'
          name='search'
          placeholder='Search'
        />
      </Search>
    </HorizontalMenu>
  </StickyHeader>
)

export default TransactionFilters
