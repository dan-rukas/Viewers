import StateSyncService from './StateSyncService';

const StateSyncServiceRegistration = {
  name: 'stateSyncService',
  create: ({ configuration = {}, commandsManager }) => {
    return new StateSyncService({ configuration, commandsManager });
  },
};

export default StateSyncServiceRegistration;
export { StateSyncService, StateSyncServiceRegistration };
