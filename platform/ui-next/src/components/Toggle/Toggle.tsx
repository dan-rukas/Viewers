import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Toggle as OldToggle, toggleVariants as oldToggleVariants } from './Toggle.old';
import { Toggle as NewToggle, toggleVariants as newToggleVariants } from './Toggle.new';

type ToggleProps = React.ComponentPropsWithoutRef<typeof OldToggle>;

/**
 * Toggle proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Toggle = React.forwardRef<React.ElementRef<typeof OldToggle>, ToggleProps>(
  (props, ref) => {
    const version = useUINextVersion();
    const Comp = version === 'new' ? NewToggle : OldToggle;
    return <Comp {...props} ref={ref} />;
  }
);
Toggle.displayName = 'Toggle';

/**
 * Default toggleVariants export - uses old implementation for backwards compatibility.
 */
export const toggleVariants = oldToggleVariants;

/**
 * Explicit old toggleVariants export.
 */
export const toggleVariantsOld = oldToggleVariants;

/**
 * Explicit new toggleVariants export.
 */
export const toggleVariantsNew = newToggleVariants;
