import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Toaster as OldToaster } from './Sonner.old';
import { Toaster as NewToaster } from './Sonner.new';

type ToasterProps = React.ComponentProps<typeof OldToaster>;

/**
 * Toaster proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Toaster = (props: ToasterProps) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewToaster : OldToaster;
  return <Comp {...props} />;
};
