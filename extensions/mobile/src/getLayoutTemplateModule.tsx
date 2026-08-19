import React from 'react';
import MobileLayout from './MobileLayout';

export default function ({ servicesManager, extensionManager, commandsManager, hotkeysManager }) {
  function MobileLayoutWithServices(props) {
    return (
      <MobileLayout
        servicesManager={servicesManager}
        extensionManager={extensionManager}
        commandsManager={commandsManager}
        hotkeysManager={hotkeysManager}
        {...props}
      />
    );
  }

  return [
    {
      name: 'mobileLayout',
      id: 'mobileLayout',
      component: MobileLayoutWithServices,
    },
  ];
}
