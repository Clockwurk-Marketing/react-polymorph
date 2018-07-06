// @flow
// $FlowFixMe
import type { SyntheticMouseEvent, SyntheticTouchEvent, SyntheticEvent, Element } from 'react';
/* eslint space-before-function-paren:0 */
export default {
  getMousePosition (event: SyntheticMouseEvent<>) {
    return {
      x: event.pageX - (window.scrollX || window.pageXOffset),
      y: event.pageY - (window.scrollY || window.pageYOffset)
    };
  },

  getTouchPosition (event: SyntheticTouchEvent<HTMLElement>) {
    return {
      x: event.touches[0].pageX - (window.scrollX || window.pageXOffset),
      y: event.touches[0].pageY - (window.scrollY || window.pageYOffset)
    };
  },

  pauseEvent (event: SyntheticEvent<HTMLElement>) {
    event.stopPropagation();
    event.preventDefault();
  },

  addDocumentListeners (eventMap: {}) {
    for (const key in eventMap) {
      if (Object.prototype.hasOwnProperty.call(eventMap, key)) {
        document.addEventListener(key, eventMap[key], false);
      }
    }
  },

  removeDocumentListeners (eventMap: {}) {
    for (const key in eventMap) {
      if (Object.prototype.hasOwnProperty.call(eventMap, key)) {
        document.removeEventListener(key, eventMap[key], false);
      }
    }
  },

  addWindowListeners (eventMap: {}) {
    for (const key in eventMap) {
      if (Object.prototype.hasOwnProperty.call(eventMap, key)) {
        window.addEventListener(key, eventMap[key]);
      }
    }
  },

  removeWindowListeners (eventMap: {}) {
    for (const key in eventMap) {
      if (Object.prototype.hasOwnProperty.call(eventMap, key)) {
        window.removeEventListener(key, eventMap[key]);
      }
    }
  },

  targetIsDescendant (event: SyntheticEvent<HTMLElement>, parent: ?Element<any>) {
    const clickedNode = event.target;

    // if the node exists,
    // the node is not the given parent,
    // and the node does not contain the parent,
    // then the node is a descendant of the parent
    if (clickedNode && parent && parent.contains(clickedNode) && !clickedNode.contains(parent)) {
      return true;
    }
    // if (clickedNode && clickedNode !== parent && !clickedNode.contains(parent)) {
    //   return true;
    // }
    // otherwise it is not a descendant of the given parent
    return false;
  },

  addEventListenerOnTransitionEnded (element: HTMLElement, fn: Function) {
    const eventName = transitionEventNamesFor(element);
    if (!eventName) return false;
    element.addEventListener(eventName, fn);
    return true;
  },

  removeEventListenerOnTransitionEnded (element: HTMLElement, fn: Function) {
    const eventName = transitionEventNamesFor(element);
    if (!eventName) return false;
    element.removeEventListener(eventName, fn);
    return true;
  }
};

// constants and helper functions /////////

const TRANSITIONS: {
  transition: string,
  OTransition: string,
  MozTransition: string,
  WebkitTransition: string
} = {
  transition: 'transitionend',
  OTransition: 'oTransitionEnd',
  MozTransition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd'
};

function transitionEventNamesFor (element: HTMLElement) {
  for (const transition in TRANSITIONS) {
    if (element && Object.prototype.hasOwnProperty.call(element.style, transition)) {
      return TRANSITIONS[transition];
    }
  }
}
