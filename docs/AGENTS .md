# AI Agent Instructions

Before editing PluginFS datastore code, read `docs/PLUGINFS_DATASTORE_RULES.md`.

Critical rule: never call `ElainaData.get/set/has/remove` during module import. Only use ElainaData after `await ElainaData.init(context)` has completed.