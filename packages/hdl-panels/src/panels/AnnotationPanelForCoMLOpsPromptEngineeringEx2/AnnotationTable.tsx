import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AnnotationPanelForCoMLOpsPromptEngineeringEx2, TagOptions } from "./types";

const AnnotationTableRow = ({
  annotation,
  tagOptions,
}: {
  annotation: AnnotationPanelForCoMLOpsPromptEngineeringEx2;
  tagOptions: TagOptions;
}) => {
  const tagsJp = annotation.annotation.tags
    .map((tag) => tagOptions.find((tagOption) => tagOption.value === tag)?.label)
    .join(", ");

  const timestampFromISOString = new Date((annotation.timestamp_from ?? 0) * 1000).toISOString();
  const timestampToISOString = new Date((annotation.timestamp_to ?? 0) * 1000).toISOString();
  return (
    <TableRow>
      <TableCell align="center">{timestampFromISOString}</TableCell>
      <TableCell align="center">{timestampToISOString}</TableCell>
      <TableCell align="center">{tagsJp}</TableCell>
      <TableCell align="center">
        <IconButton>
          <Edit />
        </IconButton>
      </TableCell>
      <TableCell align="center">
        <IconButton>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
export const AnnotationTable = ({
  annotations,
  tagType,
  tagOptions,
}: {
  annotations: AnnotationPanelForCoMLOpsPromptEngineeringEx2[];
  tagType: string;
  tagOptions: TagOptions;
}) => {
  const filteredAnnotations = annotations
    .filter((annotation) => annotation.annotation.tag_type === tagType)
    .sort((a, b) =>
      a.timestamp_from && b.timestamp_from ? a.timestamp_from - b.timestamp_from : 0,
    );

  return (
    <TableContainer component={Paper}>
      <Table aria-label="table for annotations">
        <TableHead>
          <TableRow>
            <TableCell align="center">開始時刻</TableCell>
            <TableCell align="center">終了時刻</TableCell>
            <TableCell align="center">タグの値</TableCell>
            <TableCell align="center" />
            <TableCell align="center" />
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAnnotations.map((annotation) => (
            <AnnotationTableRow
              key={annotation.annotation_id}
              annotation={annotation}
              tagOptions={tagOptions}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
