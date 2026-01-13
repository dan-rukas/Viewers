import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Slider as OldSlider } from './Slider.old';
import { Slider as NewSlider } from './Slider.new';

/**
 * Slider proxy component that renders old or new implementation based on UINextVersion context.
 */
export const Slider = React.forwardRef<
  React.ElementRef<typeof OldSlider>,
  React.ComponentPropsWithoutRef<typeof OldSlider>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSlider : OldSlider;
  return <Comp {...props} ref={ref} />;
});
Slider.displayName = 'Slider';
