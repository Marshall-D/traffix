// Input.stories.js|jsx

import React from 'react';
import { Input } from './index.tsx';

export default {
  /*The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Input',
  component: Input,
};

//👇We create a “template” of how args map to rendering
const Template = (args) => <Input {...args} />;

//👇 Each story then reuses that template
export const Default = Template.bind({});
Default.args = {
  label: 'First Name',
  placeholder: 'Enter firstname',
};
