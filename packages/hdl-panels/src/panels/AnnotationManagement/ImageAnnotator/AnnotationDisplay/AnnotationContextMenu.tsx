import { Menu, MenuItem } from "@mui/material";
import { MouseEvent } from "react";
import { useCopyAnnotationAction } from "../../hooks/useCopyAnnotationAction";
import { useDeleteAnnotationAction } from "../../hooks/useDeleteAnnotationAction";
import { useAnnotationsState } from "../../stores/annotation";

export const AnnotationContextMenu = (props: {
  annotationId: string;
  contextMenuEvent: MouseEvent<HTMLDivElement>["nativeEvent"] | undefined;
  handleClose: () => void;
}) => {
  const { copyAnnotationAction } = useCopyAnnotationAction();
  const { deleteAnnotationAction, confirmModal } = useDeleteAnnotationAction();
  const annotation = useAnnotationsState((state) => state.getAnnotation(props.annotationId));
  return (
    <>
      {confirmModal}
      {props.contextMenuEvent && (
        <Menu
          open={props.contextMenuEvent !== undefined}
          onClose={props.handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            props.contextMenuEvent !== null
              ? {
                  top: props.contextMenuEvent.clientY,
                  left: props.contextMenuEvent.clientX,
                }
              : undefined
          }
        >
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              copyAnnotationAction(props.annotationId);
              props.handleClose();
            }}
          >
            Copy
          </MenuItem>
          {annotation && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                deleteAnnotationAction(annotation);
                props.handleClose();
              }}
            >
              Delete
            </MenuItem>
          )}
        </Menu>
      )}
    </>
  );
};
