import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  Select as OldSelect,
  SelectGroup as OldSelectGroup,
  SelectValue as OldSelectValue,
  SelectTrigger as OldSelectTrigger,
  SelectContent as OldSelectContent,
  SelectLabel as OldSelectLabel,
  SelectItem as OldSelectItem,
  SelectSeparator as OldSelectSeparator,
  SelectScrollUpButton as OldSelectScrollUpButton,
  SelectScrollDownButton as OldSelectScrollDownButton,
} from './Select.old';

import {
  Select as NewSelect,
  SelectGroup as NewSelectGroup,
  SelectValue as NewSelectValue,
  SelectTrigger as NewSelectTrigger,
  SelectContent as NewSelectContent,
  SelectLabel as NewSelectLabel,
  SelectItem as NewSelectItem,
  SelectSeparator as NewSelectSeparator,
  SelectScrollUpButton as NewSelectScrollUpButton,
  SelectScrollDownButton as NewSelectScrollDownButton,
} from './Select.new';

/**
 * Select proxy - renders old or new based on UINextVersion context.
 * Note: All Select parts must use the same version to work correctly together.
 */
const Select: typeof OldSelect = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelect : OldSelect;
  return <Comp {...props} />;
};

const SelectGroup: typeof OldSelectGroup = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectGroup : OldSelectGroup;
  return <Comp {...props} />;
};

const SelectValue: typeof OldSelectValue = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectValue : OldSelectValue;
  return <Comp {...props} />;
};

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof OldSelectTrigger>,
  React.ComponentPropsWithoutRef<typeof OldSelectTrigger>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectTrigger : OldSelectTrigger;
  return <Comp {...props} ref={ref} />;
});
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<
  React.ElementRef<typeof OldSelectContent>,
  React.ComponentPropsWithoutRef<typeof OldSelectContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectContent : OldSelectContent;
  return <Comp {...props} ref={ref} />;
});
SelectContent.displayName = 'SelectContent';

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof OldSelectLabel>,
  React.ComponentPropsWithoutRef<typeof OldSelectLabel>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectLabel : OldSelectLabel;
  return <Comp {...props} ref={ref} />;
});
SelectLabel.displayName = 'SelectLabel';

const SelectItem = React.forwardRef<
  React.ElementRef<typeof OldSelectItem>,
  React.ComponentPropsWithoutRef<typeof OldSelectItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectItem : OldSelectItem;
  return <Comp {...props} ref={ref} />;
});
SelectItem.displayName = 'SelectItem';

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof OldSelectSeparator>,
  React.ComponentPropsWithoutRef<typeof OldSelectSeparator>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectSeparator : OldSelectSeparator;
  return <Comp {...props} ref={ref} />;
});
SelectSeparator.displayName = 'SelectSeparator';

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof OldSelectScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof OldSelectScrollUpButton>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectScrollUpButton : OldSelectScrollUpButton;
  return <Comp {...props} ref={ref} />;
});
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof OldSelectScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof OldSelectScrollDownButton>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewSelectScrollDownButton : OldSelectScrollDownButton;
  return <Comp {...props} ref={ref} />;
});
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
