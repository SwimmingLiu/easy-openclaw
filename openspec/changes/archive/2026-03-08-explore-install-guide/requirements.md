# OpenClaw Installation Research — Requirements

> Research Date: 2026-03-07  
> Sources: [docs.openclaw.ai](https://docs.openclaw.ai), [github.com/openclaw/openclaw](https://github.com/openclaw/openclaw), local source at `/home/admin/openclaw`

---

## What is OpenClaw?

OpenClaw is a **self-hosted personal AI assistant gateway** that connects messaging apps (WhatsApp, Telegram, Discord, Slack, iMessage, and 20+ more) to AI coding agents. It runs a single Gateway process on your machine, bridging messaging apps to an always-available AI assistant.

- **License**: MIT
- **Runtime**: Node.js
- **Package**: `openclaw` on npm
- **GitHub**: https://github.com/openclaw/openclaw

---

## 1. System Requirements

| Requirement | Specification |
|-------------|---------------|
| **Node.js** | ≥ 22 (minimum) |
| **Operating System** | macOS, Linux, Windows (via WSL2 — strongly recommended; native Windows not officially supported) |
| **Package manager** | npm, pnpm, or bun (all supported) |
| **Disk** | Not explicitly stated; standard Node app footprint |
| **Memory** | Not explicitly stated |

**Verify Node version:**
```bash
node --version
# Should output v22.x.x or higher
```

---

## 2. Installation Methods

### Method 1: Official Install Script (Recommended for macOS/Linux)

```bash
# macOS/Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows (PowerShell)
iwr -useb https://openclaw.ai/install.ps1 | iex
```

This is the recommended path per [Getting Started](https://docs.openclaw.ai/start/getting-started).

### Method 2: npm Global Install

```bash
npm install -g openclaw@latest

# or with pnpm
pnpm add -g openclaw@latest
```

### Method 3: npx (no global install)

```bash
npx openclaw@latest onboard
```

### Method 4: Source Compilation (Development)

Preferred package manager for source builds: `pnpm`. Bun is optional for running TypeScript directly.

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw

pnpm install
pnpm ui:build        # auto-installs UI deps on first run
pnpm build           # produces dist/ for running via Node

pnpm openclaw onboard --install-daemon
```

**Dev loop (auto-reload on TypeScript changes):**
```bash
pnpm gateway:watch
```

Note: `pnpm openclaw ...` runs TypeScript directly via `tsx`. `pnpm build` compiles to `dist/` for production.

### Method 5: Docker

Available via `docker-compose.yml` in the repository. See [Docker docs](https://docs.openclaw.ai/install/docker) for full setup.

### Method 6: Nix

Declarative config via [nix-openclaw](https://github.com/openclaw/nix-openclaw). See [Nix docs](https://docs.openclaw.ai/install/nix).

---

## 3. Post-Install Setup (Onboarding)

### Step 1: Run the Onboarding Wizard

```bash
openclaw onboard --install-daemon
```

This wizard:
- Configures authentication (API keys for AI providers)
- Sets up Gateway settings
- Installs the Gateway as a background daemon (launchd on macOS, systemd user service on Linux)
- Optionally configures channels (WhatsApp, Telegram, etc.)

Alternative: run `openclaw configure` for just the config wizard.

### Step 2: Verify Gateway Status

```bash
openclaw gateway status
```

Expected output: `Runtime: running` and `RPC probe: ok`.

### Step 3: Open the Control UI

```bash
openclaw dashboard
```

Default URL: http://127.0.0.1:18789/

If the Control UI loads, the installation is successful.

---

## 4. Configuration

### Config File Location

```
~/.openclaw/openclaw.json
```

The file is **optional** — OpenClaw uses safe defaults if missing. The format is **JSON5** (supports comments and trailing commas).

### Configuration Methods

| Method | Command/Path |
|--------|-------------|
| Interactive wizard | `openclaw onboard` or `openclaw configure` |
| CLI one-liners | `openclaw config get/set/unset <key>` |
| Control UI | http://127.0.0.1:18789 → Config tab |
| Direct file edit | Edit `~/.openclaw/openclaw.json` (hot-reloaded) |

### Minimal Config Example

```json5
// ~/.openclaw/openclaw.json
{
  agents: { defaults: { workspace: "~/.openclaw/workspace" } },
  channels: { whatsapp: { allowFrom: ["+15555550123"] } },
}
```

### Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `OPENCLAW_HOME` | Override home directory for all internal paths | `$HOME` |
| `OPENCLAW_STATE_DIR` | Override state directory | `~/.openclaw` |
| `OPENCLAW_CONFIG_PATH` | Override config file path | `~/.openclaw/openclaw.json` |
| `OPENCLAW_LOG_LEVEL` | Set log level (`debug`, `trace`, etc.) | Per config |
| `OPENCLAW_LOAD_SHELL_ENV` | Import login shell env vars | `0` |

### Env File Loading Order (highest → lowest precedence)

1. Process environment (parent shell / daemon)
2. `.env` in current working directory
3. `~/.openclaw/.env` (global fallback)
4. `env` block in `~/.openclaw/openclaw.json`
5. Login-shell import (if `OPENCLAW_LOAD_SHELL_ENV=1`)

### Config Validation

OpenClaw **strictly validates** the config schema. Invalid keys or types cause the Gateway to refuse to start. To diagnose:

```bash
openclaw doctor          # show exact issues
openclaw doctor --fix    # apply automatic repairs
```

### Config Hot Reload

The Gateway watches `~/.openclaw/openclaw.json` and hot-reloads most settings without restart. Gateway server settings (port, bind, auth, TLS) require a restart.

---

## 5. Development Channels

| Channel | npm dist-tag | Description |
|---------|-------------|-------------|
| `stable` | `latest` | Tagged releases (`vYYYY.M.D`) |
| `beta` | `beta` | Prerelease tags (`vYYYY.M.D-beta.N`) |
| `dev` | `dev` | Moving head of `main` |

Switch channels:
```bash
openclaw update --channel stable|beta|dev
```

---

## 6. Verification Steps

After installation, verify with:

```bash
# 1. Check installed version
openclaw --version

# 2. Check gateway status
openclaw gateway status
# Expected: Runtime: running, RPC probe: ok

# 3. Run diagnostics
openclaw doctor

# 4. Check all channels
openclaw channels status --probe

# 5. Full status overview
openclaw status
```

Open the Control UI at http://127.0.0.1:18789/ — if it loads, installation is successful.

---

## 7. Troubleshooting

### Diagnostic Command Ladder

Run these in order when something is wrong:

```bash
openclaw status
openclaw gateway status
openclaw logs --follow
openclaw doctor
openclaw channels status --probe
```

### Common Issues

#### Gateway won't start
- **Cause**: Invalid config — unknown keys, malformed types
- **Fix**: `openclaw doctor --fix`
- **Config location**: `~/.openclaw/openclaw.json`

#### Port already in use (`EADDRINUSE`)
- **Cause**: Another process is using port 18789 (or configured port)
- **Fix**: Change `gateway.port` in config, or stop the conflicting process

#### `refusing to bind gateway ... without auth`
- **Cause**: Non-loopback bind configured without auth token/password
- **Fix**: Set `gateway.auth.token` in config, or bind to loopback only

#### `Gateway start blocked: set gateway.mode=local`
- **Cause**: `gateway.mode` not set to `local` (required for local Gateway)
- **Fix**: `openclaw config set gateway.mode local`

#### Permission errors during global npm install
- **Fix options**:
  - Use `nvm` to manage Node.js versions (npm installs to user-owned directories)
  - Change npm's default directory: `npm config set prefix '~/.npm-global'`
  - Use `pnpm` which installs to user space by default

#### `RPC probe: failed` while Gateway is running
- **Cause**: Auth or URL mismatch between CLI and Gateway
- **Fix**: Check `gateway.auth.token` and `gateway.remote.url` settings

#### Post-upgrade breakage
- Run `openclaw doctor` — catches most config drift issues
- If service config and runtime disagree: `openclaw gateway install --force && openclaw gateway restart`
- Logs: `openclaw logs --follow`

### Linux-specific: systemd service issues

```bash
# Check service status
openclaw gateway status --deep

# Reinstall service
openclaw gateway install --force
openclaw gateway restart
```

### macOS-specific: launchd service

```bash
# Gateway status
openclaw gateway status

# Restart service
openclaw gateway restart
```

---

## 8. Updating OpenClaw

```bash
# Update to latest stable
openclaw update

# Update to specific channel
openclaw update --channel beta
```

After update, run `openclaw doctor` to catch any config migration issues.

Docs: [Updating guide](https://docs.openclaw.ai/install/updating)

---

## References

- **Official docs**: https://docs.openclaw.ai
- **Getting Started**: https://docs.openclaw.ai/start/getting-started
- **Configuration**: https://docs.openclaw.ai/gateway/configuration
- **Environment Variables**: https://docs.openclaw.ai/help/environment
- **Troubleshooting**: https://docs.openclaw.ai/gateway/troubleshooting
- **GitHub repo**: https://github.com/openclaw/openclaw
- **Docker install**: https://docs.openclaw.ai/install/docker
- **Nix install**: https://docs.openclaw.ai/install/nix
- **Development channels**: https://docs.openclaw.ai/install/development-channels
- **Updating**: https://docs.openclaw.ai/install/updating
