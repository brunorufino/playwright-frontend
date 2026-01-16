## Fixes applied

- Restored `package.json` fields (dependencies/devDependencies + `type: module`).
- Pinned Vite to v6 (works with Node 20.x) and plugin-react to 4.3.4 (works with Node >=16).
- Renamed `server,js` to `server.js` to match the `npm start` script.

### Install / build

On Windows PowerShell:

```powershell
rmdir /s /q node_modules
Del package-lock.json
npm install
npm run build
npm start
```
