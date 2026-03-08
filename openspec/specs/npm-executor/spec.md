# npm-executor Specification

## Purpose
TBD - created by archiving change backend-implementation. Update Purpose after archive.
## Requirements
### Requirement: npm command execution
The system SHALL provide typed wrappers around npm CLI commands, used by `InstallerService` to install packages and check npm configuration.

#### Scenario: Install a global package
- **WHEN** `npmInstall(pkg, { global: true })` is called
- **THEN** runs `npm install -g <pkg>` and returns `{ exitCode, stdout, stderr }`

#### Scenario: Install to a directory
- **WHEN** `npmInstall(pkg, { cwd: '/some/path' })` is called
- **THEN** runs `npm install <pkg>` in that directory

#### Scenario: List installed packages
- **WHEN** `npmList({ global: true, depth: 0 })` is called
- **THEN** runs `npm list -g --depth=0 --json` and returns parsed JSON or throws on failure

#### Scenario: Get npm config value
- **WHEN** `npmConfigGet('registry')` is called
- **THEN** runs `npm config get registry` and returns the string value

#### Scenario: Set npm config value
- **WHEN** `npmConfigSet('registry', 'https://registry.npmmirror.com')` is called
- **THEN** runs `npm config set registry <value>` and returns success

