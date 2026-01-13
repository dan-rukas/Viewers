import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Button as OldButton, buttonVariants as oldButtonVariants } from './Button.old';
import { Button as NewButton, buttonVariants as newButtonVariants } from './Button.new';

import type { ButtonProps } from './Button.old';

export type { ButtonProps };

/**
 * Button proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewButton : OldButton;

  return (
    <Comp
      {...props}
      ref={ref}
    />
  );
});
Button.displayName = 'Button';

/**
 * Default buttonVariants export - uses old implementation for backwards compatibility.
 * Use buttonVariantsOld or buttonVariantsNew for explicit version selection.
 */
export const buttonVariants = oldButtonVariants;

/**
 * Explicit old buttonVariants export.
 */
export const buttonVariantsOld = oldButtonVariants;

/**
 * Explicit new buttonVariants export.
 */
export const buttonVariantsNew = newButtonVariants;
