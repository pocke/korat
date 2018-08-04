import { safeLoad } from 'js-yaml';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { forIn } from 'lodash';

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
    const config = safeLoad(content) as Configuration;
    forIn(config, value => {
      value.channels = value.channels.map(ch => ({
        ...ch,
        id: md5(ch.query),
      }));
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
