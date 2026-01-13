import { useUINextVersion } from '../../contextProviders/UINextVersionProvider';

import { Calendar as OldCalendar, type CalendarProps } from './Calendar.old';
import { Calendar as NewCalendar } from './Calendar.new';

export type { CalendarProps };

/**
 * Calendar proxy component that renders old or new implementation based on UINextVersion context.
 */
export function Calendar(props: CalendarProps) {
  const version = useUINextVersion();
  const Comp = version === 'new' ? NewCalendar : OldCalendar;
  return <Comp {...props} />;
}
Calendar.displayName = 'Calendar';
