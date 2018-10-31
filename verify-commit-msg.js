/* eslint-disable */

const chalk = require('chalk')
const msgPath = process.env.GIT_PARAMS
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()

const commitRE = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{0,50}\(#(KJDS|kjds)-\d{1,6}\)/
// fork from https://github.com/marionebl/commitlint/blob/master/%40commitlint/is-ignored/src/index.js
const WILDCARDS = [
    c =>
        c.match(
            /^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m
        ),
    c => c.match(/^(R|r)evert (.*)/),
    c => c.match(/^(fixup|squash)!/),
    c => c.match(/^Merged (.*?)(in|into) (.*)/),
    c => c.match(/^Merge remote-tracking branch (.*)/),
    c => c.match(/^Automatic merge from (.*)/),
    c => c.match(/^Auto-merged (.*?) into (.*)/)
];

function isIgnored(commit = '') {
    return WILDCARDS.some(w => w(commit));
}

if (!isIgnored(msg) && !commitRE.test(msg)) {
    console.log()
    console.error(
        `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
        chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
        `    ${chalk.green(`feat(compiler): add 'comments' here(#KJDS-12222)`)}\n` +
        `    ${chalk.green(`fix(v-model): handle events on blur(#kjds-13333)`)}\n\n` +
        chalk.red(`  See .github/COMMIT_CONVENTION.md for more details.\n`) +
        chalk.red(`  You can also use ${chalk.cyan(`npm run commit`)} to interactively generate a commit message.\n`)
    )
    process.exit(1)
}
