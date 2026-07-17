#!/bin/bash
# Post-build script to create routes manifest if missing
if [ ! -f ".next/routes-manifest.json" ]; then
  echo "Creating routes manifest..."
  mkdir -p .next
  cat > .next/routes-manifest.json << 'EOF'
{
  "version": 5,
  "pages404": true,
  "basePath": "",
  "redirects": [],
  "rewrites": {
    "fallback": []
  },
  "headers": [],
  "dynamicRoutes": [],
  "staticRoutes": [],
  "dataRoutes": []
}
EOF
  echo "Routes manifest created"
fi
