import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Card from "./Card";
import { Flex, Text, Button } from "@chakra-ui/react";

export default function MyDropzone({ updateFiles }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 2000);
    }
  }, [error]);
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    if (acceptedFiles.some((a) => a.size > 1000000)) {
      setError("File cannot be larger than 1 MB for demo");
      return;
    }

    if (acceptedFiles.some((a) => !/\/pdf|\/jpeg|\/png|text/.test(a.type))) {
      setError("Not a supported file type at this time");
      return;
    }

    // only accept first file, we should be passing up an array with 1 item
    updateFiles([[...acceptedFiles][0]]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <Card
        padding={"0.5em"}
        width="100%"
        mb={"0.5em"}
        rounded="md"
        bg="white"
        boxShadow={isDragActive ? "2xl" : "outline"}
        bg={isDragActive ? "#0d6efd99" : "#FFFFFF"}
        // {...getRootProps()}
      >
        <input {...getInputProps()} />
        {error ? (
          <Text textAlign="center" color="red.500">
            {error}
          </Text>
        ) : (
          <Flex
            width={"100%"}
            justify="center"
            align="center"
            {...getRootProps()}
          >
            <Text>Try it out! Drop a file or </Text>
            <Button size="sm" ml={"0.25em"}>
              Upload
            </Button>
          </Flex>
        )}
      </Card>
      <Text fontSize="xs" textAlign="center">
        Files in this demo are publicly accessible so be mindful of what you
        upload!
      </Text>
    </>
  );
}
