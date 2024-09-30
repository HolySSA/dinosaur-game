let currentStage = null;

/**
 * 현재 스테이지
 * @returns currentStage
 */
export function getCurrentStage() {
  return currentStage;
}

/**
 * 현재 스테이지 set
 * @param targetStage 
 */
export function setCurrentStage(targetStage) {
  currentStage = targetStage;
}