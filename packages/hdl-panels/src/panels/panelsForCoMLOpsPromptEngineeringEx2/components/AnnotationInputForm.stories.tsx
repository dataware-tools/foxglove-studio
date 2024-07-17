import type { Meta, StoryObj } from "@storybook/react";

import { tagOptionsForEachTagType } from "src/panels/panelsForCoMLOpsPromptEngineeringEx2/_hardCordingValue";
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
      <AnnotationInputForm onSave={() => {}} tagOptionsForEachTagType={tagOptionsForEachTagType} />
    );
  },
};
