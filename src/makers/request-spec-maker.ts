import { SwitchFile } from '../types';
import { RailsFile } from '../rails-file';
import { RailsWorkspace, relativeToAppDir } from '../rails-workspace';
import * as path from 'path';

export function requestSpecMaker(
  railsFile: RailsFile,
  workspace: RailsWorkspace
): SwitchFile[] {
  // Only generate request specs for controllers
  if (!railsFile.isController()) {
    return [];
  }

  const controllerPath = relativeToAppDir(workspace, railsFile.filename);
  // Convert controllers/some_controller.rb to some_request_spec.rb
  const requestSpecPath = controllerPath
    .replace(/^controllers\//, '')
    .replace(/_controller\.rb$/, '_requests_spec.rb')
    .replace(/\/?.*\//, '');

  return [
    {
      filename: path.join(workspace.specPath, 'requests', requestSpecPath),
      title: 'Request spec',
      type: 'spec',
    },
  ];
}