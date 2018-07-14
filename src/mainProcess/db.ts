import path from 'path';
import Datastore from 'nedb';

const HOME = process.env.HOME as string;

export const DBsession: {
  notifications: Nedb;
} = {} as any;

export const init = () => {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(HOME, '.cache/korat/notifications.nedb');
    DBsession.notifications = new Datastore({ filename: dbPath });
    DBsession.notifications.loadDatabase((err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
