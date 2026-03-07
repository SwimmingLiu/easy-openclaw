## Context

OpenClaw is a CLI tool with an installation process that is not yet clearly documented for end users. This design covers the research methodology and documentation structure for capturing the full install flow. No code changes are involved — the output is documentation artifacts within the OpenSpec change.

The research sources are:
- Official documentation site: https://docs.openclaw.ai
- GitHub repository: https://github.com/openclaw/openclaw
- Local source copy: /home/admin/openclaw

## Goals / Non-Goals

**Goals:**
- Research and document all aspects of the OpenClaw installation process
- Capture system requirements, installation methods, configuration steps, and troubleshooting
- Produce a `requirements.md` that can serve as the foundation for a user-facing installation guide
- Ensure requirements are testable (each scenario is verifiable)

**Non-Goals:**
- Writing the final user-facing installation guide (that's a follow-up change)
- Modifying any OpenClaw source code
- Automating the installation process
- Covering OpenClaw usage beyond installation and initial configuration

## Decisions

### Decision: Single spec for the entire install flow

**Choice**: Create one spec (`install-guide`) covering all installation concerns rather than splitting into sub-specs.

**Rationale**: The install flow is linear and cohesive. Splitting into separate specs (system-requirements, install-methods, configuration) would create unnecessary overhead for a research change. A single spec with well-organized sections is easier to navigate.

**Alternatives considered**: Multiple specs per concern — rejected due to overhead for a single cohesive topic.

### Decision: requirements.md as the primary deliverable

**Choice**: The final research output is written to `requirements.md` at the change root, not embedded only in the spec file.

**Rationale**: The task explicitly requires `requirements.md` as the output file. The spec file captures formal requirements; `requirements.md` contains the raw research narrative and findings.

## Risks / Trade-offs

- [Risk] Official docs or GitHub repo may be unavailable or incomplete → Mitigation: Fall back to local source at /home/admin/openclaw and inspect package.json, README, and scripts directly
- [Risk] OpenClaw install process may differ across platforms (macOS/Linux/Windows) → Mitigation: Document platform differences explicitly; default to Linux/macOS
- [Risk] Research findings may be outdated if docs lag behind source → Mitigation: Cross-reference docs with local source code
