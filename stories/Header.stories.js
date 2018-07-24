// @flow
import React from 'react';

// storybook
import { storiesOf } from '@storybook/react';

// components
import { Header } from '../source/components/Header';

// skins
import { HeaderSkin } from '../source/skins/simple/HeaderSkin';

// themes
import CustomTheme from './theme-customizations/Header.custom.scss';

// custom styles & theme overrides
import styles from './Header.stories.scss';
import themeOverrides from './theme-overrides/customHeader.scss';

storiesOf('Header', module)
  // ====== Header Stories ======

  .add('positioning', () => (
    <div className={styles.wrapper}>
      <Header left skin={HeaderSkin}>
        Wallet Name - left
      </Header>

      <Header center skin={HeaderSkin}>
        Wallet Name - center
      </Header>

      <Header right skin={HeaderSkin}>
        Wallet Name - right
      </Header>
    </div>
  ))

  .add('font', () => (
    <div className={styles.wrapper}>
      <Header thin skin={HeaderSkin}>
        Wallet Name - thin
      </Header>

      <Header light skin={HeaderSkin}>
        Wallet Name - light
      </Header>

      <Header regular skin={HeaderSkin}>
        Wallet Name - regular
      </Header>

      <Header medium skin={HeaderSkin}>
        Wallet Name - medium
      </Header>

      <Header bold skin={HeaderSkin}>
        Wallet Name - bold
      </Header>
    </div>
  ))

  .add('text', () => (
    <div className={styles.wrapper}>
      <Header lowerCase skin={HeaderSkin}>
        Wallet Name - lowerCase
      </Header>

      <Header upperCase skin={HeaderSkin}>
        Wallet Name - upperCase
      </Header>
    </div>
  ))

  .add('simple theme', () => (
    <div className={styles.wrapper}>
      <Header h1 skin={HeaderSkin}>
        Wallet Name - h1
      </Header>

      <Header h2 skin={HeaderSkin}>
        Wallet Name - h2
      </Header>

      <Header h3 skin={HeaderSkin}>
        Wallet Name - h3
      </Header>

      <Header h4 skin={HeaderSkin}>
        Wallet Name - h4
      </Header>
    </div>
  ))

  .add('override theme - props', () => (
    <div className={styles.wrapper}>
      <Header h1 lowerCase skin={HeaderSkin}>
        Wallet Name - h1 lowerCase
      </Header>

      <Header h2 left skin={HeaderSkin}>
        Wallet Name - h2 left
      </Header>

      <Header h3 right skin={HeaderSkin}>
        Wallet Name - h3 right
      </Header>

      <Header h4 upperCase skin={HeaderSkin}>
        Wallet Name - h4 upperCase
      </Header>
    </div>
  ))

  .add('override theme - themeOverrides', () => (
    <div className={styles.wrapper}>
      <Header h1 themeOverrides={themeOverrides} skin={HeaderSkin}>
        Wallet Name - h1
      </Header>

      <Header h2 themeOverrides={themeOverrides} skin={HeaderSkin}>
        Wallet Name - h2
      </Header>

      <Header h3 themeOverrides={themeOverrides} skin={HeaderSkin}>
        Wallet Name - h3
      </Header>

      <Header h4 themeOverrides={themeOverrides} skin={HeaderSkin}>
        Wallet Name - h4
      </Header>
    </div>
  ))

  .add('override combo - props & themeOverrides', () => (
    <div className={styles.wrapper}>
      <Header h3 upperCase left themeOverrides={themeOverrides} skin={HeaderSkin}>
        Wallet Name - h3
      </Header>
      <Header h3 upperCase right themeOverrides={themeOverrides} skin={HeaderSkin}>
        Wallet Name - h3
      </Header>
      <Header h3 lowerCase center themeOverrides={themeOverrides} skin={HeaderSkin}>
        Wallet Name - h3
      </Header>
    </div>
  ))

  .add('custom theme', () => (
    <div className={styles.wrapper}>
      <Header h1 theme={CustomTheme} skin={HeaderSkin}>
        My Custom Theme
      </Header>
      <Header h1 center upperCase theme={CustomTheme} skin={HeaderSkin}>
        My Custom Theme with Prop Overrides
      </Header>
    </div>
  ));
