import React, { Component } from "react";
import { string, bool, func, object, shape } from "prop-types";
import { withTheme } from "../themes/withTheme";

// import utility functions
import { StringOrElement, composeTheme, addThemeId } from "../utils";

// import constants
import { IDENTIFIERS } from "../themes/API";

class Checkbox extends Component {
  static propTypes = {
    context: shape({
      theme: object,
      ROOT_THEME_API: object
    }),
    checked: bool,
    label: StringOrElement,
    onChange: func,
    onBlur: func,
    onFocus: func,
    skin: func.isRequired,
    theme: object,
    themeId: string,
    themeOverrides: object // custom css/scss from user that adheres to component's theme API
  };

  static defaultProps = {
    checked: false,
    disabled: false,
    theme: null,
    themeId: IDENTIFIERS.CHECKBOX,
    themeOverrides: {}
  };

  constructor(props) {
    super(props);

    const { context, themeId, theme, themeOverrides } = props;

    this.state = {
      composedTheme: composeTheme(
        addThemeId(theme || context.theme, themeId),
        addThemeId(themeOverrides, themeId),
        context.ROOT_THEME_API
      )
    };
  }

  render() {
    // destructuring props ensures only the "...rest" get passed down
    const { skin: CheckboxSkin, theme, themeOverrides, ...rest } = this.props;

    return <CheckboxSkin theme={this.state.composedTheme} {...rest} />;
  }
}

export default withTheme(Checkbox);
