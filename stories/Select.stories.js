import React from "react";

// storybook
import { storiesOf } from "@storybook/react";
import { withState } from "@dump247/storybook-state";

// components
import { ThemeProvider, FormField, Select } from "../source/components";

// skins
import { SelectSkin, FormFieldSkin } from "../source/skins/simple";

// themes
import { SelectTheme, FormFieldTheme } from "../source/themes/simple";

// custom styles & themeOverrides
import styles from "./Select.stories.scss";
import themeOverrides from "./styles/customSelect.scss";

// images
import flagEngland from "./images/gb.png";
import flagSpain from "./images/es.png";
import flagThailand from "./images/th.png";
import flagUSA from "./images/us.png";

// constants
const COUNTRIES = [
  { value: "EN-gb", label: "England" },
  { value: "ES-es", label: "Spain" },
  { value: "TH-th", label: "Thailand" },
  { value: "EN-en", label: "USA" }
];

const COUNTRIES_WITH_FLAGS = [
  { value: "EN-gb", label: "England", flag: flagEngland },
  { value: "ES-es", label: "Spain", flag: flagSpain },
  { value: "TH-th", label: "Thailand", flag: flagThailand },
  { value: "EN-en", label: "USA", flag: flagUSA }
];

const COUNTRIES_WITH_DISABLED_OPTIONS = [
  { value: "EN-gb", label: "England" },
  { value: "ES-es", label: "Spain" },
  { value: "TH-th", label: "Thailand", isDisabled: true },
  { value: "EN-en", label: "USA" }
];

storiesOf("Select", module)
  .addDecorator(story => {
    const SimpleTheme = {
      select: { ...SelectTheme },
      formfield: { ...FormFieldTheme }
    };

    return <ThemeProvider theme={SimpleTheme}>{story()}</ThemeProvider>;
  })

  // ====== Stories ======

  .add(
    "Countries - options",
    withState({ value: "" }, store => (
      <Select
        value={store.state.value}
        onChange={value => store.set({ value })}
        options={COUNTRIES}
        skin={SelectSkin}
      />
    ))
  )

  .add(
    "Countries - label",
    withState({ value: "" }, store => (
      <FormField
        label="Some label"
        skin={FormFieldSkin}
        render={props => (
          <Select
            value={store.state.value}
            onChange={value => store.set({ value })}
            label="Countries"
            options={COUNTRIES}
            skin={SelectSkin}
          />
        )}
      />
    ))
  )

  .add(
    "Countries - placeholder",
    withState({ value: "" }, store => (
      <Select
        value={store.state.value}
        onChange={value => store.set({ value })}
        options={COUNTRIES}
        placeholder="Select your country …"
        skin={SelectSkin}
      />
    ))
  )

  .add(
    "Countries - value",
    withState({ value: COUNTRIES[0].value }, store => (
      <Select
        value={store.state.value}
        onChange={value => store.set({ value })}
        options={COUNTRIES}
        skin={SelectSkin}
      />
    ))
  )

  .add(
    "Countries - error",
    withState({ value: COUNTRIES[0].value }, store => (
      <FormField
        label="Countries"
        error="You picked the wrong country"
        skin={FormFieldSkin}
        render={props => (
          <Select
            {...props}
            value={store.state.value}
            onChange={value => store.set({ value })}
            options={COUNTRIES}
            skin={SelectSkin}
          />
        )}
      />
    ))
  )

  .add(
    "Countries - custom options template",
    withState({ value: "" }, store => (
      <Select
        value={store.state.value}
        onChange={value => store.set({ value })}
        options={COUNTRIES_WITH_FLAGS}
        optionRenderer={option => {
          return (
            <div className={styles.customOption}>
              <img src={option.flag} />
              <span>{option.label}</span>
            </div>
          );
        }}
        skin={SelectSkin}
      />
    ))
  )

  .add(
    "Countries - isOpeningUpward",
    withState({ value: "" }, store => (
      <FormField
        className={styles.customMargin}
        label="Countries (opening upward)"
        skin={FormFieldSkin}
        render={props => (
          <Select
            value={store.state.value}
            onChange={value => store.set({ value })}
            options={COUNTRIES}
            placeholder="Select your country …"
            skin={SelectSkin}
            isOpeningUpward
          />
        )}
      />
    ))
  )

  .add(
    "Countries - with disabled options",
    withState({ value: "" }, store => (
      <Select
        value={store.state.value}
        onChange={value => store.set({ value })}
        label="Countries (has disabled options)"
        options={COUNTRIES_WITH_DISABLED_OPTIONS}
        placeholder="Select your country …"
        skin={SelectSkin}
      />
    ))
  )

  .add(
    "composed theme",
    withState({ value: "" }, store => (
      <Select
        themeOverrides={themeOverrides}
        value={store.state.value}
        onChange={value => store.set({ value })}
        label="Select with a composed theme"
        options={COUNTRIES}
        placeholder="Select your country …"
        skin={SelectSkin}
      />
    ))
  );
