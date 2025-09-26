import { SwitchFile } from '../types';
import { RailsFile } from '../rails-file';
import { RailsWorkspace, relativeToAppDir } from '../rails-workspace';
import { singularEntityName } from '../path-utils';
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
  const singularEntity = singularEntityName(controllerPath);
  const requestSpecPath = singularEntity + '_requests_spec.rb';

  return [
    {
      filename: path.join(workspace.specPath, 'requests', requestSpecPath),
      title: 'Request spec',
      type: 'spec',
    },
  ];
}