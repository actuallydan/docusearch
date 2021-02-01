import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { fretch } from "../../utils/fetch-wrapper";
import { generateUUID } from "../../utils/helpers";
import Dropzone from "../Dropzone";
import IconsRow from "./IconsRow";
import API from "../../utils/api";
import { UPLOAD_STATE } from "../../constants/status";
import Card from "../Card";

export default function TryUpload({
  setFinalResults,
  finalResults,
  hasSubmitted,
}) {
  const [files, setFiles] = useState([]);

  // % of files that have settled presign request
  const [percentPrepped, setPercentPrepped] = useState(0);
  const [percentUploaded, setPercentUploaded] = useState(0);

  const [step2InProgress, setStep2InProgress] = useState(
    UPLOAD_STATE.NOT_STARTED
  );
  const [targetFile, setTargetFile] = useState(null);
  const [hasWaited, setHasWaited] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasSubmitted && targetFile) {
      API.updateRecord({
        id: targetFile,
        email: localStorage.getItem("subscriberEmail"),
      });
    }
  }, [hasSubmitted]);

  useEffect(() => {
    if (!targetFile) {
      setHasWaited(false);
    }
    if (targetFile) {
      // after waiting so many seconds, prompt them to sign up and wait for notification
      let timeout = setTimeout(() => {
        setHasWaited(true);
      }, [10000]);

      // after successfully submitting job, watch and listen for db to show valid result
      let interval = setInterval(() => {
        fretch("/api/records/" + targetFile)
          .then((res) => {
            if (res?.data?.data) {
              clearInterval(interval);
              setStep2InProgress(UPLOAD_STATE.COMPLETE);
              setTargetFile(null);
              setFinalResults(res.data);
              clearTimeout(timeout);
            }
          })
          .catch((err) => {
            console.error(err);
            clearInterval(interval);
            clearTimeout(timeout);
          });
      }, 4000);
    }

    () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [targetFile]);

  // upload on drop instead of waiting for a button press
  useEffect(() => {
    if (files.length !== 0) {
      upload();
    }
  }, [files]);

  function allProgress(proms, progress_cb) {
    let d = 0;
    progress_cb(0);
    for (const p of proms) {
      p.then(() => {
        d++;
        progress_cb((d * 100) / proms.length);
      });
    }
    return Promise.allSettled(proms);
  }

  async function upload() {
    if (files.length === 0) {
      return;
    }

    let newFiles = files.map(
      (f) => new File([f], generateUUID(f.name), { type: f.type })
    );

    const promises = newFiles.map((file) => {
      return fretch("/api/get-upload-url", {
        name: file.name,
        type: file.type,
        size: file.size,
      });
    });

    if (promises.some((p) => p.error)) {
      setError(files[0].error);
      setFiles([]);
      return;
    }
    // get array of presigned urls for uploading each file
    const res1 = await allProgress(promises, setPercentPrepped);

    // don't try to upload files with issues/too big
    const filesWithValidUrl = res1.filter(
      (response) => response.status !== "rejected"
    );

    // create array of upload promises
    const promises2 = filesWithValidUrl.map((response, i) => {
      return API.uploadToAWS(response.value.postURL, newFiles[i]);
    });

    // wait for all promises to settle
    const res2 = await allProgress(promises2, setPercentUploaded);

    const successful = res2
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
    const failed = res2.filter((r) => r.status === "rejected");

    // save to DB for this user & kick off textract
    let finalResponse = await fretch("/api/save-file", {
      files: successful,
      email: localStorage.getItem("subscriberEmail") || null,
    });
    // start listening for a result to come in
    setTargetFile(finalResponse.files[0]);
    setStep2InProgress(UPLOAD_STATE.STARTED);
  }

  const step1progress = (percentPrepped + percentUploaded) / 2;

  return (
    <Box width="100%">
      {step1progress > 0 ? (
        <IconsRow
          progress1={step1progress}
          progress2={step2InProgress}
          progress3={!!finalResults}
        />
      ) : (
        <Dropzone updateFiles={setFiles} files={null} />
      )}
      {hasWaited && !hasSubmitted && !finalResults && (
        <Card
          padding={"0.5em"}
          width="100%"
          my={"2em"}
          rounded="md"
          bg="white"
          boxShadow={"outline"}
          bg={"#FFFFFF"}
        >
          <Text textAlign="center">
            Don't want to wait? Sign up and we'll let you know when it's ready!
          </Text>
        </Card>
      )}
      {hasWaited && hasSubmitted && !finalResults && (
        <Card
          padding={"0.5em"}
          width="100%"
          my={"2em"}
          rounded="md"
          bg="white"
          boxShadow={"outline"}
          bg={"#FFFFFF"}
        >
          <Text textAlign="center">
            Don't want to wait? You signed up, so we'll email you with your
            results!
          </Text>
        </Card>
      )}
    </Box>
  );
}
