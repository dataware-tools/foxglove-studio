import type { Meta, StoryObj } from "@storybook/react";

import { AnnotationInputForm } from "./AnnotationInputForm";

const meta: Meta<typeof AnnotationInputForm> = {
  component: AnnotationInputForm,
  title: "HDLComponents/componentsForCoMLOpsPromptEngineering/AnnotationInputForm",
};

export default meta;
type Story = StoryObj<typeof AnnotationInputForm>;

export const Basic: Story = {
  render: () => {
    return (
      <AnnotationInputForm
        onSave={() => {}}
        tagOptions={[
          { label: "test1", value: "test1" },
          { label: "test2", value: "test2" },
        ]}
        tagType="test1"
      />
    );
  },
};
