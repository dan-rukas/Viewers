import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  ContextMenu as OldContextMenu,
  ContextMenuTrigger as OldContextMenuTrigger,
  ContextMenuContent as OldContextMenuContent,
  ContextMenuItem as OldContextMenuItem,
  ContextMenuCheckboxItem as OldContextMenuCheckboxItem,
  ContextMenuRadioItem as OldContextMenuRadioItem,
  ContextMenuLabel as OldContextMenuLabel,
  ContextMenuSeparator as OldContextMenuSeparator,
  ContextMenuShortcut as OldContextMenuShortcut,
  ContextMenuGroup as OldContextMenuGroup,
  ContextMenuPortal as OldContextMenuPortal,
  ContextMenuSub as OldContextMenuSub,
  ContextMenuSubContent as OldContextMenuSubContent,
  ContextMenuSubTrigger as OldContextMenuSubTrigger,
  ContextMenuRadioGroup as OldContextMenuRadioGroup,
} from './ContextMenu.old';

import {
  ContextMenu as NewContextMenu,
  ContextMenuTrigger as NewContextMenuTrigger,
  ContextMenuContent as NewContextMenuContent,
  ContextMenuItem as NewContextMenuItem,
  ContextMenuCheckboxItem as NewContextMenuCheckboxItem,
  ContextMenuRadioItem as NewContextMenuRadioItem,
  ContextMenuLabel as NewContextMenuLabel,
  ContextMenuSeparator as NewContextMenuSeparator,
  ContextMenuShortcut as NewContextMenuShortcut,
  ContextMenuGroup as NewContextMenuGroup,
  ContextMenuPortal as NewContextMenuPortal,
  ContextMenuSub as NewContextMenuSub,
  ContextMenuSubContent as NewContextMenuSubContent,
  ContextMenuSubTrigger as NewContextMenuSubTrigger,
  ContextMenuRadioGroup as NewContextMenuRadioGroup,
} from './ContextMenu.new';

const ContextMenu: typeof OldContextMenu = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenu : OldContextMenu;
  return <Comp {...props} />;
};

const ContextMenuTrigger: typeof OldContextMenuTrigger = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuTrigger : OldContextMenuTrigger;
  return <Comp {...props} />;
};

const ContextMenuGroup: typeof OldContextMenuGroup = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuGroup : OldContextMenuGroup;
  return <Comp {...props} />;
};

const ContextMenuPortal: typeof OldContextMenuPortal = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuPortal : OldContextMenuPortal;
  return <Comp {...props} />;
};

const ContextMenuSub: typeof OldContextMenuSub = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuSub : OldContextMenuSub;
  return <Comp {...props} />;
};

const ContextMenuRadioGroup: typeof OldContextMenuRadioGroup = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuRadioGroup : OldContextMenuRadioGroup;
  return <Comp {...props} />;
};

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof OldContextMenuContent>,
  React.ComponentPropsWithoutRef<typeof OldContextMenuContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuContent : OldContextMenuContent;
  return <Comp {...props} ref={ref} />;
});
ContextMenuContent.displayName = 'ContextMenuContent';

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof OldContextMenuItem>,
  React.ComponentPropsWithoutRef<typeof OldContextMenuItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuItem : OldContextMenuItem;
  return <Comp {...props} ref={ref} />;
});
ContextMenuItem.displayName = 'ContextMenuItem';

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof OldContextMenuCheckboxItem>,
  React.ComponentPropsWithoutRef<typeof OldContextMenuCheckboxItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuCheckboxItem : OldContextMenuCheckboxItem;
  return <Comp {...props} ref={ref} />;
});
ContextMenuCheckboxItem.displayName = 'ContextMenuCheckboxItem';

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof OldContextMenuRadioItem>,
  React.ComponentPropsWithoutRef<typeof OldContextMenuRadioItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuRadioItem : OldContextMenuRadioItem;
  return <Comp {...props} ref={ref} />;
});
ContextMenuRadioItem.displayName = 'ContextMenuRadioItem';

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof OldContextMenuLabel>,
  React.ComponentPropsWithoutRef<typeof OldContextMenuLabel>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuLabel : OldContextMenuLabel;
  return <Comp {...props} ref={ref} />;
});
ContextMenuLabel.displayName = 'ContextMenuLabel';

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof OldContextMenuSeparator>,
  React.ComponentPropsWithoutRef<typeof OldContextMenuSeparator>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuSeparator : OldContextMenuSeparator;
  return <Comp {...props} ref={ref} />;
});
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

const ContextMenuShortcut: typeof OldContextMenuShortcut = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuShortcut : OldContextMenuShortcut;
  return <Comp {...props} />;
};
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof OldContextMenuSubContent>,
  React.ComponentPropsWithoutRef<typeof OldContextMenuSubContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuSubContent : OldContextMenuSubContent;
  return <Comp {...props} ref={ref} />;
});
ContextMenuSubContent.displayName = 'ContextMenuSubContent';

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof OldContextMenuSubTrigger>,
  React.ComponentPropsWithoutRef<typeof OldContextMenuSubTrigger>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewContextMenuSubTrigger : OldContextMenuSubTrigger;
  return <Comp {...props} ref={ref} />;
});
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
