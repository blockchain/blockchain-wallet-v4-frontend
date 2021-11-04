import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { Form } from 'components/Form'

import { Props as OwnProps } from '../..'

const MarketForm: React.FC<Props> = (props: Props) => {
  return (
    <Form>
      <div>Collections</div>
      {props.collections.map((collection) => (
        <div key={collection.opensea_slug}>
          <Field
            component='input'
            type='radio'
            id={collection.opensea_slug}
            name='collection'
            value={collection.opensea_slug}
            onChange={() =>
              props.formActions.change('nftMarketplace', 'collection', collection.opensea_slug)
            }
          />
          <label htmlFor={collection.opensea_slug}>{collection.display_name}</label>
        </div>
      ))}
    </Form>
  )
}

type Props = OwnProps

export default reduxForm<{}, OwnProps>({
  form: 'nftMarketplace',
  initialValues: { collection: 'doodles-official' }
})(MarketForm)
