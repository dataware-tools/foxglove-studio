import { useAppTimeFormat } from "@foxglove/studio-base/hooks";
import {
  Delete as DeleteIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Collapse,
  IconButton,
  Link,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableRow,
  alpha,
  useTheme,
} from "@mui/material";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Highlighter from "react-highlight-words";
import Linkify from "react-linkify";
import { useIsOnTimestamp } from "../ImageAnnotator/AnnotationDisplay/utils";
import { useDeleteAnnotationAction } from "../hooks/useDeleteAnnotationAction";
import { useSeekPlaybackToAnnotation } from "../hooks/useSeekPlaybackToAnnotation";
import { useAnnotationsState } from "../stores/annotation";
import { Annotation } from "../types";
import { unixtimeToFoxgloveTime } from "../utils";
const AnnotationCell = memo<TableCellProps>((props: TableCellProps) => {
  return (
    <TableCell
      {...props}
      sx={{
        borderColor: (theme) => theme.palette.divider,
        verticalAlign: "middle !important",
        pt: 0,
        pb: 0,
        overflow: "hidden",
        ...props.sx,
      }}
    />
  );
});

const AnnotationDetailHeadCell = memo<TableCellProps>((props) => {
  return (
    <TableCell
      {...props}
      sx={{
        border: 0,
        minWidth: 120,
        verticalAlign: "top !important",
        px: 0,
        py: 0.5,
        overflow: "hidden",
        fontWeight: "bold",
        ...props.sx,
      }}
    />
  );
});
const AnnotationDetailCell = memo<TableCellProps>((props) => {
  return (
    <TableCell
      {...props}
      sx={{
        border: 0,
        width: "100%",
        verticalAlign: "top !important",
        px: 0,
        py: 0.5,
        overflow: "hidden",
        ...props.sx,
      }}
    />
  );
});

type AnnotationDetailCommentCellProps = {
  comment: string;
};

const AnnotationDetailCommentCell = memo<AnnotationDetailCommentCellProps>(
  ({ comment }) => {
    return (
      <AnnotationDetailCell sx={{ whiteSpace: "pre-wrap" }}>
        <Linkify
          componentDecorator={(href, text, key) => (
            <Link href={href} key={key} target="_blank" rel="noreferrer">
              {text}
            </Link>
          )}
        >
          {comment}
        </Linkify>
      </AnnotationDetailCell>
    );
  }
);

type ItemRowMenuProps = {
  annotation: Annotation;
  editing: boolean;
  selectAnnotation: () => void;
};
const ItemRowMenu = memo<ItemRowMenuProps>(
  ({ annotation, editing, selectAnnotation }) => {
    const { deleteAnnotationAction } = useDeleteAnnotationAction();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);
    const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <IconButton
          aria-label="more"
          id="card-actions-button"
          aria-controls={menuOpen ? "card-actions-menu" : undefined}
          aria-expanded={menuOpen ? "true" : undefined}
          aria-haspopup="true"
          size="small"
          onClick={handleMenuButtonClick}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
        <Menu
          id="card-actions-menu"
          MenuListProps={{
            "aria-labelledby": "card-actions-button",
          }}
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              width: "20ch",
            },
          }}
        >
          <MenuItem
            onClick={(e) => {
              handleMenuClose();
              // Select the annotation if it's not already selected
              if (!editing) selectAnnotation();
              deleteAnnotationAction(annotation);
              e.stopPropagation();
            }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }
);

export const AnnotationRow = ({
  annotation,
  highlightedTexts,
  setRef,
}: {
  annotation: Annotation;
  highlightedTexts: string[];
  setRef: (
    ref: React.RefObject<HTMLTableRowElement>,
    annotationId: string
  ) => void;
}) => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [isOpenedExplicitlyByUser, setIsOpenedExplicitlyByUser] =
    useState(false);
  useEffect(() => {
    setRef(ref, annotation.id);
  }, [annotation.id, ref, setRef]);

  const editingAnnotationId = useAnnotationsState(
    (state) => state.editingAnnotationId
  );
  const editingAnnotation = useAnnotationsState(
    (state) => state.editingAnnotation
  );
  const editingHasUpdate = useAnnotationsState(
    (state) => state.editingHasUpdate
  );
  const startEditing = useAnnotationsState((state) => state.startEditing);
  const stopEditing = useAnnotationsState((state) => state.stopEditing);
  const setHighlightingAnnotationId = useAnnotationsState(
    (state) => state.setHighlightingAnnotationId
  );
  const setTriggerShakingAnimation = useAnnotationsState(
    (state) => state.setTriggerShakingAnimation
  );

  const editing = editingAnnotationId === annotation.id;
  useEffect(() => {
    setOpen(isOpenedExplicitlyByUser);
  }, [isOpenedExplicitlyByUser]);

  const theme = useTheme();
  const seekPlaybackToAnnotation = useSeekPlaybackToAnnotation();

  // format timestamp
  const { formatTime } = useAppTimeFormat();
  const timestamp = useMemo(
    () => unixtimeToFoxgloveTime(annotation.timestamp_from),
    [annotation.timestamp_from]
  );
  const timestampStr = formatTime(timestamp);
  const isOnTimestamp = useIsOnTimestamp({ annotation });
  const selectAnnotation = useCallback(() => {
    if (editingAnnotationId && editingHasUpdate) {
      // Trigger shaking animation for comment card
      setTriggerShakingAnimation(true);
    } else {
      if (editing) {
        stopEditing();
      } else {
        if (seekPlaybackToAnnotation) {
          seekPlaybackToAnnotation(annotation);
        }
        if (editingAnnotationId !== null) {
          stopEditing();
        }
        if (isOnTimestamp) {
          startEditing(annotation.id);
        }
      }
    }
  }, [
    annotation,
    editing,
    editingAnnotationId,
    seekPlaybackToAnnotation,
    startEditing,
    stopEditing,
    editingHasUpdate,
    setTriggerShakingAnimation,
    isOnTimestamp,
  ]);

  // Required to copy annotation

  // Annotation or editingAnnotation for realtime refreshing
  const latestAnnotationComment = useMemo(() => {
    return editing && editingAnnotation?.comment
      ? editingAnnotation.comment
      : annotation.comment;
  }, [editing, editingAnnotation?.comment, annotation.comment]);

  return (
    <React.Fragment key={annotation.id}>
      <TableRow
        ref={ref}
        sx={{
          "&:hover": {
            backgroundColor: (theme) => theme.palette.action.hover,
          },
          boxShadow: (theme) =>
            `inset 0px 0px 0px 2.5px ${alpha(
              theme.palette.primary.dark,
              editing ? 1 : 0
            )}`,
          px: 1,
        }}
        onMouseEnter={() => setHighlightingAnnotationId(annotation.id)}
        onMouseLeave={() => setHighlightingAnnotationId(null)}
        onClick={selectAnnotation}
      >
        <AnnotationCell sx={{ paddingLeft: 0, paddingRight: 0 }}>
          <IconButton
            size="small"
            onClick={(e) => {
              setOpen(!open);
              if (!open) {
                setIsOpenedExplicitlyByUser(true);
              } else if (open && isOpenedExplicitlyByUser) {
                setIsOpenedExplicitlyByUser(false);
              }
              e.stopPropagation();
            }}
          >
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </AnnotationCell>
        <AnnotationCell>{annotation.index}</AnnotationCell>
        <AnnotationCell
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          {timestampStr}
        </AnnotationCell>
        <AnnotationCell
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          <Highlighter
            textToHighlight={latestAnnotationComment}
            searchWords={highlightedTexts || []}
            highlightStyle={{
              backgroundColor: theme.palette.text.primary,
              fontWeight: "bold",
              color: theme.palette.background.default,
            }}
          />
        </AnnotationCell>
        <AnnotationCell>
          {(annotation.type === "rect" || annotation.type === "point") && (
            <ItemRowMenu
              annotation={annotation}
              editing={editing}
              selectAnnotation={selectAnnotation}
            />
          )}
        </AnnotationCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} sx={{ p: 0, m: 0 }}>
          <Collapse
            in={open}
            unmountOnExit
            sx={{
              transitionTimingFunction: "ease",
              transitionProperty: "height",
            }}
          >
            <Box
              p={1}
              borderBottom={(theme) => `1px solid ${theme.palette.divider}`}
            >
              <Table sx={{ display: "inline-table" }}>
                <TableBody>
                  <TableRow sx={{ pb: 1 }}>
                    <AnnotationDetailHeadCell>Comment</AnnotationDetailHeadCell>
                    <AnnotationDetailCommentCell
                      comment={latestAnnotationComment}
                    />
                  </TableRow>
                  <TableRow>
                    <AnnotationDetailHeadCell>
                      Target topic
                    </AnnotationDetailHeadCell>
                    <AnnotationDetailCell>
                      {annotation.targetTopic}
                    </AnnotationDetailCell>
                  </TableRow>
                  <TableRow>
                    <AnnotationDetailHeadCell>Type</AnnotationDetailHeadCell>
                    <AnnotationDetailCell>
                      {annotation.type}
                    </AnnotationDetailCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
