import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { AnnotationForCoMLOpsPromptEngineeringEx2, TagOptionsForEachTagType } from "../types";
import { AnnotationTable } from "./AnnotationTable";

afterEach(cleanup);

const defaultProps = {
  // @ts-expect-error Arbitrary annotation does not have commented_point field
  annotations: [
    {
      annotation_id: "annotation_id",
      annotation_task_id: "annotation_task_id",
      timestamp_from: 11111,
      timestamp_to: 22222,
      annotation: {
        note: "note",
        tag_type: "tagType1",
        tags: ["tagOption1", "tagOption2"],
      },
      generation: 0,
      record_id: "record_id",
    },
  ] as AnnotationForCoMLOpsPromptEngineeringEx2,
  tagOptionsForEachTagType: [
    {
      tag_type: { value: "tagType1", label: "Tag Type 1" },
      tag_options: [
        { value: "tagOption1", label: "Tag Option 1" },
        { value: "tagOption2", label: "Tag Option 2" },
      ],
    },
  ] as TagOptionsForEachTagType,
};

describe("AnnotationTable", () => {
  it("should render", async () => {
    const { findByText, findByRole } = render(
      <PanelSetup>
        {/* @ts-expect-error Arbitrary annotation does not have commented_point field */}
        <AnnotationTable
          {...defaultProps}
          onSeekToTimestamp={jest.fn()}
          onUpdate={jest.fn()}
          onDelete={jest.fn()}
        />
      </PanelSetup>,
    );

    expect(await findByText("Tag Option 1, Tag Option 2")).toBeDefined();
    expect(await findByText("Tag Type 1")).toBeDefined();
    expect(await findByText("note")).toBeDefined();
    expect(await findByText("11111")).toBeDefined();
    expect(await findByText("22222")).toBeDefined();
    expect(await findByRole("button", { name: /delete/i }));
    expect(await findByRole("button", { name: /update/i }));
  });

  it("should call the handler for updating annotation is called with correct annotation", async () => {
    const onUpdate = jest.fn();
    const { findByRole } = render(
      <PanelSetup>
        {/* @ts-expect-error Arbitrary annotation does not have commented_point field */}
        <AnnotationTable
          {...defaultProps}
          onUpdate={onUpdate}
          onDelete={jest.fn()}
          onSeekToTimestamp={jest.fn()}
        />
      </PanelSetup>,
    );

    const startUpdateButton = await findByRole("button", { name: /update/i });
    fireEvent.click(startUpdateButton);
    const saveUpdateButton = await findByRole("button", { name: /更新/i });
    fireEvent.click(saveUpdateButton);
    waitFor(() => expect(onUpdate).toHaveBeenCalled());

    expect(onUpdate).toHaveBeenCalledWith({
      annotation_id: "annotation_id",
      annotation_task_id: "annotation_task_id",
      generation: 0,
      record_id: "record_id",
      annotation: { note: "note", tag_type: "tagType1", tags: ["tagOption1", "tagOption2"] },
      timestamp_from: 11111,
      timestamp_to: 22222,
    });

    // check if update button is back to the screen after loading
    expect(await findByRole("button", { name: /update/i })).toBeDefined();
  });

  it("should cancel calling the handler for updating annotation if cancel button clicked", async () => {
    const onUpdate = jest.fn();
    const { findByRole } = render(
      <PanelSetup>
        {/* @ts-expect-error Arbitrary annotation does not have commented_point field */}
        <AnnotationTable
          {...defaultProps}
          onUpdate={onUpdate}
          onDelete={jest.fn()}
          onSeekToTimestamp={jest.fn()}
        />
      </PanelSetup>,
    );

    const startUpdateButton = await findByRole("button", { name: /update/i });
    fireEvent.click(startUpdateButton);
    const cancelUpdateButton = await findByRole("button", { name: /キャンセル/i });
    fireEvent.click(cancelUpdateButton);
    waitFor(() => expect(onUpdate).not.toHaveBeenCalled());

    // check if update button is back to the screen after loading
    expect(await findByRole("button", { name: /update/i })).toBeDefined();
  });

  it("should call the handler for deleting annotation is called with correct annotation", async () => {
    const onDelete = jest.fn();
    const { findByRole } = render(
      <PanelSetup>
        {/* @ts-expect-error Arbitrary annotation does not have commented_point field */}
        <AnnotationTable
          {...defaultProps}
          onUpdate={jest.fn()}
          onDelete={onDelete}
          onSeekToTimestamp={jest.fn()}
        />
      </PanelSetup>,
    );

    const deleteButton = await findByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    waitFor(() => expect(onDelete).toHaveBeenCalled());

    expect(onDelete).toHaveBeenCalledWith({
      annotation_id: "annotation_id",
      annotation_task_id: "annotation_task_id",
      generation: 0,
      record_id: "record_id",
      annotation: { note: "note", tag_type: "tagType1", tags: ["tagOption1", "tagOption2"] },
      timestamp_from: 11111,
      timestamp_to: 22222,
    });

    // check if delete button is back to the screen after loading
    expect(await findByRole("button", { name: /delete/i })).toBeDefined();
  });
  it("should call the handler for seeking rosbag is called with correct timestamp", async () => {
    const onSeekToTimestamp = jest.fn();
    const { findByText } = render(
      <PanelSetup>
        {/* @ts-expect-error Arbitrary annotation does not have commented_point field */}
        <AnnotationTable
          {...defaultProps}
          onUpdate={jest.fn()}
          onDelete={jest.fn()}
          onSeekToTimestamp={onSeekToTimestamp}
        />
      </PanelSetup>,
    );

    // check if the handler for seeking to timestamp is called with correct timestamp
    const timestampFrom = await findByText("11111");
    const timestampTo = await findByText("22222");
    fireEvent.click(timestampFrom);
    expect(onSeekToTimestamp).toHaveBeenCalledWith(11111);
    fireEvent.click(timestampTo);
    expect(onSeekToTimestamp).toHaveBeenCalledWith(22222);
  });
});
