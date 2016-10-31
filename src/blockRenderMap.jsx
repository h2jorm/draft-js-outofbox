import React from 'react';
import {Map} from 'immutable';
import {DefaultDraftBlockRenderMap} from './Draft/Draft';

const Image = props => {
  const {src} = props;
  return (
    <img src={src} />
  );
};

const Link = props => {
  return (
    <div>
      {props.children}
    </div>
  );
}

const blockRenderMap = Map({
  // 'link': {
  //   element: 'a',
  //   wrapper: <Link />
  // },
  // 'image': {
  //   element: 'cbn-image',
  // },
});

export default DefaultDraftBlockRenderMap.merge(blockRenderMap);
