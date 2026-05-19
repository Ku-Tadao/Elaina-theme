# PluginFS Datastore Rules

ElainaData must not be read or written before `ElainaData.init(context)` finishes.

## Why

Pengu provides `context.fs` only inside the plugin `init(context)` lifecycle. If code calls
`ElainaData.get`, `ElainaData.set`, `ElainaData.has`, or `ElainaData.remove` during module import,
the storage backend may not be initialized yet.

This can cause unstable behavior such as:
- data being saved to `data/ElainaData.json` but the theme reading old values
- custom settings applying even after being turned off
- stale legacy `window.DataStore` values overriding PluginFS values
- defaults being restored into the wrong backend

## Rules

- Do not call `ElainaData.*` at top level in any module.
- Do not start timers, observers, UI setup, default restoration, or CDN selection at module import time if they read/write `ElainaData`.
- Only use `ElainaData.*` after `await ElainaData.init(context)` has completed.
- Prefer exporting functions/classes and calling them from `init(context)` or the exported `load()` function.
- Do not add `window.addEventListener("load", ...)` manually in `index.ts`; export `load()` and let Pengu register it after `init(context)`.
- PluginFS writes must use the current API shape:
  `context.fs.write(path, content, { append: false })`
  not `context.fs.write(path, content, false)`.
- `context.fs.ls(path)` may return `undefined`; use `await fs.ls(path) ?? []`.
- Do not merge legacy `window.DataStore` into PluginFS data on every startup. Migrate only when the PluginFS file does not exist or is empty.

## Safe pattern

```ts
export async function init(context: any) {
  await ElainaData.init(context);

  const { restoreDefaultDataStore } = await import("./src/services/backupAndRestoreDatastore");
  await restoreDefaultDataStore();

  const { Settings } = await import("./src/plugins/settings");
  Settings(context);
}

export async function load() {
  const { ElainaTheme } = await import("./src/ElainaTheme");
  await new ElainaTheme().main();
}
```

## Unsafe pattern

```ts
// BAD: runs during module import, before init(context)
ElainaData.set("start-time", Date.now());

if (ElainaData.get("Dev-mode")) {
  await import("./dev-mode");
}

window.addEventListener("load", () => {
  ElainaData.get("some-setting");
});
```
