import React from 'react';

const Link = props => {
  const {block} = props;
  const {href, title} = parseLinkMeta(block.getText());
  return (
    <a href={href}>{title}</a>
  );
};

function parseLinkMeta(text) {
  // TODO: text.split(' ') is only for dev
  // const [href, title] = text.split(' ');
  return {title: text};
  return {href, title};
}

export default Link;
