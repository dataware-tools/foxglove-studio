import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";
import type { Meta, StoryObj } from "@storybook/react";

import { tagOptionsForEachTagType } from "../_hardCordingValue";
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
      <PanelSetup>
        <AnnotationInputForm
          onSave={() => {}}
          tagOptionsForEachTagType={tagOptionsForEachTagType}
        />
      </PanelSetup>
    );
  },
};
