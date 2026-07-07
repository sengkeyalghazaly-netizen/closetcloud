#!/bin/bash
export PATH="/Users/amaliasengkey/.local/node/current/bin:$PATH"
cd /Users/amaliasengkey/claudetest
exec /Users/amaliasengkey/.local/node/current/bin/npm run preview -- --port 4173
