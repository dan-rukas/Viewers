import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Combobox as OldCombobox } from './Combobox.old';
import { Combobox as NewCombobox } from './Combobox.new';

type ComboboxProps = React.ComponentProps<typeof OldCombobox>;

/**
 * Combobox proxy component that renders old or new implementation based on UINextVersion context.
 */
export function Combobox(props: ComboboxProps) {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCombobox : OldCombobox;
  return <Comp {...props} />;
}
