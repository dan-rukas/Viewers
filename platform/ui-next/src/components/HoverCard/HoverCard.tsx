import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  HoverCard as OldHoverCard,
  HoverCardTrigger as OldHoverCardTrigger,
  HoverCardContent as OldHoverCardContent,
} from './HoverCard.old';

import {
  HoverCard as NewHoverCard,
  HoverCardTrigger as NewHoverCardTrigger,
  HoverCardContent as NewHoverCardContent,
} from './HoverCard.new';

const HoverCard: typeof OldHoverCard = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewHoverCard : OldHoverCard;
  return <Comp {...props} />;
};

const HoverCardTrigger: typeof OldHoverCardTrigger = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewHoverCardTrigger : OldHoverCardTrigger;
  return <Comp {...props} />;
};

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof OldHoverCardContent>,
  React.ComponentPropsWithoutRef<typeof OldHoverCardContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewHoverCardContent : OldHoverCardContent;
  return <Comp {...props} ref={ref} />;
});
HoverCardContent.displayName = 'HoverCardContent';

export { HoverCard, HoverCardTrigger, HoverCardContent };
