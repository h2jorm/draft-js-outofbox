import React from 'react';

import Link from './Link';

export default function blockRenderer(contentBlock) {
  const type = contentBlock.getType();
  console.log(type);
  switch (type) {
    case 'link':
      return {
        component: Link,
        editable: false,
      };

    case 'atomic':
      return {
        component: Media,
        editable: false,
      }
  }
}

const Media = props => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  const {src} = entity.getData();
  console.log(src);
  return <img src={src} />
}
