import { existsSync, readFileSync } from 'fs'

export const node = existsSync('package.json') && JSON.parse(String(readFileSync('package.json')))
export const composer = existsSync('composer.json') && JSON.parse(String(readFileSync('composer.json')))
