import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { ScrollArea as OldScrollArea, ScrollBar as OldScrollBar } from './ScrollArea.old';
import { ScrollArea as NewScrollArea, ScrollBar as NewScrollBar } from './ScrollArea.new';

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof OldScrollArea>,
  React.ComponentPropsWithoutRef<typeof OldScrollArea>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewScrollArea : OldScrollArea;
  return <Comp {...props} ref={ref} />;
});
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof OldScrollBar>,
  React.ComponentPropsWithoutRef<typeof OldScrollBar>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewScrollBar : OldScrollBar;
  return <Comp {...props} ref={ref} />;
});
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
