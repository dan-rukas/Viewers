'use client';

import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  Accordion as OldAccordion,
  AccordionItem as OldAccordionItem,
  AccordionTrigger as OldAccordionTrigger,
  AccordionContent as OldAccordionContent,
} from './Accordion.old';

import {
  Accordion as NewAccordion,
  AccordionItem as NewAccordionItem,
  AccordionTrigger as NewAccordionTrigger,
  AccordionContent as NewAccordionContent,
} from './Accordion.new';

const Accordion: typeof OldAccordion = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewAccordion : OldAccordion;
  return <Comp {...props} />;
};

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof OldAccordionItem>,
  React.ComponentPropsWithoutRef<typeof OldAccordionItem>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewAccordionItem : OldAccordionItem;
  return <Comp {...props} ref={ref} />;
});
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof OldAccordionTrigger>,
  React.ComponentPropsWithoutRef<typeof OldAccordionTrigger>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewAccordionTrigger : OldAccordionTrigger;
  return <Comp {...props} ref={ref} />;
});
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof OldAccordionContent>,
  React.ComponentPropsWithoutRef<typeof OldAccordionContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewAccordionContent : OldAccordionContent;
  return <Comp {...props} ref={ref} />;
});
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
