import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { AnnotationTable } from "./AnnotationTable";
import { TagTypeSelect } from "./TagTypeSelect";
import { tagOptionsForEachTagType } from "./_hardCordingValue";
import { useServerAnnotations } from "./apiClients";

export const AnnotatorForCoMLOpsPromptEngineeringEx2 = () => {
  const { annotations } = useServerAnnotations();

  const [tagType, setTagType] = useState<string>(tagOptionsForEachTagType[0]?.tag_type_en ?? "");

  const tagOptions = tagOptionsForEachTagType
    .find((tagOptions) => tagOptions.tag_type_en === tagType)
    ?.tag_list.map((tag) => ({ label: tag.jp, value: tag.en }));

  return (
    <Stack overflow="hidden" height={"100%"}>
      <Box flexGrow={0} flexShrink={0}>
        <TagTypeSelect
          tagType={tagType}
          tagTypeOptions={tagOptionsForEachTagType.map((tagType) => ({
            label: tagType.tag_type_jp,
            value: tagType.tag_type_en,
          }))}
          onChange={(event) => {
            setTagType(event.target.value as string);
          }}
        />
      </Box>
      <Box flexGrow={1} flexShrink={1}>
        <AnnotationTable
          annotations={annotations ?? []}
          tagType={tagType}
          tagOptions={tagOptions ?? []}
        />
      </Box>
    </Stack>
  );
};
