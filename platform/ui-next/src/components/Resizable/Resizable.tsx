'use client';

import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  ResizablePanelGroup as OldResizablePanelGroup,
  ResizablePanel as OldResizablePanel,
  ResizableHandle as OldResizableHandle,
} from './Resizable.old';

import {
  ResizablePanelGroup as NewResizablePanelGroup,
  ResizablePanel as NewResizablePanel,
  ResizableHandle as NewResizableHandle,
} from './Resizable.new';

const ResizablePanelGroup: typeof OldResizablePanelGroup = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewResizablePanelGroup : OldResizablePanelGroup;
  return <Comp {...props} />;
};

const ResizablePanel: typeof OldResizablePanel = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewResizablePanel : OldResizablePanel;
  return <Comp {...props} />;
};

const ResizableHandle: typeof OldResizableHandle = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewResizableHandle : OldResizableHandle;
  return <Comp {...props} />;
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
