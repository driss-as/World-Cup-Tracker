#!/bin/bash
set -e

npx expo export -p web

# Copy manifest
cp manifest.json dist/manifest.json

# Copy icon for PWA
cp assets/icon.png dist/assets/icon.png 2>/dev/null || true

# Inject manifest link and apple-touch-icon into index.html
node -e "
const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');
const inject = \`
<link rel=\"manifest\" href=\"/manifest.json\" />
<link rel=\"apple-touch-icon\" href=\"/assets/icon.png\" />
<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />
<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\" />
<meta name=\"apple-mobile-web-app-title\" content=\"WC Tracker\" />
\`;
html = html.replace('<link rel=\"icon\"', inject + '<link rel=\"icon\"');
fs.writeFileSync('dist/index.html', html);
console.log('PWA manifest injected into index.html');
"
