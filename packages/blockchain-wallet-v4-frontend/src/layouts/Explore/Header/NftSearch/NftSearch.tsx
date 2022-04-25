import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'

import { SpinningLoader } from 'blockchain-info-components'
import { SelectBox } from 'components/Form'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { debounce } from 'utils/helpers'

const NftSearch: React.FC<Props> = ({ formValues, nftActions, nftSearch }) => {
  const [input, setInput] = useState('')

  const handleInputChange = (e: any) => {
    setInput(e)
  }

  useEffect(() => {
    if (input) {
      nftActions.nftSearch({ search: input })
    }
  }, [input])

  return (
    <Field
      component={SelectBox}
      elements={[
        {
          group: '',
          items: []
        }
      ]}
      hideIndicator
      name='search'
      onInputChange={debounce((e) => handleInputChange(e), 500)}
      label='Collections or items'
      cursor='initial'
      noOptionsMessage={() => {
        return nftSearch.cata({
          Failure: () => null,
          Loading: () => <SpinningLoader width='14px' height='14px' borderWidth='3px' />,
          NotAsked: () => null,
          Success: () => null
        })
      }}
      placeholder='Collections or items'
    />
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

export default connector(NftSearch)
