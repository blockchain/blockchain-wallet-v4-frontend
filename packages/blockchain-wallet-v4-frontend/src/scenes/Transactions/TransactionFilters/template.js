import { ComponentDropdown, Icon, Link, Text } from 'blockchain-info-components'
import { Field, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { includes } from 'ramda'
import { model } from 'data'
import { StickyHeader } from 'components/Layout'
import { TabMenuTransactionStatus, TextBox } from 'components/Form'
import HorizontalMenu from 'components/HorizontalMenu'
import React from 'react'
import styled from 'styled-components'

const { WALLET_TX_SEARCH } = model.form

const Search = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 300px;

  @media (max-width: 1265px) {
    width: inherit;
  }
`
const EthPrivateKeysWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-right: 10px;
  min-width: 115px;
`
const ExportEthPrivateKeyText = styled(Text)`
  cursor: pointer;
`
const ReportingIcon = styled(Icon)`
  width: 40px;
  margin-right: 10px;
`
const SearchField = styled(Field)`
  > div > span {
    top: 14px;
    font-size: 18px;
  }
`
const PRIVATE_KEY_EXPORT_COINS = ['ETH', 'XLM']
const TX_EXPORT_COINS = ['BTC', 'BCH']

const EthPrivateKeys = () => (
  <Link weight={500} size='12px'>
    <FormattedMessage
      id='scenes.transactions.menu.ethprivatekeys'
      defaultMessage='Private Keys'
    />
  </Link>
)
const TransactionFilters = ({
  coin,
  handleClickReporting,
  onShowPrivateKey,
  onShowEthPrivateKeyLegacy,
  isLegacyEthAddr
}) => (
  <StickyHeader>
    <HorizontalMenu>
      <Field
        name='status'
        statuses={['', 'sent', 'received', 'transferred']}
        component={TabMenuTransactionStatus}
      />
      <Search>
        {includes(coin, PRIVATE_KEY_EXPORT_COINS) && (
          <EthPrivateKeysWrapper>
            {isLegacyEthAddr ? (
              <ComponentDropdown
                down
                forceSelected
                color={'gray-5'}
                selectedComponent={<EthPrivateKeys />}
                components={[
                  <ExportEthPrivateKeyText
                    size='small'
                    onClick={onShowPrivateKey}
                  >
                    <FormattedMessage
                      id='scenes.transactions.export.ethkey'
                      defaultMessage='Export Private Key'
                    />
                  </ExportEthPrivateKeyText>,
                  <ExportEthPrivateKeyText
                    size='small'
                    onClick={onShowEthPrivateKeyLegacy}
                  >
                    <FormattedMessage
                      id='scenes.transactions.export.ethkeyarchived'
                      defaultMessage='Export Archived Private Key'
                    />
                  </ExportEthPrivateKeyText>
                ]}
              />
            ) : (
              <Link
                size={'12px'}
                weight={400}
                onClick={onShowPrivateKey}
                data-e2e='exportPrivateKeyLink'
              >
                <FormattedMessage
                  id='scenes.transactions.export.ethkey'
                  defaultMessage='Export Private Key'
                />
              </Link>
            )}
          </EthPrivateKeysWrapper>
        )}
        {includes(coin, TX_EXPORT_COINS) && (
          <ReportingIcon
            color='grey400'
            cursor
            data-e2e='generateTxReport'
            name='download'
            onClick={handleClickReporting}
            size='20px'
          />
        )}
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

export default reduxForm({
  form: WALLET_TX_SEARCH,
  initialValues: { source: 'all' }
})(TransactionFilters)
