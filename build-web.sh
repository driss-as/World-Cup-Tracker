#!/bin/bash
set -e

npx expo export -p web

# Copy assets
cp manifest.json dist/manifest.json
cp assets/favicon.png dist/favicon.png
cp assets/icon.png dist/icon.png

# Patch index.html: replace favicon.ico link with PNG + inject PWA tags
node -e "
const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');

// Replace ico with png favicon (better browser support)
html = html.replace(
  '<link rel=\"icon\" href=\"/favicon.ico\" />',
  '<link rel=\"icon\" type=\"image/png\" sizes=\"192x192\" href=\"/favicon.png\" />'
);

// Inject PWA + Apple meta tags before the replaced favicon link
const inject = \`
<link rel=\"manifest\" href=\"/manifest.json\" />
<link rel=\"apple-touch-icon\" href=\"/icon.png\" />
<meta name=\"apple-mobile-web-app-capable\" content=\"yes\" />
<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\" />
<meta name=\"apple-mobile-web-app-title\" content=\"WC Tracker\" />
\`;

html = html.replace(
  '<link rel=\"icon\" type=\"image/png\"',
  inject + '<link rel=\"icon\" type=\"image/png\"'
);

fs.writeFileSync('dist/index.html', html);
console.log('PWA config injected successfully');
"
