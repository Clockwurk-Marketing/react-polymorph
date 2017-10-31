import React from 'react';
import classnames from 'classnames';
import { themr } from 'react-css-themr';
import { OPTIONS } from '../identifiers';
import Options from '../../../components/Options';

export default themr(OPTIONS)((props) => {
  const {
    component, theme, options, optionRenderer,
    isOpeningUpward, isOpen, noResults,
    noResultsMessage,
  } = props;
  const highlightedOptionIndex = component.getHighlightedOptionIndex();
  const isFirstOptionHighlighted = highlightedOptionIndex === 0;
  const sortedOptions = isOpeningUpward ? options.slice().reverse() : options;
  return (
    <ul
      className={classnames([
        theme.options,
        isOpen ? theme.isOpen : null,
        (isFirstOptionHighlighted && !noResults) ? theme.firstOptionHighlighted : null,
        isOpeningUpward ? theme.openUpward : null,
      ])}
      style={props.position && {
        [isOpeningUpward ? 'bottom' : 'top']: props.position.positionY,
        left: props.position.positionX,
        width: props.position.width,
      }}
      ref={(element) => component.registerSkinPart(Options.SKIN_PARTS.OPTIONS, element)}
    >
      {!noResults ? sortedOptions.map((option, index) => (
        <li
          key={index}
          className={classnames([
            theme.option,
            component.isHighlightedOption(index) ? theme.highlightedOption : null,
            option.isDisabled ? theme.disabledOption : null,
          ])}
          onClick={(event) => component.handleClickOnOption(option, event)}
          onMouseEnter={() => component.setHighlightedOptionIndex(index)}
        >
          {optionRenderer ? optionRenderer(option) : (typeof option === 'object' ? option.label : option)}
        </li>
      )) : (
        <li className={theme.option}>{noResultsMessage}</li>
      )}
    </ul>
  );
});
