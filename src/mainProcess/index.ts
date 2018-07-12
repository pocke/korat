import { safeLoad } from 'js-yaml';
import util from 'util';
import fs from 'fs';
import path from 'path';

interface Configuration {
  [key: string]: {
    urlBase: string;
    apiUrlBase: string;
    accessToken: string;
    categories: {
      displayName: string;
      id: number;
      order: number;
      query: {
        participating?: boolean;
      };
    }[];
  };
}

export default async () => {
  const conf = await loadConfiguration();
  console.log(conf);
};

const loadConfiguration = async () => {
  const home = process.env.HOME as string;
  const configPath = path.join(home, '.config/korat.yaml');

  if (!(await fileExist(configPath))) {
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
