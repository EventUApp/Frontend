const fs = require('fs');
const babel = require('@babel/core');
try {
  babel.transformFileSync('./src/app/(tabs)/explore.tsx', {
    presets: ['@babel/preset-typescript', '@babel/preset-react'],
    filename: 'explore.tsx'
  });
  console.log("explore.tsx parses fine");
} catch(e) {
  console.log("explore.tsx error:", e.message);
}
try {
  babel.transformFileSync('./src/app/chat/[id].tsx', {
    presets: ['@babel/preset-typescript', '@babel/preset-react'],
    filename: '[id].tsx'
  });
  console.log("chat/[id].tsx parses fine");
} catch(e) {
  console.log("chat/[id].tsx error:", e.message);
}
