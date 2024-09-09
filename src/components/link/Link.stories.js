import React from 'react';
import { Link } from './index.tsx';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Link',
  component: Link,
};

//👇 We create a “template” of how args map to rendering
const Template = (args) => {
  return <Link {...args}></Link>;
};

//👇 Each story then reuses that template
export const Default = Template.bind({});
Default.args = {
  variant: 'primary',
  textColor: 'grey-2',
  children: 'Default Link',
};
