// @flow
import React, { Component } from 'react';

// $FlowFixMe
import type { Ref, ComponentType, SyntheticKeyboardEvent, SyntheticMouseEvent, SyntheticEvent, Element } from 'react';

// internal utility functions
import { withTheme } from '../themes/withTheme';
import {
  composeTheme,
  composeFunctions,
  addThemeId
} from '../utils';

// import constants
import { IDENTIFIERS } from '../themes/API';

type Props = {
  context: {
    theme: Object,
    ROOT_THEME_API: Object
  },
  isOpen: boolean,
  isOpeningUpward: boolean,
  noResults: boolean,
  noResultsMessage: string | Element<any>,
  onBlur: Function,
  onChange: Function,
  onClose: Function,
  options: Array<any>,
  optionRenderer: Function,
  optionsRef: Ref<any>,
  render: Function,
  resetOnClose: boolean,
  selectedOption: any,
  skin: ComponentType<any>,
  selectedOptions: Array<any>,
  theme: Object, // if passed by user, it will take precedence over this.props.context.theme
  themeId: string,
  themeOverrides: Object
};

type State = {
  composedTheme: Object,
  highlightedOptionIndex: number
};

class OptionsBase extends Component<Props, State> {
  static defaultProps = {
    isOpen: false,
    isOpeningUpward: false,
    noResultsMessage: 'No results',
    resetOnClose: false,
    theme: null,
    themeId: IDENTIFIERS.OPTIONS,
    themeOverrides: {}
  };

  constructor(props: Props) {
    super(props);

    const { context, themeId, theme, themeOverrides } = props;

    this.state = {
      composedTheme: composeTheme(
        addThemeId(theme || context.theme, themeId),
        addThemeId(themeOverrides, themeId),
        context.ROOT_THEME_API
      ),
      highlightedOptionIndex: 0
    };
  }

  componentDidMount() {
    if (this.props.isOpen) {
      document.addEventListener('keydown', this._handleKeyDown, false);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.isOpen && nextProps.isOpen) {
      document.addEventListener('keydown', this._handleKeyDown, false);
    } else if (this.props.isOpen && !nextProps.isOpen) {
      document.removeEventListener('keydown', this._handleKeyDown, false);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._handleKeyDown, false);
  }

  close = () => {
    if (this.props.onClose) this.props.onClose();
    this.setState({
      highlightedOptionIndex: this.props.resetOnClose
        ? 0
        : this.state.highlightedOptionIndex
    });
  };

  getHighlightedOptionIndex = () => {
    // If nothing is higlighted, highlight selected option
    // In case nothing is selected, highlight first option
    const { options, isOpeningUpward } = this.props;
    const currentIndex = this.state.highlightedOptionIndex;
    let index = 0;

    if (currentIndex !== null) {
      index = currentIndex;
    }

    if (isOpeningUpward) return options.length - 1 - index;
    return index;
  };

  setHighlightedOptionIndex = (optionIndex: number) => {
    if (
      !this.isHighlightedOption(optionIndex) &&
      this.isDisabledOption(optionIndex)
    ) {
      this.setState({ highlightedOptionIndex: optionIndex });
    }
  };

  isSelectedOption = (optionIndex: number) => {
    const { options, isOpeningUpward } = this.props;
    const index = isOpeningUpward ? options.length - 1 - optionIndex : optionIndex;
    const option = options[index];
    return option && this.props.selectedOption === option;
  };

  isHighlightedOption = (optionIndex: number) => this.state.highlightedOptionIndex === optionIndex;

  isDisabledOption = (optionIndex: number) => {
    const { options } = this.props;
    const option = options[optionIndex];
    return option && !option.isDisabled;
  };

  handleClickOnOption = (option: ?Object, event: SyntheticEvent<>) => {
    if (option) {
      if (option.isDisabled) return;
      if (this.props.onChange) this.props.onChange(option, event);
    }
    if (this.props.onBlur) this.props.onBlur(event);
    this.close();
  };

  // returns an object containing props, theme, and method handlers
  // associated with rendering this.props.options, the user can call
  // this in the body of the renderOptions function
  getOptionProps = ({
    onClick,
    onMouseEnter,
    ...rest
  }: { onClick: Function, onMouseEnter: Function } = {}) => {
    const { isOpen, themeId, options, selectedOptions } = this.props;
    const { composedTheme } = this.state;
    const {
      isHighlightedOption,
      isDisabledOption,
      handleClickOnOption,
      setHighlightedOptionIndex
    } = this;

    return {
      options,
      selectedOptions,
      isOpen,
      isHighlightedOption,
      isDisabledOption,
      theme: composedTheme[themeId],
      onClick: (option: ?Object, event: SyntheticEvent<>) =>
        // the user's custom onClick event handler is composed with
        // the internal functionality of Options (this.handleClickOnOption)
        composeFunctions(onClick, handleClickOnOption)(option, event),
      onMouseEnter: (index: number, event: SyntheticMouseEvent<>) =>
        // user's custom onMouseEnter is composed with this.setHighlightedOptionIndex
        composeFunctions(onMouseEnter, setHighlightedOptionIndex)(index, event),
      ...rest
    };
  };

  // ========= PRIVATE HELPERS =========

  _handleSelectionOnKeyDown = (event: SyntheticKeyboardEvent<>) => {
    const { options } = this.props;
    if (options.length) {
      const { isOpeningUpward } = this.props;
      const currentIndex = this.state.highlightedOptionIndex;
      const reverseIndex = options.length - 1 - currentIndex;
      const highlightedOption =
        options[isOpeningUpward ? reverseIndex : currentIndex];
      this.handleClickOnOption(highlightedOption, event);
    } else {
      event.preventDefault();
    }
  };

  _handleHighlightMove = (currentIndex: number, direction: string) => {
    const { options } = this.props;
    if (options.length) {
      const lowerIndexBound = 0;
      const upperIndexBound = options.length - 1;
      let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      // Make sure new index is within options bounds
      newIndex = Math.max(lowerIndexBound, Math.min(newIndex, upperIndexBound));

      if (options[newIndex].isDisabled) {
        // Try to jump over disabled options
        const canMoveUp = newIndex > lowerIndexBound;
        const canMoveDown = newIndex < upperIndexBound;
        if (
          (direction === 'up' && canMoveUp) ||
          (direction === 'down' && canMoveDown)
        ) {
          this._handleHighlightMove(newIndex, direction);
        }
      } else {
        this.setHighlightedOptionIndex(newIndex);
      }
    }
  };

  // this needs to get passed to OptionsSkin and attached to each Option Li
  _handleKeyDown = (event: SyntheticKeyboardEvent<>) => {
    const highlightOptionIndex = this.state.highlightedOptionIndex;
    switch (event.keyCode) {
      case 9: // Tab key: selects currently highlighted option
        event.preventDefault();
        this._handleSelectionOnKeyDown(event);
        break;
      case 13: // Enter key: selects currently highlighted option
        event.preventDefault();
        this._handleSelectionOnKeyDown(event);
        break;
      case 32: // Space key: selects currently highlighted option
        event.preventDefault();
        this._handleSelectionOnKeyDown(event);
        break;
      case 27: // Escape key: closes options if open
        this.close();
        break;
      case 38: // Up Arrow key: moves highlighted selection 'up' 1 index
        event.preventDefault(); // prevent caret move
        this._handleHighlightMove(highlightOptionIndex, 'up');
        break;
      case 40: // Down Arrow key: moves highlighted selection 'down' 1 index
        event.preventDefault(); // prevent caret move
        this._handleHighlightMove(highlightOptionIndex, 'down');
        break;
      default:
        this.props.resetOnClose && this.setHighlightedOptionIndex(0);
    }
  };

  render() {
    // destructuring props ensures only the "...rest" get passed down
    const {
      skin: OptionsSkin,
      theme,
      themeOverrides,
      onChange,
      context,
      optionsRef,
      isOpen,
      ...rest
    } = this.props;

    const { composedTheme, highlightedOptionIndex } = this.state;

    return (
      <OptionsSkin
        optionsRef={optionsRef}
        theme={composedTheme}
        isOpen={isOpen}
        highlightedOptionIndex={highlightedOptionIndex}
        getHighlightedOptionIndex={this.getHighlightedOptionIndex}
        isSelectedOption={this.isSelectedOption}
        isHighlightedOption={this.isHighlightedOption}
        handleClickOnOption={this.handleClickOnOption}
        setHighlightedOptionIndex={this.setHighlightedOptionIndex}
        getOptionProps={this.getOptionProps}
        {...rest}
      />
    );
  }
}

export const Options = withTheme(OptionsBase);
