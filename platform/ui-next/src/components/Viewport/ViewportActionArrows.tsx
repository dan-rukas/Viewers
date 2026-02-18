import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Icons } from '@ohif/ui-next';
import { Button } from '../Button/Button';

/**
 * A small set of left/right arrow icons for stepping through slices or series.
 */
function ViewportActionArrows({ onArrowsClick, className }) {
  return (
    <div className={classNames(className, 'flex')}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onArrowsClick(-1)}
      >
        <Icons.ArrowLeftBold />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onArrowsClick(1)}
      >
        <Icons.ArrowRightBold />
      </Button>
    </div>
  );
}

ViewportActionArrows.propTypes = {
  onArrowsClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export { ViewportActionArrows };
