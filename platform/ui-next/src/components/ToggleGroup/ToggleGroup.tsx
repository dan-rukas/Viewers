import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { ToggleGroup as OldToggleGroup, ToggleGroupItem as OldToggleGroupItem } from './ToggleGroup.old';
import { ToggleGroup as NewToggleGroup, ToggleGroupItem as NewToggleGroupItem } from './ToggleGroup.new';

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof OldToggleGroup>,
  React.ComponentPropsWithoutRef<typeof OldToggleGroup>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewToggleGroup : OldToggleGroup;
  return <Comp {...props} ref={ref} />;
});
ToggleGroup.displayName = 'ToggleGroup';

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof OldToggleGroupItem>,
  React.ComponentPropsWithoutRef<typeof OldToggleGroupItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewToggleGroupItem : OldToggleGroupItem;
  return <Comp {...props} ref={ref} />;
});
ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };
