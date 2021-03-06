// @flow
import React from 'react';
import type { Ref, Element } from 'react';

// external libraries
import classnames from 'classnames';

type Props = {
  className: String,
  data: Object | Array<{}>,
  error: boolean | string | Element<*>,
  hasMoreData: boolean,
  isLoading: boolean,
  renderItems: Function,
  scrollContainerRef: Ref<*>,
  theme: Object,
  themeId: string
};

export const InfiniteScrollSkin = ({
  className,
  data,
  error,
  hasMoreData,
  isLoading,
  renderItems,
  scrollContainerRef,
  theme,
  themeId
}: Props) => (
  <div ref={scrollContainerRef} className={classnames([className, theme[themeId].root])}>
    {renderItems({
      data,
      error,
      hasMoreData,
      isLoading,
      theme: theme[themeId]
    })}
  </div>
);
