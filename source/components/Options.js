import React, { Component } from 'react';
import { bool, func, object, array, string } from 'prop-types';
import ReactDOM from 'react-dom';

// Options theme API
import { OPTIONS_THEME_API } from '../themes/API';

// internal utility functions
import composeTheme from '../utils/composeTheme.js';
import { StringOrElement } from '../utils/props';
import events from '../utils/events';

class Options extends Component {
  static propTypes = {
    isOpen: bool,
    isOpeningUpward: bool,
    resetOnClose: bool, // reset highlighted option on options close (e.g. in autocomplete)
    selectedOptionValue: string,
    noResults: bool,
    noResultsMessage: StringOrElement,
    onChange: func,
    onClose: func,
    options: array,
    optionRenderer: func,
    skin: func.isRequired,
    theme: object,
    themeOverrides: object,
    themeAPI: object
  };

  static defaultProps = {
    isOpen: false,
    isOpeningUpward: false,
    resetOnClose: false,
    noResultsMessage: 'No results',
    theme: {},
    themeOverrides: {},
    themeAPI: { ...OPTIONS_THEME_API }
  };

  static contextTypes = {
    theme: object
  };

  constructor(props, context) {
    super(props);

    const { themeOverrides, themeAPI } = props;

    const theme =
      context && context.theme && context.theme.options
        ? context.theme.options
        : props.theme;

    // if themeOverrides isn't provided, composeTheme returns theme obj immediately
    this.state = {
      composedTheme: composeTheme(theme, themeOverrides, themeAPI),
      isOpen: this.props.isOpen,
      highlightedOptionIndex: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState({ isOpen: nextProps.isOpen });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // update isOpen state when parent component force open / close options
    // (e.g. click on Input in Select component)
    if (!this.state.isOpen && nextState.isOpen) {
      window.addEventListener('resize', this._handleWindowResize);
      this.handleScrollEventListener('add');
      events.addEventsToDocument(this._getDocumentEvents());
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isOpen && !this.state.isOpen) this.removeAllEventListeners();
  }

  componentWillUnmount() {
    if (this.state.isOpen) this.removeAllEventListeners();
  }

  removeAllEventListeners() {
    events.removeEventsFromDocument(this._getDocumentEvents());
    window.removeEventListener('resize', this._handleWindowResize);
    this.handleScrollEventListener('remove');
  }

  getFirstScrollableParent = node => {
    if (node == null) return null;
    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return this.getFirstScrollableParent(node.parentNode);
    }
  };

  handleScrollEventListener = action => {
    const rootNode = this.optionsElement;
    const scrollableNode = this.getFirstScrollableParent(rootNode);
    if (scrollableNode) {
      if (action === 'add') {
        scrollableNode.addEventListener('scroll', this._handleScroll);
      } else if (action === 'remove') {
        scrollableNode.addEventListener('scroll', this._handleScroll);
      }
    }
  };

  open = () => {
    this.setState({
      isOpen: true,
      highlightedOptionIndex: this.props.resetOnClose
        ? 0
        : this.state.highlightedOptionIndex
    });
  };

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
    } else if (this.props.selectedOptionValue) {
      index = options.findIndex(
        option => option.value === this.props.selectedOptionValue
      );
    }
    if (isOpeningUpward) return options.length - 1 - index;
    return index;
  };

  setHighlightedOptionIndex = optionIndex => {
    if (
      !this.isHighlightedOption(optionIndex) &&
      this.isDisabledOption(optionIndex)
    ) {
      this.setState({ highlightedOptionIndex: optionIndex });
    }
  };

  isHighlightedOption = optionIndex => {
    return this.state.highlightedOptionIndex === optionIndex;
  };

  isDisabledOption = optionIndex => {
    const { options } = this.props;
    const option = options[optionIndex];
    return option && !option.isDisabled;
  };

  handleClickOnOption = (option, event) => {
    if (option) {
      if (option.isDisabled) return;
      if (this.props.onChange) this.props.onChange(option, event);
    }
    if (this.props.onBlur) this.props.onBlur(event);
    this.close();
  };

  // ========= PRIVATE HELPERS =========

  _handleSelectionOnEnterKey = event => {
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

  _handleHighlightMove = (currentIndex, direction) => {
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
    } else {
      event.preventDefault();
    }
  };

  _handleKeyDown = event => {
    const highlightOptionIndex = this.state.highlightedOptionIndex;
    switch (event.keyCode) {
      case 9: // Select currently highlighted option on Tab key
        event.preventDefault();
        this._handleSelectionOnEnterKey(event);
        break;
      case 13: // Select currently highlighted option on Enter key
        this._handleSelectionOnEnterKey(event);
        break;
      case 27: // Close on Escape key
        this.close();
        break;
      case 38: // Move selection higlight 'up' on Arrow Up key
        event.preventDefault(); // prevent caret move
        this._handleHighlightMove(highlightOptionIndex, 'up');
        break;
      case 40: // Move selection higlight 'down' on Arrow Down key
        event.preventDefault(); // prevent caret move
        this._handleHighlightMove(highlightOptionIndex, 'down');
        break;
      default:
        this.props.resetOnClose && this.setHighlightedOptionIndex(0);
    }
  };

  _handleDocumentClick = event => {
    const root = this.optionsElement;
    const isDescendant = events.targetIsDescendant(
      event,
      ReactDOM.findDOMNode(root)
    );

    if (this.state.isOpen && !isDescendant) {
      this.close();
    }
  };

  _handleWindowResize = () => this.state.isOpen && this.close();

  _handleScroll = () => this.state.isOpen && this.close();

  _getDocumentEvents() {
    return {
      keydown: this._handleKeyDown,
      click: this._handleDocumentClick,
      touchend: this._handleDocumentClick,
      scroll: this._handleScroll
    };
  }

  render() {
    // destructuring props ensures only the "...rest" get passed down
    const {
      skin: OptionsSkin,
      theme,
      themeOverrides,
      themeAPI,
      onChange,
      ...rest
    } = this.props;

    const { composedTheme, isOpen, highlightedOptionIndex } = this.state;

    return (
      <OptionsSkin
        optionsRef={el => (this.optionsElement = el)}
        theme={composedTheme}
        isOpen={isOpen}
        highlightedOptionIndex={highlightedOptionIndex}
        getHighlightedOptionIndex={this.getHighlightedOptionIndex}
        isHighlightedOption={this.isHighlightedOption}
        handleClickOnOption={this.handleClickOnOption}
        setHighlightedOptionIndex={this.setHighlightedOptionIndex}
        {...rest}
      />
    );
  }
}

// Options.contextTypes = {
//   theme: PropTypes.object
// };

export default Options;
