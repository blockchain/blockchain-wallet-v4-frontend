import { expectSaga } from 'redux-saga-test-plan'

import { Remote } from 'blockchain-wallet-v4/src'
import * as A from './actions'
import { FLOW_TYPES } from './model'
import sagas, { wrongFlowTypeError } from './sagas'

const api = {
  fetchKycConfig: jest.fn(),
  resendDeeplink: jest.fn()
}

const coreSagas = {}

const { checkKycFlow } = sagas({ api, coreSagas })

describe('checkKycFlow saga', () => {
  it('should set flow type', () => {
    const flowType = FLOW_TYPES.LOW
    api.fetchKycConfig.mockResolvedValue({ flowType })
    return expectSaga(checkKycFlow)
      .put(A.setKycFlow(Remote.Loading))
      .call(api.fetchKycConfig)
      .put(A.setKycFlow(Remote.of(flowType)))
      .run()
  })

  it('should set wrong type error if type is not in FLOW_TYPES', () => {
    const flowType = FLOW_TYPES.LOW + '1'
    api.fetchKycConfig.mockResolvedValue({ flowType })
    return expectSaga(checkKycFlow)
      .put(A.setKycFlow(Remote.Loading))
      .call(api.fetchKycConfig)
      .put(A.setKycFlow(Remote.Failure(wrongFlowTypeError)))
      .run()
  })

  it('should set error if flow type endpoint rejects', () => {
    const error = {}
    api.fetchKycConfig.mockRejectedValue(error)
    return expectSaga(checkKycFlow)
      .put(A.setKycFlow(Remote.Loading))
      .call(api.fetchKycConfig)
      .put(A.setKycFlow(Remote.Failure(error)))
      .run()
  })
})
