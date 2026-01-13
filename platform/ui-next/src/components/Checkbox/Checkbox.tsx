import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Checkbox as OldCheckbox } from './Checkbox.old';
import { Checkbox as NewCheckbox } from './Checkbox.new';

/**
 * Checkbox proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof OldCheckbox>,
  React.ComponentPropsWithoutRef<typeof OldCheckbox>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCheckbox : OldCheckbox;
  return <Comp {...props} ref={ref} />;
});
Checkbox.displayName = 'Checkbox';
