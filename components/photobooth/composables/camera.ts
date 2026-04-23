export function supportsFacingModeConstraint() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getSupportedConstraints) {
    return false
  }

  return Boolean(navigator.mediaDevices.getSupportedConstraints().facingMode)
}
