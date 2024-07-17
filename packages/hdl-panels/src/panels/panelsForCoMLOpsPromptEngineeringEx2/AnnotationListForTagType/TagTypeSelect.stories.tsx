import type { Meta, StoryObj } from "@storybook/react";

import { TagTypeSelect } from "./TagTypeSelect";

const meta: Meta<typeof TagTypeSelect> = {
  component: TagTypeSelect,
  title: "HDLComponents/componentsForCoMLOpsPromptEngineering/TagTypeSelect",
};

export default meta;
type Story = StoryObj<typeof TagTypeSelect>;

export const Basic: Story = {
  render: () => {
    return (
      <TagTypeSelect
        tagTypeOptions={[
          { label: "TEST1", value: "test1" },
          { label: "TEST2", value: "test2" },
        ]}
        tagType="test1"
        onChange={() => {}}
      />
    );
  },
};
