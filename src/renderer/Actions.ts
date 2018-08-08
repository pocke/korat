import { mergeStore, Store } from './Store';
import { Configuration } from '../share/configuration';
import { Item } from '../share/types/SearchIssuesResult';

export const updateConfiguration = (configuration: Configuration[]) => {
  mergeStore({ configuration });
};

export const updateIssues = (issues: Item[]) => {
  mergeStore({ issues });
};

export const selectChannel = (selectedChannelID: string, selectedEndpointID: string) => {
  mergeStore({ selectedChannelID, selectedEndpointID });
};

export const openEvent = (webviewURL: string) => {
  mergeStore({ webviewURL });
};

export const markAsRead = (id: number) => {
  const issues = Store.issues.map(issue => {
    if (issue.id === id) {
      return {
        ...issue,
        read: true,
      };
    } else {
      return issue;
    }
  });
  mergeStore({ issues });
};
