import * as path from 'path';
import * as fs from 'fs-extra';
import * as vscode from 'vscode';
import { singularize, pluralize } from 'inflected';

/**
 * Given a path like '/path/to/something.ext' and an append string '_extra',
 * returns '/path/to/something_extra.ext'
 */
export function appendWithoutExt(filename: string, append: string): string {
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);
  return path.join(path.dirname(filename), basename + append + ext);
}

export async function ensureDocument(filename: string) {
  await fs.ensureFile(filename);
  const document = await vscode.workspace.openTextDocument(filename);
  await vscode.window.showTextDocument(document);
}

/**
 * Given a name which could be a controller path, model path, fixture path, etc,
 * return the singular version of the entity name.
 */
export function singularEntityName(rawEntityName: string): string {
  const entityName = rawEntityName
  return singularize(uninflectedEntityName(entityName));
}

/**
 * Given a name which could be a controller path, model path, fixture path, etc,
 * return the plural version of the entity name.
 */
export function pluralEntityName(rawEntityPath: string): string {
  return pluralize(singularEntityName(rawEntityPath));
}

/**
 * Given a name which could be a controller path, model path, fixture path, etc,
 * return the uninflected version of the entity name (without singularizing or pluralizing).
 */
export function uninflectedEntityName(rawEntityName: string): string {
  return rawEntityName
    .replace(/^controllers\//, '')
    .replace(/^models\//, '')
    .replace(/^factories\//, '')
    .replace(/^fixtures\//, '')
    .replace(/_controller\.rb$/, '')
    .replace(/_spec\.rb$/, '')
    .replace(/_test\.rb$/, '')
    .replace(/_factory\.rb$/, '')
    .replace(/_factory\.rb$/, '')
    .replace(/_fixture\.yml$/, '')
    .replace(/\/?.*\//, '');
}