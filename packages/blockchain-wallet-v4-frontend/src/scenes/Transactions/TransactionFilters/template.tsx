import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field } from 'redux-form'
import styled from 'styled-components'

import { IconButton, TooltipHost } from 'blockchain-info-components'
import { TabMenuTransactionStatus, TextBox } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import { StickyHeader } from 'components/Layout'
import { media } from 'services/styles'

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

const TransactionFilters = ({ handleClickReporting }) => (
  <StickyHeader>
    <HorizontalMenu marginBottom='0px' border={false}>
      <Field
        name='status'
        statuses={['', 'sent', 'received', 'transferred']}
        component={TabMenuTransactionStatus}
      />
      <Search>
        <TooltipHost id='copy.on_chain_txs'>
          <StyledIconButton
            data-e2e='generateTxReport'
            height='45px'
            name='download'
            nature='light'
            onClick={handleClickReporting}
            width='120px'
          >
            <FormattedMessage id='copy.download' defaultMessage='Download' />
          </StyledIconButton>
        </TooltipHost>
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
