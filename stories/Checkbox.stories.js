import React from 'react';

// storybook
import { storiesOf } from '@storybook/react';
import { withState } from '@dump247/storybook-state';

// components
import ThemeProvider from '../source/components/ThemeProvider';
import Checkbox from '../source/components/Checkbox';

// skins
import SimpleCheckboxSkin from '../source/skins/simple/CheckboxSkin';

// themes
import { SimpleCheckboxTheme } from '../source/themes/simple';

// custom styles
import customStyles from './Checkbox.stories.scss';

storiesOf('Checkbox', module)
  .addDecorator(story => {
    const SimpleTheme = { checkbox: { ...SimpleCheckboxTheme } };

    return <ThemeProvider theme={SimpleTheme}>{story()}</ThemeProvider>;
  })

  // ====== Stories ======

  .add(
    'plain',
    withState({ checked: false }, store => (
      <Checkbox
        checked={store.state.checked}
        onChange={() => store.set({ checked: !store.state.checked })}
        skin={SimpleCheckboxSkin}
      />
    ))
  )

  .add(
    'disabled',
    withState({ checked: false }, store => (
      <Checkbox disabled skin={SimpleCheckboxSkin} />
    ))
  )

  .add(
    'short label',
    withState({ checked: false }, store => (
      <Checkbox
        label="My checkbox"
        checked={store.state.checked}
        onChange={() => store.set({ checked: !store.state.checked })}
        skin={SimpleCheckboxSkin}
      />
    ))
  )

  .add(
    'disabled with label',
    withState({ checked: false }, store => (
      <Checkbox disabled label="My checkbox" skin={SimpleCheckboxSkin} />
    ))
  )

  .add(
    'long label',
    withState({ checked: false }, store => (
      <Checkbox
        label="I understand that if this application is moved to another device or deleted,
             my money can be only recovered with the backup phrase which
             were written down in a secure place"
        checked={store.state.checked}
        onChange={() => store.set({ checked: !store.state.checked })}
        skin={SimpleCheckboxSkin}
      />
    ))
  )

  .add(
    'html label',
    withState({ checked: false }, store => (
      <Checkbox
        label={
          <div>
            Example for a <strong>bold</strong> word in an html label
          </div>
        }
        checked={store.state.checked}
        onChange={() => store.set({ checked: !store.state.checked })}
        skin={SimpleCheckboxSkin}
      />
    ))
  )

  .add(
    'composed theme',
    withState({ checked: false }, store => (
      <Checkbox
        themeOverrides={customStyles}
        label="check here"
        checked={store.state.checked}
        onChange={() => store.set({ checked: !store.state.checked })}
        skin={SimpleCheckboxSkin}
      />
    ))
  );
