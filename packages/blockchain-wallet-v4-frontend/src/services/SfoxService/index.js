export const isVerified = (verificationStatus) => {
  const { level } = verificationStatus
  return level === 'verified' || (level === 'pending' && verificationStatus.required_docs.length === 0)
}

export const determineStep = (profile, verificationStatus) => {
  if (!profile) {
    return 'create'
  } else {
    if (!isVerified(verificationStatus)) {
      if (!profile.setupComplete && !verificationStatus.required_docs.length) return 'verify'
      else if (verificationStatus.required_docs.length) return 'upload'
      else return 'link'
    } else {
      return 'link'
    }
  }
}
