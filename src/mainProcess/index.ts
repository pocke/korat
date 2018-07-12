import { safeLoad } from 'js-yaml';
import util from 'util';
import fs from 'fs';
import path from 'path';
import Electron, { ipcMain } from 'electron';

import Configuration from '../share/configuration';
import { requestConfiguration, responseConfiguration } from '../share/ipcChannels';

export default async () => {
  const conf = await loadConfiguration();
  ipcMain.once(requestConfiguration, (event: Electron.Event) => {
    event.sender.send(responseConfiguration, conf);
  });
};

const loadConfiguration = async () => {
  const home = process.env.HOME as string;
  const configPath = path.join(home, '.config/korat.yaml');

  if (!(await fileExist(configPath))) {
    // TODO
    throw `${configPath} does not exist! Create it.`;
  }

  const content = (await util.promisify(fs.readFile)(configPath)).toString();
  return safeLoad(content) as Configuration;
};

const fileExist = async (filePath: string) => {
  try {
    await util.promisify(fs.stat)(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
};
