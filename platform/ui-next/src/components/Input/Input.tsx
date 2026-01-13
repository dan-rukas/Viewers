import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Input as OldInput } from './Input.old';
import { Input as NewInput } from './Input.new';

import type { InputProps } from './Input.old';

export type { InputProps };

/**
 * Input proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewInput : OldInput;

  return (
    <Comp
      {...props}
      ref={ref}
    />
  );
});
Input.displayName = 'Input';
