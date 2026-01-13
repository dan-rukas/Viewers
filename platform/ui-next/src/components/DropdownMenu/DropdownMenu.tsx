import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  DropdownMenu as OldDropdownMenu,
  DropdownMenuTrigger as OldDropdownMenuTrigger,
  DropdownMenuContent as OldDropdownMenuContent,
  DropdownMenuItem as OldDropdownMenuItem,
  DropdownMenuCheckboxItem as OldDropdownMenuCheckboxItem,
  DropdownMenuRadioItem as OldDropdownMenuRadioItem,
  DropdownMenuLabel as OldDropdownMenuLabel,
  DropdownMenuSeparator as OldDropdownMenuSeparator,
  DropdownMenuShortcut as OldDropdownMenuShortcut,
  DropdownMenuGroup as OldDropdownMenuGroup,
  DropdownMenuPortal as OldDropdownMenuPortal,
  DropdownMenuSub as OldDropdownMenuSub,
  DropdownMenuSubContent as OldDropdownMenuSubContent,
  DropdownMenuSubTrigger as OldDropdownMenuSubTrigger,
  DropdownMenuRadioGroup as OldDropdownMenuRadioGroup,
} from './DropdownMenu.old';

import {
  DropdownMenu as NewDropdownMenu,
  DropdownMenuTrigger as NewDropdownMenuTrigger,
  DropdownMenuContent as NewDropdownMenuContent,
  DropdownMenuItem as NewDropdownMenuItem,
  DropdownMenuCheckboxItem as NewDropdownMenuCheckboxItem,
  DropdownMenuRadioItem as NewDropdownMenuRadioItem,
  DropdownMenuLabel as NewDropdownMenuLabel,
  DropdownMenuSeparator as NewDropdownMenuSeparator,
  DropdownMenuShortcut as NewDropdownMenuShortcut,
  DropdownMenuGroup as NewDropdownMenuGroup,
  DropdownMenuPortal as NewDropdownMenuPortal,
  DropdownMenuSub as NewDropdownMenuSub,
  DropdownMenuSubContent as NewDropdownMenuSubContent,
  DropdownMenuSubTrigger as NewDropdownMenuSubTrigger,
  DropdownMenuRadioGroup as NewDropdownMenuRadioGroup,
} from './DropdownMenu.new';

const DropdownMenu: typeof OldDropdownMenu = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenu : OldDropdownMenu;
  return <Comp {...props} />;
};

const DropdownMenuTrigger: typeof OldDropdownMenuTrigger = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuTrigger : OldDropdownMenuTrigger;
  return <Comp {...props} />;
};

const DropdownMenuGroup: typeof OldDropdownMenuGroup = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuGroup : OldDropdownMenuGroup;
  return <Comp {...props} />;
};

const DropdownMenuPortal: typeof OldDropdownMenuPortal = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuPortal : OldDropdownMenuPortal;
  return <Comp {...props} />;
};

const DropdownMenuSub: typeof OldDropdownMenuSub = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuSub : OldDropdownMenuSub;
  return <Comp {...props} />;
};

const DropdownMenuRadioGroup: typeof OldDropdownMenuRadioGroup = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuRadioGroup : OldDropdownMenuRadioGroup;
  return <Comp {...props} />;
};

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof OldDropdownMenuContent>,
  React.ComponentPropsWithoutRef<typeof OldDropdownMenuContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuContent : OldDropdownMenuContent;
  return <Comp {...props} ref={ref} />;
});
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof OldDropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof OldDropdownMenuItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuItem : OldDropdownMenuItem;
  return <Comp {...props} ref={ref} />;
});
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof OldDropdownMenuCheckboxItem>,
  React.ComponentPropsWithoutRef<typeof OldDropdownMenuCheckboxItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuCheckboxItem : OldDropdownMenuCheckboxItem;
  return <Comp {...props} ref={ref} />;
});
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof OldDropdownMenuRadioItem>,
  React.ComponentPropsWithoutRef<typeof OldDropdownMenuRadioItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuRadioItem : OldDropdownMenuRadioItem;
  return <Comp {...props} ref={ref} />;
});
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof OldDropdownMenuLabel>,
  React.ComponentPropsWithoutRef<typeof OldDropdownMenuLabel>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuLabel : OldDropdownMenuLabel;
  return <Comp {...props} ref={ref} />;
});
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof OldDropdownMenuSeparator>,
  React.ComponentPropsWithoutRef<typeof OldDropdownMenuSeparator>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuSeparator : OldDropdownMenuSeparator;
  return <Comp {...props} ref={ref} />;
});
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

const DropdownMenuShortcut: typeof OldDropdownMenuShortcut = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuShortcut : OldDropdownMenuShortcut;
  return <Comp {...props} />;
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof OldDropdownMenuSubContent>,
  React.ComponentPropsWithoutRef<typeof OldDropdownMenuSubContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuSubContent : OldDropdownMenuSubContent;
  return <Comp {...props} ref={ref} />;
});
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof OldDropdownMenuSubTrigger>,
  React.ComponentPropsWithoutRef<typeof OldDropdownMenuSubTrigger>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDropdownMenuSubTrigger : OldDropdownMenuSubTrigger;
  return <Comp {...props} ref={ref} />;
});
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
