import { Heading, Text } from "@chakra-ui/react";

export default function Banner() {
  return (
    <div>
      <Heading as="h1" size="3xl" textAlign="center">
        Docusear.ch
      </Heading>

      <Text fontSize="lg" textAlign="center">
        Upload, Analyze, and Organize Documents
      </Text>
    </div>
  );
}
