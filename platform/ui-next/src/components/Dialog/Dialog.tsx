import * as React from 'react';
import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import {
  Dialog as OldDialog,
  DialogPortal as OldDialogPortal,
  DialogOverlay as OldDialogOverlay,
  DialogTrigger as OldDialogTrigger,
  DialogClose as OldDialogClose,
  DialogContent as OldDialogContent,
  DialogHeader as OldDialogHeader,
  DialogFooter as OldDialogFooter,
  DialogTitle as OldDialogTitle,
  DialogDescription as OldDialogDescription,
} from './Dialog.old';

import {
  Dialog as NewDialog,
  DialogPortal as NewDialogPortal,
  DialogOverlay as NewDialogOverlay,
  DialogTrigger as NewDialogTrigger,
  DialogClose as NewDialogClose,
  DialogContent as NewDialogContent,
  DialogHeader as NewDialogHeader,
  DialogFooter as NewDialogFooter,
  DialogTitle as NewDialogTitle,
  DialogDescription as NewDialogDescription,
} from './Dialog.new';

const Dialog: typeof OldDialog = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialog : OldDialog;
  return <Comp {...props} />;
};

const DialogPortal: typeof OldDialogPortal = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogPortal : OldDialogPortal;
  return <Comp {...props} />;
};

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof OldDialogOverlay>,
  React.ComponentPropsWithoutRef<typeof OldDialogOverlay>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogOverlay : OldDialogOverlay;
  return <Comp {...props} ref={ref} />;
});
DialogOverlay.displayName = 'DialogOverlay';

const DialogTrigger: typeof OldDialogTrigger = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogTrigger : OldDialogTrigger;
  return <Comp {...props} />;
};

const DialogClose: typeof OldDialogClose = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogClose : OldDialogClose;
  return <Comp {...props} />;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof OldDialogContent>,
  React.ComponentPropsWithoutRef<typeof OldDialogContent>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogContent : OldDialogContent;
  return <Comp {...props} ref={ref} />;
});
DialogContent.displayName = 'DialogContent';

const DialogHeader: typeof OldDialogHeader = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogHeader : OldDialogHeader;
  return <Comp {...props} />;
};

const DialogFooter: typeof OldDialogFooter = props => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogFooter : OldDialogFooter;
  return <Comp {...props} />;
};

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof OldDialogTitle>,
  React.ComponentPropsWithoutRef<typeof OldDialogTitle>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogTitle : OldDialogTitle;
  return <Comp {...props} ref={ref} />;
});
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof OldDialogDescription>,
  React.ComponentPropsWithoutRef<typeof OldDialogDescription>
>((props, ref) => {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewDialogDescription : OldDialogDescription;
  return <Comp {...props} ref={ref} />;
});
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
