
export const calculateAnimation = status => {
  switch (status) {
    case 'no_deposits': return { step1: 'active', line1: 'active', step2: 'disabled', line2: 'disabled', step3: 'disabled' }
    case 'received': return { step1: 'inactive', line1: 'inactive', step2: 'active', line2: 'active', step3: 'disabled' }
    case 'complete': return { step1: 'inactive', line1: 'inactive', step2: 'inactive', line2: 'inactive', step3: 'active' }
    case 'failed': return { step1: 'inactive', line1: 'inactive', step2: 'inactive', line2: 'inactive', step3: 'disabled ' }
    default: return { step1: 'active', line1: 'active', step2: 'disabled', line2: 'disabled', step3: 'disabled ' }
  }
}
