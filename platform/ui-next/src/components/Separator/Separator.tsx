import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Separator as OldSeparator } from './Separator.old';
import { Separator as NewSeparator } from './Separator.new';

/**
 * Separator proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Separator = React.forwardRef<
  React.ElementRef<typeof OldSeparator>,
  React.ComponentPropsWithoutRef<typeof OldSeparator>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSeparator : OldSeparator;
  return <Comp {...props} ref={ref} />;
});
Separator.displayName = 'Separator';
