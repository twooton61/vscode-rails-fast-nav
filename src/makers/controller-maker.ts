import { RailsFile } from '../rails-file';
import { RailsWorkspace } from '../rails-workspace';
import { SwitchFile } from '../types';
import * as inflected from 'inflected';
const { pluralize } = inflected;
import * as path from 'path';
import * as glob from 'glob';

async function findControllersInSubdirectories(
  workspace: RailsWorkspace
): Promise<RailsFile[]> {
  const controllerFiles = await new Promise<string[]>((res, rej) =>
    glob(workspace.controllersPath + '/**/*_controller.rb', (err, files) => {
      if (err) return rej(err);
      res(files);
    })
  );

  return controllerFiles.map<RailsFile>(filename => {
    return new RailsFile(filename, '', []);
  });
}

export async function controllerMaker(
  railsFile: RailsFile,
  workspace: RailsWorkspace
): Promise<SwitchFile[]> {
  const controllers = await findControllersInSubdirectories(workspace);
  const possibleModelNames = railsFile.possibleModelNames();

  // Find existing controllers that match our model names
  const matchedControllers = controllers.filter(controller => {
    const controllerBaseName = controller.basename
                                         .replace('_controller', '')
                                         .replace('.rb', '');

    return possibleModelNames.some(modelName => {
      // Simple pluralization: add 's' to the end
      return pluralize(modelName) === controllerBaseName;
    });
  });

  if (matchedControllers.length > 0) {
    return matchedControllers.map(controller => ({
      checkedExists: true,
      filename: controller.filename,
      title: 'Controller ' + controller.basename + '.rb',
      type: 'controller',
    }));
  }

  // Fallback to the original behavior for creating new controllers
  return railsFile.possibleModelNames().map(possibleModelName => {
    const controllerName = pluralize(possibleModelName) + '_controller.rb';
    return {
      checkedExists: false,
      filename: path.join(
        workspace.controllersPath,
        railsFile.module,
        controllerName
      ),
      title: 'Controller ' + controllerName,
      type: 'controller',
    };
  });
}
