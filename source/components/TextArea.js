import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';

export default class TextArea extends Input {

  static SKIN_PARTS = {
    TEXT_AREA: 'textarea',
  };

  static propTypes = Object.assign({}, Input.propTypes, {
    autoResize: PropTypes.bool,
    rows: PropTypes.number,
  });

  static defaultProps = Object.assign({}, Input.defaultProps, {
    autoResize: true,
  });

  componentDidMount () {
    if (this.props.autoResize) {
      window.addEventListener('resize', this._handleAutoresize);
      this._handleAutoresize();
    }
  }

  componentDidUpdate () {
    if (this.props.autoResize) this._handleAutoresize();
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.autoResize && nextProps.autoResize) {
      window.addEventListener('resize', this._handleAutoresize);
    } else if (this.props.autoResize && !nextProps.autoResize) {
      window.removeEventListener('resize', this._handleAutoresize);
    }
  }

  componentWillUnmount () {
    if (this.props.autoResize) {
      window.removeEventListener('resize', this._handleAutoresize);
    }
  }

  registerSkinPart(element) {
    super.registerSkinPart(element);
    this._handleAutoresize();
  }

  focus = () => this.skinParts[TextArea.SKIN_PARTS.TEXT_AREA].focus();

  _handleAutoresize = () => {
    const element = this.skinParts[TextArea.SKIN_PARTS.TEXT_AREA];
    if (!element) return;

    // compute the height difference between inner height and outer height
    const style = getComputedStyle(element, null);
    const heightOffset = style.boxSizing === 'content-box'
      ? -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom))
      : parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

    // resize the input to its content size
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight + heightOffset}px`;
  };

}
