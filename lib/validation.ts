/**
 * Validation Module - Data and Input Validation
 * ============================================================================
 * Comprehensive validation for all input data, parameters, and configurations
 * 
 * Master's Thesis: DDoS Detection with BSO-Hybrid ML Framework
 * Author: SHUAIB AYAD JASIM
 * ============================================================================
 */

export interface ValidationResult {
    isValid: boolean
    errors: string[]
    warnings: string[]
    sanitized?: any
}

// ============================================================================
// Dataset Validation
// ============================================================================

export function validateDataset(data: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!data) {
        errors.push("Dataset is null or undefined")
        return { isValid: false, errors, warnings }
    }

    // Check for required fields
    if (!Array.isArray(data.features) || data.features.length === 0) {
        errors.push("Features array is missing or empty")
    }

    if (typeof data.totalSamples !== "number" || data.totalSamples <= 0) {
        errors.push("totalSamples must be a positive number")
    }

    if (data.totalSamples > 10000000) {
        warnings.push("Dataset size is very large (>10M samples), may cause performance issues")
    }

    // CICIoT2023 specific validation
    if (data.name === "CICIoT2023") {
        const expectedFeatures = 39
        if (data.features.length !== expectedFeatures) {
            warnings.push(`CICIoT2023 should have ${expectedFeatures} features, found ${data.features.length}`)
        }

        const expectedClasses = 5
        if (!data.classes || data.classes.length !== expectedClasses) {
            warnings.push(`CICIoT2023 should have ${expectedClasses} attack types`)
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    }
}

// ============================================================================
// Model Parameters Validation
// ============================================================================

export function validateBSOParameters(params: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!params) {
        errors.push("BSO parameters object is null or undefined")
        return { isValid: false, errors, warnings }
    }

    // Validate population size
    if (typeof params.swarmSize !== "number") {
        errors.push("swarmSize must be a number")
    } else if (params.swarmSize < 5) {
        errors.push("swarmSize must be at least 5")
    } else if (params.swarmSize > 1000) {
        warnings.push("swarmSize > 1000 may slow down optimization")
    }

    // Validate iterations
    if (typeof params.maxIterations !== "number") {
        errors.push("maxIterations must be a number")
    } else if (params.maxIterations < 10) {
        errors.push("maxIterations must be at least 10")
    } else if (params.maxIterations > 10000) {
        warnings.push("maxIterations > 10000 may take very long time")
    }

    // Validate frequency bounds
    if (typeof params.frequencyMin !== "number" || typeof params.frequencyMax !== "number") {
        errors.push("frequencyMin and frequencyMax must be numbers")
    } else if (params.frequencyMin >= params.frequencyMax) {
        errors.push("frequencyMin must be less than frequencyMax")
    }

    // Validate loudness and pulse rate
    if (typeof params.initialLoudness !== "number") {
        errors.push("initialLoudness must be a number")
    } else if (params.initialLoudness < 0 || params.initialLoudness > 1) {
        errors.push("initialLoudness must be between 0 and 1")
    }

    if (typeof params.initialPulseRate !== "number") {
        errors.push("initialPulseRate must be a number")
    } else if (params.initialPulseRate < 0 || params.initialPulseRate > 1) {
        errors.push("initialPulseRate must be between 0 and 1")
    }

    // Validate decay parameters
    if (typeof params.alpha !== "number") {
        errors.push("alpha must be a number")
    } else if (params.alpha < 0 || params.alpha > 1) {
        errors.push("alpha must be between 0 and 1")
    }

    if (typeof params.gamma !== "number") {
        errors.push("gamma must be a number")
    } else if (params.gamma < 0 || params.gamma > 1) {
        errors.push("gamma must be between 0 and 1")
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    }
}

export function validateRandomForestParameters(params: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!params) {
        errors.push("RF parameters object is null or undefined")
        return { isValid: false, errors, warnings }
    }

    // Validate n_estimators
    if (typeof params.nEstimators !== "number") {
        errors.push("nEstimators must be a number")
    } else if (params.nEstimators < 1) {
        errors.push("nEstimators must be at least 1")
    } else if (params.nEstimators > 10000) {
        warnings.push("nEstimators > 10000 may cause memory issues")
    }

    // Validate max_depth
    if (params.maxDepth !== null && params.maxDepth !== undefined) {
        if (typeof params.maxDepth !== "number") {
            errors.push("maxDepth must be a number or null")
        } else if (params.maxDepth < 1) {
            errors.push("maxDepth must be at least 1")
        } else if (params.maxDepth > 100) {
            warnings.push("maxDepth > 100 may cause overfitting")
        }
    }

    // Validate min_samples_split
    if (typeof params.minSamplesSplit !== "number") {
        errors.push("minSamplesSplit must be a number")
    } else if (params.minSamplesSplit < 2) {
        errors.push("minSamplesSplit must be at least 2")
    }

    // Validate min_samples_leaf
    if (typeof params.minSamplesLeaf !== "number") {
        errors.push("minSamplesLeaf must be a number")
    } else if (params.minSamplesLeaf < 1) {
        errors.push("minSamplesLeaf must be at least 1")
    }

    // Validate max_features
    if (typeof params.maxFeatures !== "string" && typeof params.maxFeatures !== "number") {
        errors.push("maxFeatures must be a string ('sqrt', 'log2') or a number")
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    }
}

// ============================================================================
// Feature Selection Validation
// ============================================================================

export function validateFeatureSelection(
    selectedIndices: number[],
    totalFeatures: number,
    minFeatures: number = 1,
    maxFeatures?: number
): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!Array.isArray(selectedIndices)) {
        errors.push("selectedIndices must be an array")
        return { isValid: false, errors, warnings }
    }

    if (selectedIndices.length === 0) {
        errors.push("At least one feature must be selected")
    }

    if (selectedIndices.length < minFeatures) {
        errors.push(`Must select at least ${minFeatures} feature(s)`)
    }

    if (maxFeatures && selectedIndices.length > maxFeatures) {
        errors.push(`Cannot select more than ${maxFeatures} feature(s)`)
    }

    // Validate indices
    for (let i = 0; i < selectedIndices.length; i++) {
        const idx = selectedIndices[i]
        if (typeof idx !== "number" || !Number.isInteger(idx)) {
            errors.push(`Feature index ${i} is not an integer`)
        } else if (idx < 0 || idx >= totalFeatures) {
            errors.push(`Feature index ${idx} out of bounds [0, ${totalFeatures - 1}]`)
        }
    }

    // Check for duplicates
    const uniqueIndices = new Set(selectedIndices)
    if (uniqueIndices.size !== selectedIndices.length) {
        errors.push("Duplicate feature indices detected")
    }

    // Feature reduction percentage
    const reductionPct = ((totalFeatures - selectedIndices.length) / totalFeatures) * 100
    if (reductionPct > 95) {
        warnings.push(`Very aggressive feature reduction: ${reductionPct.toFixed(1)}%`)
    }
    if (reductionPct < 5) {
        warnings.push(`Minimal feature reduction: ${reductionPct.toFixed(1)}%`)
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    }
}

// ============================================================================
// Classification Results Validation
// ============================================================================

export function validateClassificationMetrics(metrics: any): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!metrics) {
        errors.push("Metrics object is null or undefined")
        return { isValid: false, errors, warnings }
    }

    const metricNames = ["accuracy", "precision", "recall", "f1Score", "auc"]
    for (const name of metricNames) {
        if (!(name in metrics)) {
            errors.push(`Missing metric: ${name}`)
        } else if (typeof metrics[name] !== "number") {
            errors.push(`${name} must be a number`)
        } else if (metrics[name] < 0 || metrics[name] > 1) {
            errors.push(`${name} must be between 0 and 1, got ${metrics[name]}`)
        }
    }

    // Logical consistency checks
    if (metrics.recall && metrics.precision && metrics.f1Score) {
        const expectedF1 = (2 * metrics.precision * metrics.recall) / (metrics.precision + metrics.recall)
        const diff = Math.abs(metrics.f1Score - expectedF1)
        if (diff > 0.01) {
            warnings.push(
                `F1 score inconsistency: calculated ${expectedF1.toFixed(4)}, got ${metrics.f1Score.toFixed(4)}`
            )
        }
    }

    // Sanity checks
    if (metrics.recall && metrics.recall > metrics.accuracy + 0.1) {
        warnings.push("Recall higher than accuracy by >10%, verify calculations")
    }

    if (metrics.precision && metrics.precision > metrics.accuracy + 0.1) {
        warnings.push("Precision higher than accuracy by >10%, verify calculations")
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    }
}

// ============================================================================
// Confusion Matrix Validation
// ============================================================================

export function validateConfusionMatrix(matrix: number[][], numClasses: number): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!Array.isArray(matrix)) {
        errors.push("Confusion matrix must be a 2D array")
        return { isValid: false, errors, warnings }
    }

    if (matrix.length !== numClasses) {
        errors.push(`Confusion matrix size (${matrix.length}x?) doesn't match number of classes (${numClasses})`)
    }

    for (let i = 0; i < matrix.length; i++) {
        if (!Array.isArray(matrix[i])) {
            errors.push(`Row ${i} of confusion matrix is not an array`)
            continue
        }

        if (matrix[i].length !== numClasses) {
            errors.push(
                `Row ${i} of confusion matrix has ${matrix[i].length} columns, expected ${numClasses}`
            )
        }

        for (let j = 0; j < matrix[i].length; j++) {
            if (!Number.isInteger(matrix[i][j]) || matrix[i][j] < 0) {
                errors.push(`Matrix[${i}][${j}] must be a non-negative integer`)
            }
        }
    }

    // Check if matrix has at least some predictions
    const total = matrix.reduce((sum, row) => sum + row.reduce((s, v) => s + v, 0), 0)
    if (total === 0) {
        errors.push("Confusion matrix is empty (all zeros)")
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    }
}

// ============================================================================
// Convergence History Validation
// ============================================================================

export function validateConvergenceHistory(history: Array<{ fitness: number; iteration: number }>): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    if (!Array.isArray(history)) {
        errors.push("Convergence history must be an array")
        return { isValid: false, errors, warnings }
    }

    if (history.length === 0) {
        errors.push("Convergence history is empty")
        return { isValid: false, errors, warnings }
    }

    // Check fitness values are decreasing (for minimization)
    for (let i = 1; i < history.length; i++) {
        if (history[i].fitness > history[i - 1].fitness) {
            // This is allowed, but unusual for a good optimization
            if (i < 10) {
                // Allow some increase in early iterations
                continue
            }
            warnings.push(`Fitness increased at iteration ${i}: ${history[i - 1].fitness} → ${history[i].fitness}`)
        }
    }

    // Check for NaN or Infinity
    for (let i = 0; i < history.length; i++) {
        if (!Number.isFinite(history[i].fitness)) {
            errors.push(`Invalid fitness value at iteration ${i}: ${history[i].fitness}`)
        }
    }

    // Check iteration numbers are sequential
    for (let i = 1; i < history.length; i++) {
        if (history[i].iteration !== history[i - 1].iteration + 1) {
            warnings.push(`Non-sequential iteration numbers at index ${i}`)
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    }
}

// ============================================================================
// Batch Validation
// ============================================================================

export function validateAllComponents(components: {
    dataset?: any
    bsoParams?: any
    rfParams?: any
    selectedFeatures?: number[]
    metrics?: any
    confusionMatrix?: number[][]
    convergence?: Array<{ fitness: number; iteration: number }>
}): ValidationResult {
    const allErrors: string[] = []
    const allWarnings: string[] = []

    // Validate each component
    if (components.dataset) {
        const result = validateDataset(components.dataset)
        allErrors.push(...result.errors.map((e) => `[Dataset] ${e}`))
        allWarnings.push(...result.warnings.map((w) => `[Dataset] ${w}`))
    }

    if (components.bsoParams) {
        const result = validateBSOParameters(components.bsoParams)
        allErrors.push(...result.errors.map((e) => `[BSO Params] ${e}`))
        allWarnings.push(...result.warnings.map((w) => `[BSO Params] ${w}`))
    }

    if (components.rfParams) {
        const result = validateRandomForestParameters(components.rfParams)
        allErrors.push(...result.errors.map((e) => `[RF Params] ${e}`))
        allWarnings.push(...result.warnings.map((w) => `[RF Params] ${w}`))
    }

    if (components.selectedFeatures && components.dataset) {
        const result = validateFeatureSelection(
            components.selectedFeatures,
            components.dataset.totalFeatures || 39
        )
        allErrors.push(...result.errors.map((e) => `[Feature Selection] ${e}`))
        allWarnings.push(...result.warnings.map((w) => `[Feature Selection] ${w}`))
    }

    if (components.metrics) {
        const result = validateClassificationMetrics(components.metrics)
        allErrors.push(...result.errors.map((e) => `[Metrics] ${e}`))
        allWarnings.push(...result.warnings.map((w) => `[Metrics] ${w}`))
    }

    if (components.confusionMatrix && components.dataset) {
        const result = validateConfusionMatrix(components.confusionMatrix, components.dataset.classes?.length || 5)
        allErrors.push(...result.errors.map((e) => `[Confusion Matrix] ${e}`))
        allWarnings.push(...result.warnings.map((w) => `[Confusion Matrix] ${w}`))
    }

    if (components.convergence) {
        const result = validateConvergenceHistory(components.convergence)
        allErrors.push(...result.errors.map((e) => `[Convergence] ${e}`))
        allWarnings.push(...result.warnings.map((w) => `[Convergence] ${w}`))
    }

    return {
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings,
    }
}

// ============================================================================
// Error Formatting Utilities
// ============================================================================

export function formatValidationResult(result: ValidationResult): string {
    let output = ""

    if (result.isValid) {
        output += "✅ Validation passed\n"
    } else {
        output += "❌ Validation failed\n"
    }

    if (result.errors.length > 0) {
        output += "\n🔴 Errors:\n"
        result.errors.forEach((err) => {
            output += `  • ${err}\n`
        })
    }

    if (result.warnings.length > 0) {
        output += "\n🟡 Warnings:\n"
        result.warnings.forEach((warn) => {
            output += `  • ${warn}\n`
        })
    }

    return output
}

export function throwIfInvalid(result: ValidationResult, context: string = ""): void {
    if (!result.isValid) {
        const prefix = context ? `[${context}] ` : ""
        const errorMsg =
            prefix +
            "Validation failed:\n" +
            result.errors.map((e) => `  - ${e}`).join("\n")
        throw new Error(errorMsg)
    }
}
