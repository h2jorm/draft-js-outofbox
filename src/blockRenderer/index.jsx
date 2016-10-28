import React from 'react';

import Link from './Link';

export default function blockRenderer(contentBlock) {
  const type = contentBlock.getType();
  return;
  switch (type) {
    case 'link':
      return {
        component: Link,
        editable: false,
      };
  }
}
