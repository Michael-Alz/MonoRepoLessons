#!/usr/bin/env node

import { DataRepository } from '../model/services/DataRepository.js';
import { JsonStorageAdapter } from '../model/storage/json.adapter.js';
import { CommandRouter } from '../controller/CommandRouter.js';
import { launchUI } from '../view/ui.js';

async function main() {
  const storage = new JsonStorageAdapter();
  const repo = new DataRepository(storage);
  const init = await repo.initialize();
  if (!init.success) {
    console.error('Failed to initialize:', init.error.message);
    process.exit(1);
  }

  const args = process.argv.slice(2);
  if (args[0] === 'ui') {
    await launchUI();
    return;
  }
  const router = new CommandRouter(repo);
  const res = await router.dispatch(args);
  process.exit(res.code);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
