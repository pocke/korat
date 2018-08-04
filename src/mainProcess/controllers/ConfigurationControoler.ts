import ConfigManager from '../ConfigManager';

export const configShow = async () => {
  return ConfigManager.load();
};
