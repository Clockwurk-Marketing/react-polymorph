// @flow
import React from 'react';
import type { Ref } from 'react';

// external libraries
import classnames from 'classnames';
import _ from 'lodash';

// components & skins
import { FormField } from '../../source/components/FormField';
import { FormFieldSkin } from '../../source/skins/simple';
import { Options } from '../../source/components/Options';
import OptionsSkin from './OptionsSkin';

// context helper for enzyme
import { CONTEXT } from './context';

type Props = {
  className: string,
  closeOptions: Function,
  error: string,
  filteredOptions: Array<any>,
  getSelectionProps: Function,
  handleAutocompleteClick: Function,
  handleChange: Function,
  handleInputChange: Function,
  inputRef: Ref<'input'>,
  inputValue: string,
  isOpeningUpward: boolean,
  isOpen: boolean,
  label: string | Node,
  maxSelections: number,
  maxVisibleOptions: number,
  onKeyDown: Function,
  options: Array<any>,
  placeholder: string,
  removeOption: Function,
  renderSelections: Function,
  renderOptions: Function,
  rootRef: Ref<*>,
  selectedOptions: Array<any>,
  suggestionsRef: Ref<*>,
  theme: Object,
  themeId: string
};

export default (props: Props) => {
  const theme = props.theme[props.themeId];

  const filteredAndLimitedOptions = _.slice(
    props.filteredOptions,
    0,
    props.maxVisibleOptions
  );

  // show placeholder only if no maximum selections declared or maximum not reached
  const canMoreOptionsBeSelected =
    props.selectedOptions.length < props.maxSelections;

  const placeholder =
    !props.maxSelections || canMoreOptionsBeSelected ? props.placeholder : '';

  const renderSelectedOptions = () => {
    // check if the user passed a renderSelections function
    if (props.selectedOptions && props.renderSelections) {
      // call custom renderSelections function
      return props.renderSelections(props.getSelectionProps);
    } else if (props.selectedOptions && !props.renderSelections) {
      // render default skin
      return props.selectedOptions.map((selectedOption, index) => (
        <span className={theme.selectedWordBox} key={index}>
          <span className={theme.selectedWordValue}>
            {selectedOption}
            <span
              role="presentation"
              aria-hidden
              className={theme.selectedWordRemoveButton}
              onClick={props.removeOption.bind(null, index)}
            >
              &times;
            </span>
          </span>
        </span>
      ));
    }
    return null;
  };

  // selected words and input for entering a new one
  const autocompleteContent = (
    <div className={theme.selectedWords}>
      {renderSelectedOptions()}
      <input
        ref={props.inputRef}
        placeholder={placeholder}
        value={props.inputValue}
        onChange={props.handleInputChange}
        onKeyDown={props.onKeyDown}
      />
    </div>
  );

  return (
    <div className={props.className} ref={props.rootRef}>
      <FormField
        context={CONTEXT}
        error={props.error}
        label={props.label}
        skin={FormFieldSkin}
        render={() => (
          <div
            role="presentation"
            aria-hidden
            className={theme.autocompleteWrapper}
            onClick={props.handleAutocompleteClick}
          >
            <div
              className={classnames([
                theme.autocompleteContent,
                props.isOpen ? theme.opened : null,
                props.selectedOptions.length
                  ? theme.hasSelectedWords
                  : null,
                props.error ? theme.errored : null
              ])}
              ref={props.suggestionsRef}
            >
              {autocompleteContent}
            </div>

            <Options
              context={CONTEXT}
              isOpen={props.isOpen}
              isOpeningUpward={props.isOpeningUpward}
              noResults={!props.filteredOptions.length}
              onChange={props.handleChange}
              onClose={props.closeOptions}
              options={filteredAndLimitedOptions}
              resetOnClose
              selectedOptions={props.selectedOptions}
              skin={OptionsSkin}
              render={props.renderOptions}
            />
          </div>
        )}
      />
    </div>
  );
};
