import { useState, useEffect } from "react";
import Head from "next/head";
import SubscribeForm from "../components/Home/SubscribeForm";
import Footer from "../components/Footer";
import { Flex, Code } from "@chakra-ui/react";
import Banner from "../components/Home/Banner";
import TryUpload from "../components/Home/TryUpload";
import TextWithSearch from "../components/Home/TextWithSearch";

export default function Home() {
  const [finalResults, setFinalResults] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <Flex direction="column" align="center" justify="space-around" w="100vw">
      <Head>
        <title>Docusear.ch</title>
        <link rel="icon" href="./images/docusearch.svg" />
      </Head>

      <Flex
        direction="column"
        align="center"
        justify="space-around"
        p={5}
        minW="clamp(320px, 80vw, 1000px)"
        // minWidth={["100vw", ]}
        minHeight="95vh"
      >
        <Banner />

        <SubscribeForm setHasSubmitted={setHasSubmitted} />

        <TryUpload
          finalResults={finalResults}
          setFinalResults={setFinalResults}
          hasSubmitted={hasSubmitted}
        />
      </Flex>

      {finalResults && <TextWithSearch text={finalResults} />}

      <Footer />
    </Flex>
  );
}
