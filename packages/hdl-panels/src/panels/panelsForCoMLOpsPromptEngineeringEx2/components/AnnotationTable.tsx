import { Delete, Edit } from "@mui/icons-material";
import { Button, IconButton, LinearProgress } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { useCurrentTime } from "../../../hooks/useCurrentTime";
import { useSeekPlayback } from "../../../hooks/useSeekPlayback";
import { unixTimeToFoxgloveTime } from "../../../logics/time";
import { AnnotationPanelForCoMLOpsPromptEngineeringEx2, TagOptionsForEachTagType } from "../types";
import { AnnotationInputForm } from "./AnnotationInputForm";

type AnnotationUpdateEventHandler = (
  annotation: AnnotationPanelForCoMLOpsPromptEngineeringEx2,
) => Promise<void> | void;

const AnnotationTableRow = ({
  annotation,
  tagOptionsForEachTagType,
  highlight,
  onDelete,
  updating,
  hideTagType,
  onStartUpdate,
  onCancelUpdate,
  onSaveUpdate,
  onSeekToTimestamp,
}: {
  annotation: AnnotationPanelForCoMLOpsPromptEngineeringEx2;
  tagOptionsForEachTagType: TagOptionsForEachTagType;
  onDelete: AnnotationUpdateEventHandler;
  updating?: boolean;
  highlight?: boolean;
  hideTagType?: boolean;
  onStartUpdate: AnnotationUpdateEventHandler;
  onCancelUpdate: AnnotationUpdateEventHandler;
  onSaveUpdate: AnnotationUpdateEventHandler;
  onSeekToTimestamp: (unixTimestamp: number) => void;
}) => {
  const tagOptions = tagOptionsForEachTagType.find(
    (tagOptions) => tagOptions.tag_type.value === annotation.annotation.tag_type,
  )?.tag_options;

  const tags = annotation.annotation.tags
    .map((tag) => tagOptions?.find((tagOption) => tagOption.value === tag)?.label || tag)
    .join(", ");

  const tagType =
    tagOptionsForEachTagType.find(
      (tagOptions) => tagOptions.tag_type.value === annotation.annotation.tag_type,
    )?.tag_type.label || annotation.annotation.tag_type;

  const [deleting, setDeleting] = useState(false);
  return deleting ? (
    <TableRow>
      <TableCell colSpan={hideTagType ? 6 : 7}>
        <LinearProgress />
      </TableCell>
    </TableRow>
  ) : (
    <TableRow
      sx={{ backgroundColor: (theme) => (highlight ? theme.palette.action.selected : undefined) }}
    >
      {updating ? (
        <>
          <TableCell colSpan={hideTagType ? 5 : 6}>
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
              tagOptionsForEachTagType={tagOptionsForEachTagType}
              defaultValues={{
                tags:
                  tagOptions?.filter((tagOption) =>
                    annotation.annotation.tags.includes(tagOption.value),
                  ) ?? [],
                timestampFrom: annotation.timestamp_from ?? 0,
                timestampTo: annotation.timestamp_to ?? 0,
                note: annotation.annotation.note ?? "",
                tagType: annotation.annotation.tag_type,
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
          <TableCell
            align="center"
            onClick={() => onSeekToTimestamp(annotation.timestamp_from ?? 0)}
            sx={{
              cursor: "pointer",
              ":hover": { backgroundColor: (theme) => theme.palette.action.hover },
            }}
          >
            {annotation.timestamp_from}
          </TableCell>
          <TableCell
            sx={{
              cursor: "pointer",
              ":hover": { backgroundColor: (theme) => theme.palette.action.hover },
            }}
            align="center"
            onClick={() => onSeekToTimestamp(annotation.timestamp_to ?? 0)}
          >
            {annotation.timestamp_to}
          </TableCell>
          {!hideTagType && <TableCell align="center">{tagType}</TableCell>}
          <TableCell align="center">{tags}</TableCell>
          <TableCell align="center">{annotation.annotation.note}</TableCell>
          <TableCell align="center">
            <IconButton
              disabled={deleting}
              onClick={() => {
                onStartUpdate(annotation);
              }}
            >
              <Edit />
            </IconButton>
          </TableCell>
          <TableCell align="center">
            <IconButton
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                await onDelete(annotation);
                setDeleting(false);
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
  tagOptionsForEachTagType,
  highlightCurrentAnnotation,
  hideTagType,
  onDelete,
  onUpdate,
}: {
  annotations: AnnotationPanelForCoMLOpsPromptEngineeringEx2[];
  tagOptionsForEachTagType: TagOptionsForEachTagType;
  highlightCurrentAnnotation?: boolean;
  hideTagType?: boolean;
  onDelete: AnnotationUpdateEventHandler;
  onUpdate: AnnotationUpdateEventHandler;
}) => {
  const [updatingAnnotation, setUpdatingAnnotation] =
    useState<AnnotationPanelForCoMLOpsPromptEngineeringEx2 | null>(null);

  const { currentTimeInUnixTime } = useCurrentTime();
  const highlightAnnotationIds = highlightCurrentAnnotation
    ? annotations
        ?.filter(
          (annotation) =>
            annotation.timestamp_from &&
            annotation.timestamp_to &&
            currentTimeInUnixTime &&
            annotation.timestamp_from <= currentTimeInUnixTime &&
            currentTimeInUnixTime <= annotation.timestamp_to,
        )
        .map((annotation) => annotation.annotation_id)
    : [];

  const seekPlayback = useSeekPlayback();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="table for annotations">
        <TableHead>
          <TableRow>
            <TableCell align="center">開始時刻</TableCell>
            <TableCell align="center">終了時刻</TableCell>
            {!hideTagType && <TableCell align="center">タグの種類</TableCell>}
            <TableCell align="center">タグの値</TableCell>
            <TableCell align="center">備考</TableCell>
            <TableCell align="center" />
            <TableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {annotations.map((annotation) => (
            <AnnotationTableRow
              onSeekToTimestamp={(unixTimestamp) =>
                seekPlayback(unixTimeToFoxgloveTime(unixTimestamp))
              }
              key={annotation.annotation_id}
              highlight={highlightAnnotationIds.includes(annotation.annotation_id)}
              annotation={annotation}
              tagOptionsForEachTagType={tagOptionsForEachTagType}
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
