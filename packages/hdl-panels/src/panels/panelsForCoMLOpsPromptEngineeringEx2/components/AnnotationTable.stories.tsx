import type { Meta, StoryObj } from "@storybook/react";

import { AnnotationTable } from "./AnnotationTable";

const meta: Meta<typeof AnnotationTable> = {
  component: AnnotationTable,
  title: "HDLComponents/componentsForCoMLOpsPromptEngineering/AnnotationTable",
};

export default meta;
type Story = StoryObj<typeof AnnotationTable>;

export const Basic: Story = {
  render: () => {
    return (
      <AnnotationTable
        onDelete={() => {}}
        onUpdate={() => {}}
        tagOptions={[
          { label: "TAG1", value: "tag1" },
          { label: "TAG2", value: "tag2" },
          { label: "TAG3", value: "tag3" },
        ]}
        annotations={[
          // @ts-expect-error ArbitraryAnnotation don't have commented_image_pixel
          {
            annotation: { note: "note1", tag_type: "tag_type1", tags: ["tag1"] },
            timestamp_from: 0,
            timestamp_to: 1,
            annotation_id: "annotation_id1",
            annotation_task_id: "annotation_task_id1",
            generation: 1,
            record_id: "record_id1",
            _kind: "ArbitraryAnnotation",
          },
          // @ts-expect-error ArbitraryAnnotation don't have commented_image_pixel
          {
            annotation: { note: "note2", tag_type: "tag_type2", tags: ["tag2", "tag3"] },
            timestamp_from: 2,
            timestamp_to: 3,
            annotation_id: "annotation_id2",
            annotation_task_id: "annotation_task_id2",
            generation: 1,
            record_id: "record_id2",
            _kind: "ArbitraryAnnotation",
          },
        ]}
      />
    );
  },
};
