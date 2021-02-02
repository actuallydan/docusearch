import { Text, Flex, Alert } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Alert status="info" variant="top-accent">
      <Flex w="100vw" justify="center" align="center" p="0.5em">
        <Text textAlign="center" fontWeight="bold">
          Docusear.ch - {new Date().getFullYear()}
        </Text>
      </Flex>
    </Alert>
  );
}
