import React, { Component } from "react";
import { bool, func, object, number, string, shape } from "prop-types";
import { withTheme } from "../themes/withTheme";

// external libraries
import { isString, flow } from "lodash";

// internal utility functions
import { StringOrElement, composeTheme, addThemeId } from "../utils";

// import constants
import { IDENTIFIERS } from "../themes/API";

class Input extends Component {
  static propTypes = {
    autoFocus: bool,
    context: shape({
      theme: object,
      ROOT_THEME_API: object
    }),
    error: StringOrElement,
    onBlur: func,
    onChange: func,
    onFocus: func,
    onRef: func,
    maxLength: number,
    minLength: number,
    onKeyPress: func,
    placeholder: string,
    readOnly: bool,
    skin: func.isRequired,
    theme: object,
    themeId: string,
    themeOverrides: object, // custom css/scss from user that adheres to component's theme API
    value: string
  };

  static defaultProps = {
    autoFocus: false,
    error: "",
    onRef: () => {},
    readOnly: false,
    theme: null,
    themeId: IDENTIFIERS.INPUT,
    themeOverrides: {},
    value: ""
  };

  constructor(props) {
    super(props);

    const { context, themeId, theme, themeOverrides } = props;
    const test1 = addThemeId(theme || context.theme, themeId);
    const test2 = addThemeId(themeOverrides, themeId);

    this.state = {
      composedTheme: composeTheme(
        addThemeId(theme || context.theme, themeId),
        addThemeId(themeOverrides, themeId),
        context.ROOT_THEME_API
      ),
      error: ""
    };
  }

  componentDidMount() {
    const { onRef, autoFocus } = this.props;

    if (autoFocus) this.focus();

    // if Input is rendered by FormField, onRef allows FormField to call
    // Input's focus method when someone clicks on FormField's label
    onRef(this);
  }

  onChange = event => {
    const { onChange, disabled } = this.props;
    if (disabled) return;

    if (onChange) onChange(this._processValue(event.target.value), event);
  };

  _setError = error => {
    const { setError } = this.props;

    // checks for setError func from FormField component
    // if this Input instance is being used within the render function
    // of a FormField instance, the error field within FormField's local state
    // will be set
    if (setError) setError(error);
    this.setState({ error });
  };

  focus = () => this.inputElement.focus();

  _processValue(value) {
    return flow([
      this._enforceStringValue,
      this._enforceMaxLength,
      this._enforceMinLength
    ]).call(this, value);
  }

  _enforceStringValue(value) {
    if (!isString(value)) throw "Values passed to Input::onChange must be strings";
    return value;
  }

  _enforceMaxLength(value) {
    const { maxLength } = this.props;
    const isTooLong = maxLength != null && value.length > maxLength;
    return isTooLong ? value.substring(0, maxLength) : value;
  }

  _enforceMinLength = value => {
    const { minLength } = this.props;
    const isTooShort = minLength != null && value.length < minLength;

    if (isTooShort) {
      this._setError(`Please enter a valid input`);
    } else if (this.state.error !== "") {
      this._setError(null);
    }

    return value;
  };

  render() {
    // destructuring props ensures only the "...rest" get passed down
    const {
      skin: InputSkin,
      theme,
      themeOverrides,
      onChange,
      error,
      ...rest
    } = this.props;

    return (
      <InputSkin
        error={error || this.state.error}
        onChange={this.onChange}
        inputRef={el => (this.inputElement = el)}
        theme={this.state.composedTheme}
        {...rest}
      />
    );
  }
}

export default withTheme(Input);
