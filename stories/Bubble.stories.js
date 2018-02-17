import React from 'react';

// storybook
import { storiesOf } from '@storybook/react';
import { withState } from '@dump247/storybook-state';

// components
import { ThemeProvider, Bubble } from '../source/components';

// skins
import { BubbleSkin } from '../source/skins/simple';

// themes
import { BubbleTheme } from '../source/themes/simple';

// custom styles & theme overrides
import styles from './Bubble.stories.scss';
import themeOverrides from './styles/customBubble.scss';

storiesOf('Bubble', module)
  .addDecorator(story => {
    const SimpleTheme = { bubble: { ...BubbleTheme } };

    return <ThemeProvider theme={SimpleTheme}>{story()}</ThemeProvider>;
  })

  // ====== Stories ======

  .add('plain', () => (
    <div className={styles.container}>
      <Bubble skin={BubbleSkin}>plain bubble</Bubble>
    </div>
  ))

  .add('isOpeningUpward', () => (
    <div className={styles.container}>
      <Bubble isOpeningUpward skin={BubbleSkin}>
        isOpeningUpward bubble
      </Bubble>
    </div>
  ))

  .add('isTransparent={false}', () => (
    <div className={styles.container}>
      <Bubble isTransparent={false} skin={BubbleSkin}>
        solid bubble
      </Bubble>
    </div>
  ))

  .add('custom class', () => (
    <div className={styles.container}>
      <Bubble className={styles.customBubble} skin={BubbleSkin}>
        this bubble is right aligned;
      </Bubble>
    </div>
  ))

  .add('content-light', () => (
    <div className={styles.container}>
      <Bubble skin={BubbleSkin}>tiny</Bubble>
    </div>
  ))

  .add('composed theme', () => (
    <div className={styles.container}>
      <Bubble themeOverrides={themeOverrides} skin={BubbleSkin}>
        tiny
      </Bubble>
    </div>
  ))
  .add('isHidden', () => (
    <div className={styles.container}>
      There should be no bubble shown!
      <Bubble isHidden skin={BubbleSkin}>
        should not be visible!
      </Bubble>
    </div>
  ))
  .add('isFloating', () => (
    <div className={styles.scrollContainer}>
      <div className={styles.scrollContent}>
        <Bubble isFloating skin={BubbleSkin}>
          floating above scroll content
        </Bubble>
      </div>
      <p>
        Here is some text that should break<br />
        and trigger scroll bars<br />
      </p>
    </div>
  ));
