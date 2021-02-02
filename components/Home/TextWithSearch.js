import { useState } from "react";
import { Code, InputGroup, Input, Flex } from "@chakra-ui/react";

export default function TextWithSearch({ text }) {
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const injectTags = (textArr) => {
    return textArr
      .map((w) => {
        return w.replace(
          new RegExp(search, "gi"),
          `<span style="background: #ffc107">${search}</span>`
        );
      })
      .join("<br/>");
  };
  let filteredText = text.data.filter((w) =>
    w.toLowerCase().includes(search.toLowerCase())
  );

  filteredText =
    search !== "" ? injectTags(filteredText) : filteredText.join("<br/>");

  return (
    <Flex direction="column" w="clamp(320px, 80vw, 1000px)" mx="2em">
      <InputGroup size="md" my="0.5em">
        <Input
          pr="2.5rem"
          placeholder="Type to search"
          value={search}
          onChange={handleSearch}
        />
      </InputGroup>
      <Code
        // whiteSpace="pre-wrap"
        p="1em"
        dangerouslySetInnerHTML={{ __html: filteredText }}
      />
    </Flex>
  );
}

// {/* {JSON.stringify(filteredText, null, 2)} */}
