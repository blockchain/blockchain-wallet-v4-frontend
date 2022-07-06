import { NabuErrorAction, NabuErrorLaunchAction } from '../../NabuError.types'

const isNabuErrorLaunchAction = (action: NabuErrorAction): action is NabuErrorLaunchAction => {
  return action.type === 'LAUNCH'
}

export { isNabuErrorLaunchAction }
