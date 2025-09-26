import { SwitchFile } from '../types';
import { RailsFile } from '../rails-file';
import { RailsWorkspace } from '../rails-workspace';
import * as path from 'path';

export async function factoryMaker(
  railsFile: RailsFile,
  workspace: RailsWorkspace
): Promise<SwitchFile[]> {
  const hasSpecs = await workspace.hasSpecs();

  // Only create factories if we have a spec directory
  if (!hasSpecs) {
    return [];
  }

  const factoriesPath = path.join(workspace.specPath, 'factories');

  return railsFile.possibleModelNames().map(modelName => {
    const basename = modelName + '.rb';

    return {
      filename: path.join(factoriesPath, basename),
      title: 'Factory ' + basename,
      type: 'factory',
    };
  });
}