import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  Tooltip as OldTooltip,
  TooltipTrigger as OldTooltipTrigger,
  TooltipContent as OldTooltipContent,
  TooltipProvider as OldTooltipProvider,
} from './Tooltip.old';

import {
  Tooltip as NewTooltip,
  TooltipTrigger as NewTooltipTrigger,
  TooltipContent as NewTooltipContent,
  TooltipProvider as NewTooltipProvider,
} from './Tooltip.new';

const TooltipProvider: typeof OldTooltipProvider = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewTooltipProvider : OldTooltipProvider;
  return <Comp {...props} />;
};

const Tooltip: typeof OldTooltip = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewTooltip : OldTooltip;
  return <Comp {...props} />;
};

const TooltipTrigger: typeof OldTooltipTrigger = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewTooltipTrigger : OldTooltipTrigger;
  return <Comp {...props} />;
};

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof OldTooltipContent>,
  React.ComponentPropsWithoutRef<typeof OldTooltipContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewTooltipContent : OldTooltipContent;
  return <Comp {...props} ref={ref} />;
});
TooltipContent.displayName = 'TooltipContent';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
