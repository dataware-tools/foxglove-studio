import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { AnnotationInputForm } from "./AnnotationInputForm";
import { AnnotationPanelForCoMLOpsPromptEngineeringEx2, TagOptions } from "./types";

type AnnotationUpdateEventHandler = (
  annotation: AnnotationPanelForCoMLOpsPromptEngineeringEx2,
) => Promise<void> | void;

const AnnotationTableRow = ({
  annotation,
  tagOptions,
  onDelete,
  updating,
  onStartUpdate,
  onCancelUpdate,
  onSaveUpdate,
}: {
  annotation: AnnotationPanelForCoMLOpsPromptEngineeringEx2;
  tagOptions: TagOptions;
  onDelete: AnnotationUpdateEventHandler;
  updating?: boolean;
  onStartUpdate: AnnotationUpdateEventHandler;
  onCancelUpdate: AnnotationUpdateEventHandler;
  onSaveUpdate: AnnotationUpdateEventHandler;
}) => {
  const tagsJp = annotation.annotation.tags
    .map((tag) => tagOptions.find((tagOption) => tagOption.value === tag)?.label)
    .join(", ");

  // const timestampFromISOString = new Date((annotation.timestamp_from ?? 0) * 1000).toISOString();
  // const timestampToISOString = new Date((annotation.timestamp_to ?? 0) * 1000).toISOString();

  return (
    <TableRow>
      {updating ? (
        <>
          <TableCell colSpan={5}>
            <AnnotationInputForm
              onSave={(userInputAnnotation) =>
                onSaveUpdate({
                  ...annotation,
                  annotation: {
                    tag_type: userInputAnnotation.tagType,
                    tags: userInputAnnotation.tags.map((tag) => tag.value),
                    note: userInputAnnotation.note,
                  },
                  timestamp_from: userInputAnnotation.timestampFrom,
                  timestamp_to: userInputAnnotation.timestampTo,
                })
              }
              saveButtonLabel="更新"
              tagOptions={tagOptions}
              tagType={annotation.annotation.tag_type}
              defaultValues={{
                tags: tagOptions.filter((tagOption) =>
                  annotation.annotation.tags.includes(tagOption.value),
                ),
                timestampFrom: annotation.timestamp_from ?? 0,
                timestampTo: annotation.timestamp_to ?? 0,
                note: annotation.annotation.note ?? "",
              }}
            />
          </TableCell>
          <TableCell>
            <Button
              onClick={() => {
                onCancelUpdate(annotation);
              }}
            >
              キャンセル
            </Button>
          </TableCell>
        </>
      ) : (
        <>
          <TableCell align="center">{annotation.timestamp_from}</TableCell>
          <TableCell align="center">{annotation.timestamp_to}</TableCell>
          <TableCell align="center">{tagsJp}</TableCell>
          <TableCell align="center">{annotation.annotation.note}</TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() => {
                onStartUpdate(annotation);
              }}
            >
              <Edit />
            </IconButton>
          </TableCell>
          <TableCell align="center">
            <IconButton
              onClick={() => {
                onDelete(annotation);
              }}
            >
              <Delete />
            </IconButton>
          </TableCell>
        </>
      )}
    </TableRow>
  );
};

export const AnnotationTable = ({
  annotations,
  tagOptions,
  onDelete,
  onUpdate,
}: {
  annotations: AnnotationPanelForCoMLOpsPromptEngineeringEx2[];
  tagOptions: TagOptions;
  onDelete: AnnotationUpdateEventHandler;
  onUpdate: AnnotationUpdateEventHandler;
}) => {
  const [updatingAnnotation, setUpdatingAnnotation] =
    useState<AnnotationPanelForCoMLOpsPromptEngineeringEx2 | null>(null);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="table for annotations">
        <TableHead>
          <TableRow>
            <TableCell align="center">開始時刻</TableCell>
            <TableCell align="center">終了時刻</TableCell>
            <TableCell align="center">タグの値</TableCell>
            <TableCell align="center">備考</TableCell>
            <TableCell align="center" />
            <TableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {annotations.map((annotation) => (
            <AnnotationTableRow
              key={annotation.annotation_id}
              annotation={annotation}
              tagOptions={tagOptions}
              onDelete={onDelete}
              updating={updatingAnnotation?.annotation_id === annotation.annotation_id}
              onStartUpdate={() => setUpdatingAnnotation(annotation)}
              onCancelUpdate={() => setUpdatingAnnotation(null)}
              onSaveUpdate={async (annotation) => {
                await onUpdate(annotation);
                setUpdatingAnnotation(null);
              }}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
