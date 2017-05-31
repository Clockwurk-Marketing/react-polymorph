import React from 'react';
import PropTypes from 'prop-types';
import SkinnableComponent from './SkinnableComponent';

export default class FormField extends SkinnableComponent {

  static propTypes = Object.assign({}, SkinnableComponent.propTypes, {
    skin: PropTypes.element.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    disabled: PropTypes.bool,
    error: PropTypes.string,
  });

  static defaultProps = {
    disabled: false,
  };

}
