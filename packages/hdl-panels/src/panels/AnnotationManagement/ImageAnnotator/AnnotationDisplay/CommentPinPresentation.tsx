import { Box, Paper, Skeleton, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import React from "react";
export type CommentPinPresentationProps = {
  left?: number;
  top?: number;
  index: number;
  comment: string;
  open?: boolean;
  offset?: number;
  placement?: "left-top" | "left-bottom" | "right-top" | "right-bottom" | undefined;
  isOnTime?: boolean;
  loading?: boolean;
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>;
  onMouseOut?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const CommentPinPresentation = ({
  index,
  comment,
  left = 0,
  top = 0,
  offset = 0,
  placement = "right-bottom",
  isOnTime = true,
  open = false,
  loading = false,
  onMouseOver = undefined,
  onMouseOut = undefined,
  onClick = undefined,
}: CommentPinPresentationProps) => {
  const theme = useTheme();
  const iconSize = theme.spacing(3);
  const objRef = React.useRef<HTMLDivElement>(null);
  return (
    <Box left={left} top={top} position="absolute" width="1px" height="1px" overflow="visible">
      <Tooltip
        title={isOnTime ? "Open comment" : "Seek to comment"}
        followCursor
        enterDelay={1000}
        enterNextDelay={1000}
      >
        <Paper
          ref={objRef}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onClick={onClick}
          elevation={isOnTime ? 4 : 2}
          sx={{
            backdropFilter: "blur(10px)",
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5),
            cursor: onClick ? "pointer" : "default",
            position: "absolute",
            p: open ? 1 : 0.5,
            top: placement === "left-top" || placement === "right-top" ? "auto" : offset,
            left: placement === "left-top" || placement === "left-bottom" ? "auto" : offset,
            right: placement === "right-top" || placement === "right-bottom" ? "auto" : offset,
            bottom: placement === "left-bottom" || placement === "right-bottom" ? "auto" : offset,
            width: (theme) => theme.spacing(open ? 30 : 4),
            height: (theme) => (open ? "auto" : theme.spacing(4)),
            overflow: "auto",
            borderRadius: (theme) => {
              const r = Number(theme.shape.borderRadius) * 8;
              switch (placement) {
                case "left-top":
                  return `${r}px ${r}px 0 ${r}px`;
                case "left-bottom":
                  return `${r}px 0 ${r}px ${r}px`;
                case "right-top":
                  return `${r}px ${r}px ${r}px 0`;
                case "right-bottom":
                  return `0 ${r}px ${r}px ${r}px`;
                default:
                  return `0 ${r}px ${r}px ${r}px`;
              }
            },
            transition: (theme) =>
              theme.transitions.create(["width", "height"], {
                duration: theme.transitions.duration.shortest,
              }),
          }}
        >
          <Stack height="100%" direction="row" spacing={1}>
            {loading ? (
              <Skeleton
                variant="circular"
                width={iconSize}
                height={iconSize}
                sx={{ flexShrink: 0 }}
              />
            ) : (
              <Box
                bgcolor={(theme) =>
                  isOnTime ? theme.palette.primary.dark : theme.palette.grey[500]
                }
                borderRadius={(theme) => Number(theme.shape.borderRadius) * 8}
                width={iconSize}
                height={iconSize}
                display="flex"
                flexShrink={0}
                justifyContent="center"
                alignItems="center"
              >
                <Typography
                  fontWeight={isOnTime ? "bold" : "normal"}
                  color={(theme) => theme.palette.getContrastText(theme.palette.primary.main)}
                >
                  {index}
                </Typography>
              </Box>
            )}
            <Box display={open ? "block" : "none"}>
              {loading ? (
                <>
                  <Skeleton variant="text" width={100} />
                  <Skeleton variant="text" width={100} />
                </>
              ) : (
                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                  }}
                >
                  {comment}
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      </Tooltip>
    </Box>
  );
};
