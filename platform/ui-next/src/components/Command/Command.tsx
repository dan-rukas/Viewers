import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  Command as OldCommand,
  CommandDialog as OldCommandDialog,
  CommandInput as OldCommandInput,
  CommandList as OldCommandList,
  CommandEmpty as OldCommandEmpty,
  CommandGroup as OldCommandGroup,
  CommandItem as OldCommandItem,
  CommandShortcut as OldCommandShortcut,
  CommandSeparator as OldCommandSeparator,
} from './Command.old';

import {
  Command as NewCommand,
  CommandDialog as NewCommandDialog,
  CommandInput as NewCommandInput,
  CommandList as NewCommandList,
  CommandEmpty as NewCommandEmpty,
  CommandGroup as NewCommandGroup,
  CommandItem as NewCommandItem,
  CommandShortcut as NewCommandShortcut,
  CommandSeparator as NewCommandSeparator,
} from './Command.new';

const Command = React.forwardRef<
  React.ElementRef<typeof OldCommand>,
  React.ComponentPropsWithoutRef<typeof OldCommand>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommand : OldCommand;
  return <Comp {...props} ref={ref} />;
});
Command.displayName = 'Command';

const CommandDialog: typeof OldCommandDialog = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommandDialog : OldCommandDialog;
  return <Comp {...props} />;
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof OldCommandInput>,
  React.ComponentPropsWithoutRef<typeof OldCommandInput>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommandInput : OldCommandInput;
  return <Comp {...props} ref={ref} />;
});
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<
  React.ElementRef<typeof OldCommandList>,
  React.ComponentPropsWithoutRef<typeof OldCommandList>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommandList : OldCommandList;
  return <Comp {...props} ref={ref} />;
});
CommandList.displayName = 'CommandList';

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof OldCommandEmpty>,
  React.ComponentPropsWithoutRef<typeof OldCommandEmpty>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommandEmpty : OldCommandEmpty;
  return <Comp {...props} ref={ref} />;
});
CommandEmpty.displayName = 'CommandEmpty';

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof OldCommandGroup>,
  React.ComponentPropsWithoutRef<typeof OldCommandGroup>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommandGroup : OldCommandGroup;
  return <Comp {...props} ref={ref} />;
});
CommandGroup.displayName = 'CommandGroup';

const CommandItem = React.forwardRef<
  React.ElementRef<typeof OldCommandItem>,
  React.ComponentPropsWithoutRef<typeof OldCommandItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommandItem : OldCommandItem;
  return <Comp {...props} ref={ref} />;
});
CommandItem.displayName = 'CommandItem';

const CommandShortcut: typeof OldCommandShortcut = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommandShortcut : OldCommandShortcut;
  return <Comp {...props} />;
};
CommandShortcut.displayName = 'CommandShortcut';

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof OldCommandSeparator>,
  React.ComponentPropsWithoutRef<typeof OldCommandSeparator>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCommandSeparator : OldCommandSeparator;
  return <Comp {...props} ref={ref} />;
});
CommandSeparator.displayName = 'CommandSeparator';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
