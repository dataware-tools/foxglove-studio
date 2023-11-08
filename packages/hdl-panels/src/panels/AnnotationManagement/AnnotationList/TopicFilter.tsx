import { Check as CheckIcon, FilterAlt as FilterAltIcon } from "@mui/icons-material";
import {
  Badge,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useCameraTopicState } from "../stores/topic";
import { Annotation } from "../types";

type CustomMenuItemProps = {
  text: string;
  selected: boolean;
  onClick: React.MouseEventHandler;
};
const CustomMenuItem = (props: CustomMenuItemProps) => {
  return (
    <MenuItem onClick={props.onClick}>
      <ListItemIcon sx={{ opacity: props.selected ? 1 : 0 }}>
        <CheckIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>{props.text}</ListItemText>
    </MenuItem>
  );
};

type TopicFilterProps = {
  annotations?: Annotation[];
  setSelectedTopics: Dispatch<SetStateAction<string[] | undefined>>;
};

export const TopicFilter = ({ annotations, setSelectedTopics }: TopicFilterProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const allTopicNames = useMemo(() => {
    return Array.from(new Set(annotations?.map((annotation) => annotation.targetTopic)));
  }, [annotations]);
  const cameraTopics = useCameraTopicState((state) => state.cameraTopics);
  const openedTopicNames = useMemo(() => {
    return Array.from(new Set(Object.values(cameraTopics)));
  }, [cameraTopics]);

  const [selectedItem, setSelectedItem] = useState<string>("all");

  useEffect(() => {
    switch (selectedItem) {
      case "all":
        setSelectedTopics(undefined);
        break;
      case "panels":
        setSelectedTopics(openedTopicNames);
        break;
      default:
        setSelectedTopics([selectedItem]);
        break;
    }
  }, [selectedItem, openedTopicNames, setSelectedTopics]);

  return (
    <>
      <Badge variant="dot" color="secondary" overlap="circular" invisible={selectedItem === "all"}>
        <IconButton size="small" onClick={(e) => handleClick(e)}>
          <FilterAltIcon />
        </IconButton>
      </Badge>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <CustomMenuItem
          text="All Topics"
          selected={selectedItem === "all"}
          onClick={() => {
            setSelectedItem("all");
            handleClose();
          }}
        />
        <CustomMenuItem
          text="Topics in ImageAnnotator panels"
          selected={selectedItem === "panels"}
          onClick={() => {
            setSelectedItem("panels");
            handleClose();
          }}
        />
        <Divider sx={{ my: 0.5 }} />
        {allTopicNames.map(
          (topicName, i) =>
            topicName && (
              <CustomMenuItem
                text={topicName}
                selected={selectedItem === topicName}
                key={i}
                onClick={() => {
                  setSelectedItem(topicName);
                  handleClose();
                }}
              />
            ),
        )}
      </Menu>
    </>
  );
};
