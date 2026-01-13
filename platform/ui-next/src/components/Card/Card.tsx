import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  Card as OldCard,
  CardHeader as OldCardHeader,
  CardFooter as OldCardFooter,
  CardTitle as OldCardTitle,
  CardDescription as OldCardDescription,
  CardContent as OldCardContent,
} from './Card.old';

import {
  Card as NewCard,
  CardHeader as NewCardHeader,
  CardFooter as NewCardFooter,
  CardTitle as NewCardTitle,
  CardDescription as NewCardDescription,
  CardContent as NewCardContent,
} from './Card.new';

const Card = React.forwardRef<
  React.ElementRef<typeof OldCard>,
  React.ComponentPropsWithoutRef<typeof OldCard>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCard : OldCard;
  return <Comp {...props} ref={ref} />;
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  React.ElementRef<typeof OldCardHeader>,
  React.ComponentPropsWithoutRef<typeof OldCardHeader>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCardHeader : OldCardHeader;
  return <Comp {...props} ref={ref} />;
});
CardHeader.displayName = 'CardHeader';

const CardFooter = React.forwardRef<
  React.ElementRef<typeof OldCardFooter>,
  React.ComponentPropsWithoutRef<typeof OldCardFooter>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCardFooter : OldCardFooter;
  return <Comp {...props} ref={ref} />;
});
CardFooter.displayName = 'CardFooter';

const CardTitle = React.forwardRef<
  React.ElementRef<typeof OldCardTitle>,
  React.ComponentPropsWithoutRef<typeof OldCardTitle>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCardTitle : OldCardTitle;
  return <Comp {...props} ref={ref} />;
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  React.ElementRef<typeof OldCardDescription>,
  React.ComponentPropsWithoutRef<typeof OldCardDescription>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCardDescription : OldCardDescription;
  return <Comp {...props} ref={ref} />;
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  React.ElementRef<typeof OldCardContent>,
  React.ComponentPropsWithoutRef<typeof OldCardContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCardContent : OldCardContent;
  return <Comp {...props} ref={ref} />;
});
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
