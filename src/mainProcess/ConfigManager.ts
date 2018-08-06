import { safeLoad } from 'js-yaml';
import util from 'util';
import fs from 'fs';
import path from 'path';
import uuid from 'uuid/v4';

import { Configuration } from '../share/configuration';
import { md5 } from '../share/utils';

const HOME = process.env.HOME as string;

class ConfigManager {
  constructor() {}

  async load() {
    const configPath = path.join(HOME, '.config/korat.yaml');

    if (!(await fileExist(configPath))) {
      // TODO
      throw `${configPath} does not exist! Create it.`;
    }

    const content = (await util.promisify(fs.readFile)(configPath)).toString();
    const config = safeLoad(content) as Configuration[];
    config.forEach(c => {
      if (!c.id) {
        c.id = uuid();
      }
      c.channels = c.channels.map(ch => {
        const q = (ch.query as any) as string | string[];
        let query;
        if (q instanceof Array) {
          query = q;
        } else {
          query = [q];
        }
        return {
          ...ch,
          id: md5(query.join('\n') + c.displayName),
          query,
        };
      });
    });
    return config;
  }
}

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

export default new ConfigManager();
