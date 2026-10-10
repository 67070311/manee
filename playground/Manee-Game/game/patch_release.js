const fs = require('fs');
const path = 'components/PotionGameRelease.tsx';
let s = fs.readFileSync(path, 'utf8');

s = s.replace(
`  useEffect(() => {\n    const available = RECIPES.filter((entry) => save.completed >= entry.unlockAt);\n    const next = available.length ? save.completed % available.length : 0;\n    setRecipeIndex(next);\n  }, [save.completed]);`,
`  const recipeInitialized = useRef(false);\n  useEffect(() => {\n    if (!hydrated || recipeInitialized.current) return;\n    const available = RECIPES.filter((entry) => save.completed >= entry.unlockAt);\n    const next = available.length ? save.completed % available.length : 0;\n    setRecipeIndex(next);\n    recipeInitialized.current = true;\n  }, [hydrated, save.completed]);`
);

s = s.replace(
`  const pourComplete = (id: IngredientId) => {\n    setPouringId(null);\n    setImpactCommitted(false);\n    const nextCount = Math.min(3, brew.length + (impactCommitted ? 0 : 1));\n    if (nextCount >= 3 || brew.length >= 3) setMessage('Ingredients complete. Match the flame to the recipe.');\n    else setMessage('Good pour. Choose the next bottle.');\n    playTone(save.sound, 470, 0.07);\n  };`,
`  const pourComplete = (_id: IngredientId) => {\n    setPouringId(null);\n    setImpactCommitted(false);\n    if (brew.length >= 3) setMessage('Ingredients complete. Match the flame to the recipe.');\n    else setMessage('Good pour. Choose the next bottle.');\n    playTone(save.sound, 470, 0.07);\n  };`
);

s = s.replace(
`  const continueAfterResult = () => {\n    const justCompletedDay = result === 'success' && save.completed > 0 && save.completed % 5 === 0;\n    resetBrew();\n    if (justCompletedDay) setModal('day');\n  };`,
`  const continueAfterResult = () => {\n    const wasSuccess = result === 'success';\n    const justCompletedDay = wasSuccess && save.completed > 0 && save.completed % 5 === 0;\n    if (wasSuccess) {\n      const available = RECIPES.filter((entry) => save.completed >= entry.unlockAt);\n      const next = available.length ? save.completed % available.length : 0;\n      setRecipeIndex(next);\n    }\n    resetBrew();\n    if (justCompletedDay) setModal('day');\n  };`
);

s = s.replace(
`disabled={interactionLocked && result === 'idle'}`,
`disabled={!ready || interactionLocked}`
);

fs.writeFileSync(path, s);
console.log('patched', path);
