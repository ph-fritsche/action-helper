export let branchRef: string | undefined
if (process.env.GITHUB_EVENT_NAME === 'push') {
    branchRef = process.env.GITHUB_REF
} else if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
    branchRef = process.env.GITHUB_BASE_REF
}

export const branchName = branchRef && branchRef.startsWith('refs/heads/') && branchRef.substr(11)

export const branchIsMaintenance = branchName && /^\d+\.\d+$/.test(branchName)
export const branchIsMain = branchName && ['master', 'main'].includes(branchName)
export const branchIsDev = branchName && ['next', 'pre', 'alpha', 'beta', 'dev'].includes(branchName)
