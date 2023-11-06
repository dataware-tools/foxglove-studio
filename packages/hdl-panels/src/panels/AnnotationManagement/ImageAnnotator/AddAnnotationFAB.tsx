import PanelContext from "@foxglove/studio-base/components/PanelContext";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import { SxProps } from "@mui/system";
import { useContext, useMemo } from "react";
import { useAnnotationsState } from "../stores/annotation";
import { useIsAdding } from "../stores/isAdding";
import { useCameraTopicState } from "../stores/topic";

export type AddAnnotationFABProps = {
  sx?: SxProps;
};

/**
 * @deprecated The component is deprecated and will be removed in a future release.
 */
export const AddAnnotationFAB = ({ sx }: AddAnnotationFABProps) => {
  const isAdding = useIsAdding((state) => state.isAdding);
  const startAdding = useIsAdding((state) => state.startAdding);
  const stopAdding = useIsAdding((state) => state.stopAdding);
  const cameraTopics = useCameraTopicState((state) => state.cameraTopics);
  const parentPanelContext = useContext(PanelContext);
  const panelId = useMemo(() => {
    return parentPanelContext?.id;
  }, [parentPanelContext]);
  const currentCameraTopic = useMemo(
    () => (panelId ? cameraTopics[panelId] : ""),
    [panelId, cameraTopics],
  );

  const editingAnnotationId = useAnnotationsState((state) => state.editingAnnotationId);
  const stopEditing = useAnnotationsState((state) => state.stopEditing);
  const removeAnnotation = useAnnotationsState((state) => state.removeAnnotation);

  const handleClick = () => {
    if (isAdding) {
      stopAdding();

      // Remove newly creating annotation if it exists
      if (editingAnnotationId) {
        removeAnnotation(editingAnnotationId);
        stopEditing();
      }
    } else {
      startAdding();
    }
  };

  // Disable button if camera topic is not selected, or if there is an editing existing annotation
  const disabled = currentCameraTopic === "" || (!isAdding && editingAnnotationId !== null);

  return (
    <Fab
      color={isAdding ? "error" : "primary"}
      variant="extended"
      sx={{
        "&.Mui-disabled": {
          backgroundColor: grey[300],
        },
        ...sx,
      }}
      onClick={handleClick}
      disabled={disabled}
    >
      <Stack direction="row" spacing={1}>
        {isAdding ? <ClearIcon /> : <AddIcon />}
        <Typography>{isAdding ? "Cancel" : "Add"}</Typography>
      </Stack>
    </Fab>
  );
};
