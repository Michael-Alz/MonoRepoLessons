import blessed from 'blessed';
import { DataRepository } from '../model/services/DataRepository.js';
import { JsonStorageAdapter } from '../model/storage/json.adapter.js';
import { CommandRouter } from '../controller/CommandRouter.js';
import { Task } from '../model/entities.js';

type PanelRefs = {
  screen: blessed.Widgets.Screen;
  layout: blessed.Widgets.BoxElement;
  taskList: blessed.Widgets.ListElement;
  detail: blessed.Widgets.BoxElement;
  status: blessed.Widgets.BoxElement;
  command: blessed.Widgets.TextboxElement;
};

export async function launchUI(): Promise<void> {
  const storage = new JsonStorageAdapter();
  const repo = new DataRepository(storage);
  const init = await repo.initialize();
  if (!init.success) throw init.error;
  const router = new CommandRouter(repo);

  const screen = blessed.screen({
    smartCSR: true,
    title: 'todo',
  });

  const layout = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  });
  screen.append(layout);

  const status = blessed.box({
    bottom: 0,
    left: 0,
    height: 1,
    width: '100%',
    tags: true,
    style: { fg: 'white', bg: 'blue' },
    content: ' Ready '
  });
  screen.append(status);

  const command = blessed.textbox({
    bottom: 1,
    left: 0,
    height: 1,
    width: '100%',
    inputOnFocus: true,
    style: { fg: 'white', bg: 'black' },
    keys: true,
    mouse: true,
    border: { type: 'line' },
    hidden: true,
  });
  screen.append(command);

  // Panels
  const taskList = blessed.list({
    parent: layout,
    top: 0,
    left: 0,
    width: '50%',
    height: '100%-2',
    label: ' Tasks ',
    border: { type: 'line' },
    keys: true,
    vi: true,
    mouse: true,
    style: {
      selected: { bg: 'blue' },
    },
  });

  const detail = blessed.box({
    parent: layout,
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%-2',
    label: ' Detail ',
    border: { type: 'line' },
    tags: true,
    scrollable: true,
    keys: true,
    mouse: true,
    vi: true,
  });

  const refs: PanelRefs = { screen, layout, taskList, detail, status, command };

  const refreshTasks = () => {
    const results = repo.getSearchService().search({});
    const items = results.map(r => `${r.task.completedAt ? '✔' : ' '} [p${r.task.priority}] ${r.task.title}`);
    taskList.setItems(items);
    (taskList as any).__ids = results.map(r => r.task.id);
    screen.render();
  };

  const showDetail = (task: Task | undefined) => {
    if (!task) {
      detail.setContent('');
      screen.render();
      return;
    }
    const lines = [
      `{bold}${task.title}{/bold}`,
      '',
      `Status: ${task.status}`,
      `Priority: ${task.priority}`,
      task.dueAt ? `Due: ${task.dueAt}` : '',
      '',
      task.notes || '',
    ].filter(Boolean);
    detail.setContent(lines.join('\n'));
    screen.render();
  };

  const selectTaskByIndex = (idx: number) => {
    const ids: string[] = (taskList as any).__ids || [];
    const id = ids[idx];
    const task = id ? repo.tasks.byId(id as any) : undefined;
    showDetail(task);
  };

  // Key bindings
  screen.key(['q', 'C-c'], () => process.exit(0));
  screen.key([':'], () => {
    command.setValue('');
    command.show();
    status.setContent(' Command mode ');
    command.focus();
    screen.render();
  });

  command.key(['escape'], () => {
    command.hide();
    status.setContent(' Ready ');
    taskList.focus();
    screen.render();
  });

  command.on('submit', async (value: string) => {
    command.hide();
    status.setContent(` :${value}`);
    screen.render();
    const args = ['task'];
    // Simple split: first token as main verb maps to task router verbs
    // For richer parsing, reuse CommandRouter parse from CLI-string in the future
    try {
      const parts = value.trim().split(/\s+/);
      const res = await router.dispatch(parts);
      if (res.code === 0) {
        refreshTasks();
      } else {
        status.setContent(' Error running command ');
      }
    } catch (e) {
      status.setContent(' Command error ');
    } finally {
      taskList.focus();
      screen.render();
    }
  });

  taskList.on('select', (_el, idx) => selectTaskByIndex(idx));
  taskList.key(['enter', 'e'], () => {
    const idx = taskList.selected;
    selectTaskByIndex(idx);
  });
  taskList.key(['x'], () => {
    const idx = taskList.selected;
    const ids: string[] = (taskList as any).__ids || [];
    const id = ids[idx];
    if (!id) return;
    const result = repo.tasks.toggleComplete(id as any);
    if (result.success) {
      status.setContent(' Toggled ');
      repo.save();
      refreshTasks();
      selectTaskByIndex(idx);
    } else {
      status.setContent(' Toggle failed ');
    }
  });

  // Storage watcher → reload
  storage.startWatching(async () => {
    const loaded = await storage.load();
    if (loaded.success) {
      repo.setDataStore(loaded.data);
      status.setContent(' Reloaded external changes ');
      refreshTasks();
    }
  });

  // Initial focus and data
  refreshTasks();
  taskList.focus();
  screen.render();
}


