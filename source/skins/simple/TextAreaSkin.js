// @flow
import React from 'react';
import type { Ref, Element } from 'react';

// external libraries
import classnames from 'classnames';

// components & skins
import { FormField } from '../../components';
import { FormFieldSkin } from './';

// import utility functions
import { pickDOMProps } from '../../utils';

type Props = {
  className: string,
  disabled: boolean,
  error: string | Element<any>,
  label: string | Element<any>,
  onBlur: Function,
  onChange: Function,
  onFocus: Function,
  placeholder: string,
  rows: number,
  textareaRef: Ref<*>,
  theme: Object,
  themeId: string,
  value: string
};

export const TextAreaSkin = (props: Props) => {
  const { theme, themeId } = props;
  return (
    <FormField
      className={props.className}
      disabled={props.disabled}
      label={props.label}
      error={props.error}
      inputRef={props.textareaRef}
      skin={FormFieldSkin}
      render={() => (
        <textarea
          ref={props.textareaRef}
          {...pickDOMProps(props)}
          className={classnames([
            theme[themeId].textarea,
            props.disabled ? theme[themeId].disabled : null,
            props.error ? theme[themeId].errored : null
          ])}
        />
      )}
    />
  );
};
