import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Label as OldLabel } from './Label.old';
import { Label as NewLabel } from './Label.new';

/**
 * Label proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Label = React.forwardRef<
  React.ElementRef<typeof OldLabel>,
  React.ComponentPropsWithoutRef<typeof OldLabel>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewLabel : OldLabel;
  return <Comp {...props} ref={ref} />;
});
Label.displayName = 'Label';
