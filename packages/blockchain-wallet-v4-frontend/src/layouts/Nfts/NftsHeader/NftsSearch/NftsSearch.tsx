import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'

import { Remote } from '@core'
import { ExplorerGatewaySearchType } from '@core/network/api/nfts/types'
import SelectBox from 'components/Form/SelectBox'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { debounce } from 'utils/helpers'

const Wrapper = styled.div`
  .bc__group-heading {
    display: block;
    text-transform: capitalize;
  }
`

const NftsSearch: React.FC<Props> = ({ formValues, nftActions, nftSearch }) => {
  const [input, setInput] = useState('')

  const handleInputChange = (e: any) => {
    setInput(e)
  }

  useEffect(() => {
    if (input) {
      nftActions.nftSearch({ search: input })
    }
  }, [input, nftActions])

  const elements = Object.keys(nftSearch.getOrElse({} as ExplorerGatewaySearchType))
    .map((key) => {
      return {
        label: key,
        options: nftSearch
          .getOrElse({} as ExplorerGatewaySearchType)
          [key].map((item) => ({ label: item.name, value: item }))
          .slice(0, 5)
      }
    })
    .filter((group) => group.options.length > 0)

  return (
    <Wrapper>
      <Field
        component={SelectBox}
        elements={elements}
        grouped
        hideIndicator
        name='search'
        label='Collections or items'
        cursor='initial'
        filterOption={() => true}
        onInputChange={debounce((e) => handleInputChange(e), 500)}
        isLoading={Remote.Loading.is(nftSearch)}
        placeholder='Collections or items'
      />
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues('nftSearch')(state),
  nftSearch: selectors.components.nfts.getNftSearch(state)
})

const mapDispatchToProps = (dispatch) => ({
  nftActions: bindActionCreators(actions.components.nfts, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(NftsSearch)
