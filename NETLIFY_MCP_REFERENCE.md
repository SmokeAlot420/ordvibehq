# Netlify MCP Reference Guide

## Overview

The Netlify MCP (Model Context Protocol) Server enables AI agents to interact with Netlify's API and CLI to create, manage, and deploy projects using natural language prompts.

## Installation & Setup

### Prerequisites
- Node.js 22 or higher
- Netlify CLI: `npm install -g netlify-cli`
- Netlify account with Personal Access Token (PAT)

### MCP Configuration

Add to your Claude Code MCP settings:
```bash
claude mcp add netlify "npx -y @netlify/mcp -s user"
```

### Authentication Setup

1. Generate a Personal Access Token:
   - Go to Netlify dashboard → User icon → User settings → OAuth
   - Select "New access token"
   - Copy the token

2. Set environment variable:
   ```bash
   export NETLIFY_AUTH_TOKEN="your-token-here"
   ```

## Known Issues

### Schema Validation Error

**Problem**: Some MCP endpoints fail with "Expected object, received string" error:
```
MCP error -32602: Invalid arguments for tool netlify-project-services:
"expected": "object", "received": "string", "path": ["selectSchema"]
```

**Cause**: Parameter serialization incompatibility between Claude Code's MCP client and Netlify MCP server.

**Status**:
- ✅ Working: `netlify-user-services`
- ❌ Affected: `netlify-project-services`, `netlify-team-services`

## Effective Workarounds

### Use Netlify CLI Directly

Since the CLI works perfectly, use these commands instead of problematic MCP endpoints:

#### List All Sites
```bash
netlify api listSites
```

#### Get Specific Site
```bash
netlify api getSite --data '{"site_id": "your-site-id"}'
```

#### Link Current Directory to Site
```bash
netlify link
```

#### Deploy Site
```bash
# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Manage Environment Variables
```bash
# Set variable
netlify env:set KEY value

# List variables
netlify env:list

# Get specific variable
netlify env:get KEY

# Unset variable
netlify env:unset KEY
```

#### Site Management
```bash
# Check status
netlify status

# Open site in browser
netlify open

# View deploy logs
netlify deploy --open
```

## Working MCP Commands

### Get User Information
The user services endpoint works correctly:
```javascript
// This works in Claude Code
mcp__netlify__netlify-user-services
// with selectSchema: {"operation": "get-user", "params": {}}
```

## Best Practices

1. **Authentication**: Never commit your PAT to repositories
2. **Environment**: Set NETLIFY_AUTH_TOKEN in your shell profile
3. **Verification**: Always run `netlify status` to verify connection
4. **Deployment**: Use `--prod` flag carefully for production deployments

## Supported Operations

When fully functional, Netlify MCP supports:
- Create and manage projects
- Deploy sites
- Modify project access controls
- Install/uninstall extensions
- Manage environment variables and secrets
- Handle form submissions
- Fetch user and team information

## Troubleshooting

### Check MCP Connection
```bash
# List all MCP servers
claude mcp list

# Check Netlify CLI authentication
netlify status
```

### Verify Site Connection
```bash
# In project directory
netlify status

# Link if needed
netlify link
```

### Direct API Access
For operations not available in CLI:
```bash
# Generic API call format
netlify api <endpoint> --data '<json-data>'

# Example: Get deploys
netlify api listSiteDeploys --data '{"site_id": "your-site-id"}'
```

## Quick Reference

| Task | Command |
|------|---------|
| List sites | `netlify api listSites` |
| Deploy | `netlify deploy --prod` |
| Set env var | `netlify env:set KEY value` |
| Check status | `netlify status` |
| Link project | `netlify link` |
| View logs | `netlify logs:function` |

## Additional Resources

- [Official Netlify MCP Docs](https://docs.netlify.com/welcome/build-with-ai/netlify-mcp-server/)
- [Netlify CLI Reference](https://cli.netlify.com/)
- [MCP Protocol Spec](https://modelcontextprotocol.io/)

---

**Note**: This reference focuses on practical workarounds while the MCP parameter serialization issue is being resolved. The Netlify CLI provides full functionality for all operations.