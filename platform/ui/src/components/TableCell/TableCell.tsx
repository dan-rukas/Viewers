import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// We can't produce class names by string concatenation or the purger will
// strip them (same workaround as utils/getGridWidthClass.js). Only fractions
// present in the Tailwind width scale are listed; unknown combos get no width
// class, as before.
const widthClasses = {
  '1/2': 'w-1/2',
  '1/3': 'w-1/3',
  '2/3': 'w-2/3',
  '1/4': 'w-1/4',
  '2/4': 'w-2/4',
  '3/4': 'w-3/4',
  '1/5': 'w-1/5',
  '2/5': 'w-2/5',
  '3/5': 'w-3/5',
  '4/5': 'w-4/5',
  '1/6': 'w-1/6',
  '2/6': 'w-2/6',
  '3/6': 'w-3/6',
  '4/6': 'w-4/6',
  '5/6': 'w-5/6',
  '1/12': 'w-1/12',
  '2/12': 'w-2/12',
  '3/12': 'w-3/12',
  '4/12': 'w-4/12',
  '5/12': 'w-5/12',
  '6/12': 'w-6/12',
  '7/12': 'w-7/12',
  '8/12': 'w-8/12',
  '9/12': 'w-9/12',
  '10/12': 'w-10/12',
  '11/12': 'w-11/12',
};

const TableCell = ({
  children,
  className = '',
  colSpan = 1,
  // ignored because we don't want to expose this prop
  // eslint-disable-next-line react/prop-types
  cellsNum,
  isTableHead = false,
  align = 'left',
  style = {},
}) => {
  const classes = {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    isTableHead: {
      true: '',
      false: 'border-r border-secondary-light',
    },
  };

  return (
    <div
      className={classnames(
        'break-all px-2 last:border-r-0',
        widthClasses[`${colSpan}/${cellsNum}`],
        classes.align[align],
        classes.isTableHead[isTableHead],
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

TableCell.propTypes = {
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  colSpan: PropTypes.number,
  isTableHead: PropTypes.bool,
  style: PropTypes.object,
};

export default TableCell;
