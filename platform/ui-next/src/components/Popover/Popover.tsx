import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  Popover as OldPopover,
  PopoverTrigger as OldPopoverTrigger,
  PopoverContent as OldPopoverContent,
  PopoverAnchor as OldPopoverAnchor,
} from './Popover.old';

import {
  Popover as NewPopover,
  PopoverTrigger as NewPopoverTrigger,
  PopoverContent as NewPopoverContent,
  PopoverAnchor as NewPopoverAnchor,
} from './Popover.new';

const Popover: typeof OldPopover = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewPopover : OldPopover;
  return <Comp {...props} />;
};

const PopoverTrigger: typeof OldPopoverTrigger = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewPopoverTrigger : OldPopoverTrigger;
  return <Comp {...props} />;
};

const PopoverAnchor: typeof OldPopoverAnchor = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewPopoverAnchor : OldPopoverAnchor;
  return <Comp {...props} />;
};

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof OldPopoverContent>,
  React.ComponentPropsWithoutRef<typeof OldPopoverContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewPopoverContent : OldPopoverContent;
  return <Comp {...props} ref={ref} />;
});
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
