import PanelSetup from "@foxglove/studio-base/stories/PanelSetup";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { AnnotationInputForm } from "./AnnotationInputForm";

afterEach(cleanup);

describe("AnnotationInputForm", () => {
  it("should render", async () => {
    const { findByText, findByLabelText, findByRole } = render(
      <PanelSetup>
        <AnnotationInputForm
          tagOptionsForEachTagType={[
            {
              tag_type: { value: "tagType1", label: "Tag Type 1" },
              tag_options: [
                { value: "tagOption1", label: "Tag Option 1" },
                { value: "tagOption2", label: "Tag Option 2" },
              ],
            },
          ]}
          onSave={jest.fn()}
        />
      </PanelSetup>,
    );

    expect(await findByText("Tag Type 1")).toBeDefined();
    expect(await findByLabelText("開始時刻")).toBeDefined();
    expect(await findByLabelText("終了時刻")).toBeDefined();
    expect(await findByRole("button", { name: /追加/i })).toBeDefined();
    expect(await findByRole("button", { name: /再生中の時刻を開始時刻に入力/i })).toBeDefined();
    expect(await findByRole("button", { name: /再生中の時刻を終了時刻に入力/i })).toBeDefined();
  });

  it("should disable saving without valid input", async () => {
    const onSave = jest.fn();
    const { findByRole } = render(
      <PanelSetup>
        <AnnotationInputForm
          tagOptionsForEachTagType={[
            {
              tag_type: { value: "tagType1", label: "Tag Type 1" },
              tag_options: [
                { value: "tagOption1", label: "Tag Option 1" },
                { value: "tagOption2", label: "Tag Option 2" },
              ],
            },
          ]}
          onSave={jest.fn()}
        />
      </PanelSetup>,
    );

    const saveButton = await findByRole("button", { name: /追加/i });
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton);
    waitFor(async () => expect(await findByRole("button", { name: /追加/i })).toBeDefined());

    expect(onSave).not.toHaveBeenCalled();
  });

  it("should call onSave with the correct annotation", async () => {
    const onSave = jest.fn();
    const { findByRole } = render(
      <PanelSetup>
        <AnnotationInputForm
          tagOptionsForEachTagType={[
            {
              tag_type: { value: "tagType1", label: "Tag Type 1" },
              tag_options: [
                { value: "tagOption1", label: "Tag Option 1" },
                { value: "tagOption2", label: "Tag Option 2" },
              ],
            },
          ]}
          onSave={onSave}
          saveButtonLabel="Save"
          defaultValues={{
            tagType: "tagType1",
            tags: [{ value: "tagOption1", label: "Tag Option 1" }],
            note: "Note",
            timestampFrom: 1,
            timestampTo: 1,
          }}
        />
      </PanelSetup>,
    );

    // click save button and wait call function
    const saveButton = await findByRole("button", { name: /Save/i });
    expect(saveButton).toBeDefined();
    fireEvent.click(saveButton);
    waitFor(() => expect(onSave).toHaveBeenCalled());

    expect(onSave).toHaveBeenCalledWith({
      tagType: "tagType1",
      tags: [{ value: "tagOption1", label: "Tag Option 1" }],
      note: "Note",
      timestampFrom: 1,
      timestampTo: 1,
    });

    // check if save button is back to the screen after loading
    expect(await findByRole("button", { name: /Save/i })).toBeDefined();
  });
});
