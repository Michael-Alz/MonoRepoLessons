import { DataRepository } from '../model/services/DataRepository.js';
import { ID } from '../core/types.js';

export type CommandResult = { code: number };

export class CommandRouter {
  constructor(private repo: DataRepository) {}

  async dispatch(argv: string[]): Promise<CommandResult> {
    const [cmd, ...rest] = argv;
    switch (cmd) {
      case 'help':
      case undefined:
        this.printHelp();
        return { code: 0 };
      case 'version':
        this.printVersion();
        return { code: 0 };
      case 'task':
      case 't':
        return await this.handleTask(rest);
      case 'project':
      case 'p':
        return await this.handleProject(rest);
      case 'tag':
        return await this.handleTag(rest);
      case 'search':
      case 's':
        return await this.handleSearch(rest);
      default:
        console.error(`Unknown command: ${cmd}`);
        this.printHelp();
        return { code: 1 };
    }
  }

  private printHelp(): void {
    console.log(`
todo - CLI interface

Usage:
  todo help                     Show help
  todo version                  Show version

Tasks:
  todo task add <title> [--notes "..."] [--priority 1-5] [--due YYYY-MM-DD] [--project <id>] [--tag <id> ...]
  todo task list [--status todo|doing|done|archived] [--project <id>] [--tag <id> ...] [--sort field:asc|desc]
  todo task update <id> [--title "..."] [--notes "..."] [--priority 1-5] [--status <status>] [--due YYYY-MM-DD] [--project <id>]
  todo task toggle <id>
  todo task remove <id>

Projects:
  todo project add <name> [--order N] [--parent <id>]
  todo project list
  todo project update <id> [--name "..."] [--order N] [--parent <id>]
  todo project remove <id>

Tags:
  todo tag add <name> [--color red|#rrggbb]
  todo tag list
  todo tag update <id> [--name "..."] [--color <color>]
  todo tag remove <id>

Search:
  todo search <query>
`);
  }

  private printVersion(): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pkg = require('../../package.json');
    console.log(pkg.version || '0.0.0');
  }

  private parseFlags(args: string[]): Record<string, string | string[] | boolean> {
    const flags: Record<string, any> = {};
    let i = 0;
    while (i < args.length) {
      const token = args[i];
      if (token.startsWith('--')) {
        const key = token.slice(2);
        const next = args[i + 1];
        if (!next || next.startsWith('--')) {
          flags[key] = true;
          i += 1;
        } else {
          // Support multi-value flags like --tag a --tag b
          if (flags[key] === undefined) {
            flags[key] = next;
          } else if (Array.isArray(flags[key])) {
            flags[key].push(next);
          } else {
            flags[key] = [flags[key], next];
          }
          i += 2;
        }
      } else {
        // Positional argument
        if (!flags._) flags._ = [];
        flags._.push(token);
        i += 1;
      }
    }
    return flags;
  }

  private async handleTask(args: string[]): Promise<CommandResult> {
    const [sub, ...rest] = args;
    const f = this.parseFlags(rest);
    switch (sub) {
      case 'add': {
        const title = (f._?.[0] as string) || '';
        const priority = f.priority ? Number(f.priority) : undefined;
        const dueAt = f.due ? new Date(String(f.due)).toISOString() : undefined;
        const projectId = (f.project as string) || undefined;
        const tags = f.tag ? (Array.isArray(f.tag) ? (f.tag as string[]) : [String(f.tag)]) : undefined;
        const result = this.repo.tasks.create({
          title,
          notes: (f.notes as string) || undefined,
          priority: priority as any,
          dueAt,
          projectId,
          tags,
        });
        if (result.success) {
          console.log(result.data.id);
          await this.repo.save();
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      case 'list': {
        const statuses = f.status ? String(f.status).split(',') as any : undefined;
        const projectId = (f.project as string) || undefined;
        const tags = f.tag ? (Array.isArray(f.tag) ? (f.tag as string[]) : [String(f.tag)]) : undefined;
        let sort: any;
        if (f.sort) {
          const [field, dir] = String(f.sort).split(':');
          sort = { field, dir: (dir as any) || 'asc' };
        }
        const results = this.repo.getSearchService().search({
          statuses,
          projectId,
          tags,
          sort,
        });
        results.forEach((r) => {
          console.log(`${r.task.id} | [${r.task.status}] p${r.task.priority} ${r.task.title}`);
        });
        return { code: 0 };
      }
      case 'update': {
        const id = (f._?.[0] as ID);
        const payload: any = { id };
        if (f.title) payload.title = f.title;
        if (f.notes) payload.notes = f.notes;
        if (f.priority) payload.priority = Number(f.priority);
        if (f.status) payload.status = f.status;
        if (f.due) payload.dueAt = new Date(String(f.due)).toISOString();
        if (f.project) payload.projectId = f.project;
        if (f.tag) payload.tags = Array.isArray(f.tag) ? f.tag : [f.tag];
        const result = this.repo.tasks.update(payload);
        if (result.success) {
          await this.repo.save();
          console.log(result.data.id);
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      case 'toggle': {
        const id = (this.parseFlags(rest)._?.[0] as ID);
        const result = this.repo.tasks.toggleComplete(id);
        if (result.success) {
          await this.repo.save();
          console.log(result.data.status);
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      case 'remove': {
        const id = (this.parseFlags(rest)._?.[0] as ID);
        const result = this.repo.tasks.remove(id);
        if (result.success) {
          await this.repo.save();
          console.log('ok');
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      default:
        console.error('Unknown task subcommand');
        this.printHelp();
        return { code: 1 };
    }
  }

  private async handleProject(args: string[]): Promise<CommandResult> {
    const [sub, ...rest] = args;
    const f = this.parseFlags(rest);
    switch (sub) {
      case 'add': {
        const name = (f._?.[0] as string) || '';
        const order = f.order ? Number(f.order) : undefined;
        const parentId = (f.parent as string) || undefined;
        const result = this.repo.projects.create({ name, order, parentId });
        if (result.success) {
          await this.repo.save();
          console.log(result.data.id);
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      case 'list': {
        const projects = this.repo.projects.all();
        projects.forEach((p) => console.log(`${p.id} | ${p.name}`));
        return { code: 0 };
      }
      case 'update': {
        const id = (f._?.[0] as ID);
        const payload: any = { id };
        if (f.name) payload.name = f.name;
        if (f.order) payload.order = Number(f.order);
        if (f.parent) payload.parentId = f.parent;
        const result = this.repo.projects.update(payload);
        if (result.success) {
          await this.repo.save();
          console.log(result.data.id);
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      case 'remove': {
        const id = (this.parseFlags(rest)._?.[0] as ID);
        const result = this.repo.projects.remove(id);
        if (result.success) {
          await this.repo.save();
          console.log('ok');
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      default:
        console.error('Unknown project subcommand');
        this.printHelp();
        return { code: 1 };
    }
  }

  private async handleTag(args: string[]): Promise<CommandResult> {
    const [sub, ...rest] = args;
    const f = this.parseFlags(rest);
    switch (sub) {
      case 'add': {
        const name = (f._?.[0] as string) || '';
        const color = (f.color as string) || undefined;
        const result = this.repo.tags.create({ name, color });
        if (result.success) {
          await this.repo.save();
          console.log(result.data.id);
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      case 'list': {
        const tags = this.repo.tags.all();
        tags.forEach((t) => console.log(`${t.id} | ${t.name} ${t.color ? '(' + t.color + ')' : ''}`));
        return { code: 0 };
      }
      case 'update': {
        const id = (f._?.[0] as ID);
        const payload: any = { id };
        if (f.name) payload.name = f.name;
        if (f.color) payload.color = f.color;
        const result = this.repo.tags.update(payload);
        if (result.success) {
          await this.repo.save();
          console.log(result.data.id);
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      case 'remove': {
        const id = (this.parseFlags(rest)._?.[0] as ID);
        const result = this.repo.tags.remove(id);
        if (result.success) {
          await this.repo.save();
          console.log('ok');
          return { code: 0 };
        }
        console.error(result.error.message);
        return { code: 1 };
      }
      default:
        console.error('Unknown tag subcommand');
        this.printHelp();
        return { code: 1 };
    }
  }

  private async handleSearch(args: string[]): Promise<CommandResult> {
    const query = args.join(' ').trim();
    const svc = this.repo.getSearchService();
    const results = svc.searchByString(query);
    results.forEach((r) => {
      console.log(`${r.task.id} | [${r.task.status}] p${r.task.priority} ${r.task.title}`);
    });
    return { code: 0 };
  }
}


