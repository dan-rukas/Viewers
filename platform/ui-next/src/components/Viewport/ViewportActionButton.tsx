import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../Button/Button';
import { cn } from '../../lib/utils';

/**
 * A button that can trigger commands when clicked.
 */
function ViewportActionButton({ onInteraction, commands, id, className, children }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('ml-1', className)}
      onClick={() => {
        onInteraction({
          itemId: id,
          commands,
        });
      }}
    >
      {children}
    </Button>
  );
}

ViewportActionButton.propTypes = {
  id: PropTypes.string,
  onInteraction: PropTypes.func.isRequired,
  commands: PropTypes.array,
  className: PropTypes.string,
  children: PropTypes.node,
};

export { ViewportActionButton };
