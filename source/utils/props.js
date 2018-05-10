// @flow
import filterReactDomProps from 'filter-react-dom-props';

// filters out / prevents invalid props from being rendered to the dom
// which would generate an error/warning
const pickDOMProps = filterReactDomProps;

const composeFunctions = (...fns: [Function, Function]) => (...args: [any, any]) =>
  fns.forEach(fn => fn && fn(...args));

export default {
  pickDOMProps,
  composeFunctions
};
