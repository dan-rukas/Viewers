import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Switch as OldSwitch } from './Switch.old';
import { Switch as NewSwitch } from './Switch.new';

/**
 * Switch proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Switch = React.forwardRef<
  React.ElementRef<typeof OldSwitch>,
  React.ComponentPropsWithoutRef<typeof OldSwitch>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSwitch : OldSwitch;
  return <Comp {...props} ref={ref} />;
});
Switch.displayName = 'Switch';
