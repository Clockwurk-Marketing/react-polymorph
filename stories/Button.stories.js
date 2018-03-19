import React from "react";

// storybook
import { storiesOf } from "@storybook/react";

// components
import { ThemeProvider, Button } from "../source/components";

// skins
import { ButtonSkin } from "../source/skins/simple";

// themes
import SimpleTheme from "../source/themes/simple";
import CustomButtonTheme from "./theme-customizations/Button.custom.scss";

// custom styles & themeOverrides
import themeOverrides from "./theme-overrides/customButton.scss";

storiesOf("Button", module)
  .addDecorator(story => {
    return <ThemeProvider theme={SimpleTheme}>{story()}</ThemeProvider>;
  })

  // ====== Stories ======

  .add("plain", () => <Button label="Button label" skin={ButtonSkin} />)

  .add("disabled", () => (
    <Button disabled label="Button label" skin={ButtonSkin} />
  ))

  .add("composed theme", () => (
    <Button
      label="Composed theme"
      themeOverrides={themeOverrides}
      skin={ButtonSkin}
    />
  ))

  .add("custom theme", () => (
    <Button
      label="Custom theme"
      theme={CustomButtonTheme}
      skin={ButtonSkin}
    />
  ));
