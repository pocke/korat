import { safeLoad } from 'js-yaml';
import util from 'util';
import fs from 'fs';
import path from 'path';
import Electron, { ipcMain } from 'electron';
import Datastore from 'nedb';

import { Configuration } from '../share/configuration';
import { requestConfiguration, responseConfiguration } from '../share/ipcChannels';

export default async () => {
  ipcMain.on(requestConfiguration, async (event: Electron.Event) => {
    const conf = await loadConfiguration();
    event.sender.send(responseConfiguration, conf);
  });
  return await initDB();
};

const HOME = process.env.HOME as string;

const loadConfiguration = async () => {
  const configPath = path.join(HOME, '.config/korat.yaml');

  if (!(await fileExist(configPath))) {
    // TODO
    throw `${configPath} does not exist! Create it.`;
  }

  const content = (await util.promisify(fs.readFile)(configPath)).toString();
  return safeLoad(content) as Configuration;
};

const DBsession: {
  events?: Nedb;
} = {};

const initDB = async () => {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(HOME, '.cache/korat/events.nedb');
    DBsession.events = new Datastore({ filename: dbPath });
    DBsession.events.loadDatabase((err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
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
