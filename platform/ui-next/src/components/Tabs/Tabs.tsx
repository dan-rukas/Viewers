import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  Tabs as OldTabs,
  TabsList as OldTabsList,
  TabsTrigger as OldTabsTrigger,
  TabsContent as OldTabsContent,
} from './Tabs.old';

import {
  Tabs as NewTabs,
  TabsList as NewTabsList,
  TabsTrigger as NewTabsTrigger,
  TabsContent as NewTabsContent,
} from './Tabs.new';

const Tabs: typeof OldTabs = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewTabs : OldTabs;
  return <Comp {...props} />;
};

const TabsList = React.forwardRef<
  React.ElementRef<typeof OldTabsList>,
  React.ComponentPropsWithoutRef<typeof OldTabsList>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewTabsList : OldTabsList;
  return <Comp {...props} ref={ref} />;
});
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof OldTabsTrigger>,
  React.ComponentPropsWithoutRef<typeof OldTabsTrigger>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewTabsTrigger : OldTabsTrigger;
  return <Comp {...props} ref={ref} />;
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  React.ElementRef<typeof OldTabsContent>,
  React.ComponentPropsWithoutRef<typeof OldTabsContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewTabsContent : OldTabsContent;
  return <Comp {...props} ref={ref} />;
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
