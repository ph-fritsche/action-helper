import { execFileSync } from 'child_process'
import { realpathSync } from 'fs'
import { join } from 'path'
import { execPath} from 'process'

const exampleDir = realpathSync(__dirname + '/../example')

function setup(project = '') {
    const output: {[k: string]: string} = {}

    const exec = (env: {[k: string]: string} = {}) => {
        Object.keys(output).forEach(k => { delete output[k] })

        String(execFileSync(
            execPath,
            [join(__dirname, '..', 'dist-ncc', 'index.js')],
            {
                cwd: join(exampleDir, project),
                env,
            },
        )).split('\n').forEach(l => {
            const m = l.match(/^::set-output name=([^:]+)::(.*?)\r?$/)
            if (m) {
                output[m[1]] = m[2]
            }
        })
    }

    return { output, exec }
}

it('output package.json', () => {
    const { output, exec } = setup('project-node')

    exec()
    expect(output.node).toBeTruthy()
    expect(JSON.parse(output.node).name).toBe('@example/my-node-project')
    expect(output.composer).toBeFalsy()
})

it('output composer.json', () => {
    const { output, exec } = setup('project-composer')

    exec()
    expect(output.composer).toBeTruthy()
    expect(JSON.parse(output.composer).name).toBe('example/my-composer-project')
    expect(output.node).toBeFalsy()
})

it.each([
    [{
        GITHUB_EVENT_NAME: 'push',
        GITHUB_REF: 'refs/heads/master',
    }, {
        branchName: 'master',
        branchIsMain: 'true',
        branchIsDev: '',
        branchIsMaintenance: '',
    }],
    [{
        GITHUB_EVENT_NAME: 'pull_request',
        GITHUB_BASE_REF: 'refs/heads/master',
    }, {
        branchName: 'master',
        branchIsMain: 'true',
        branchIsDev: '',
        branchIsMaintenance: '',
    }],
    [{
        GITHUB_EVENT_NAME: 'push',
        GITHUB_REF: 'refs/heads/1.2',
    }, {
        branchName: '1.2',
        branchIsMain: '',
        branchIsDev: '',
        branchIsMaintenance: 'true',
    }],
    [{
        GITHUB_EVENT_NAME: 'push',
        GITHUB_REF: 'refs/heads/next',
    }, {
        branchName: 'next',
        branchIsMain: '',
        branchIsDev: 'true',
        branchIsMaintenance: '',
    }],
    [{
        GITHUB_EVENT_NAME: 'push',
        GITHUB_REF: 'refs/heads/foo',
    }, {
        branchName: 'foo',
        branchIsMain: '',
        branchIsDev: '',
        branchIsMaintenance: '',
    }],
])('output branch info', (env, expectedOutput) => {
    const { output, exec } = setup()

    exec(env)
    expect(output).toMatchObject(expectedOutput)
})
