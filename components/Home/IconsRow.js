import {
  Flex,
  CircularProgress,
  CircularProgressLabel,
  Img,
} from "@chakra-ui/react";
import { UPLOAD_STATE } from "../../constants/status";

export default function IconRow({
  progress1 = 0,
  progress2 = UPLOAD_STATE.NOT_STARTED,
  progress3 = false,
}) {
  let scanProgress = 0;

  if (progress2 === UPLOAD_STATE.COMPLETE) {
    scanProgress = 100;
  } else if (progress2 === UPLOAD_STATE.STARTED) {
    scanProgress = 50;
  } else {
    scanProgress = 0;
  }

  return (
    <Flex w="100%" direction="row" justify="space-between">
      <ProgressWithImage
        img="./images/upload-doc.svg"
        progress={progress1 || 0}
      />
      <ProgressWithImage
        img="./images/search-doc.svg"
        progress={scanProgress || 0}
        isIndeterminate={progress2 === UPLOAD_STATE.STARTED}
      />
      <ProgressWithImage
        img="./images/tag-doc.svg"
        progress={progress3 ? 100 : 0}
      />
    </Flex>
  );
}

function ProgressWithImage({ progress = null, img, isIndeterminate = false }) {
  return (
    <CircularProgress
      value={progress}
      isIndeterminate={isIndeterminate}
      color={progress === 100 ? "green.500" : "#0d6efd"}
      trackColor={progress ? "#e9e9e9" : "transparent"}
      size={["30vw", "20vw", "10vw"]}
      thickness="6"
    >
      <CircularProgressLabel>
        <Img
          src={img}
          w={["30vw", "20vw", "10vw"]}
          p={2}
          margin="auto"
          boxSizing="cover"
        />
      </CircularProgressLabel>
    </CircularProgress>
  );
}
