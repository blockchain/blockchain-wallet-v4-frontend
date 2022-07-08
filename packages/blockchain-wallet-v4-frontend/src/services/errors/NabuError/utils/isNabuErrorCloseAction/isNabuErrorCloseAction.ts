import { NabuErrorAction, NabuErrorCloseAction } from '../../NabuError.types'

const isNabuErrorCloseAction = (action: NabuErrorAction): action is NabuErrorCloseAction => {
  return action.type === 'CLOSE'
}

export { isNabuErrorCloseAction }
