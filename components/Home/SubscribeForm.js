import { useState } from "react";
import { fretch } from "../../utils/fetch-wrapper";
import {
  InputGroup,
  Input,
  Button,
  InputRightElement,
  FormControl,
  FormHelperText,
  FormLabel,
  Flex,
  Text,
} from "@chakra-ui/react";
import Card from "../Card";

export default function SubscribeForm(props) {
  const [email, setEmail] = useState("");
  const [hasSubmitted, setSubmitted] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (
      email.trim() === "" ||
      email.trim().length < 3 ||
      !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email.trim())
    ) {
      makeInvalid("Please enter a valid email");
      return;
    }

    setLoading(true);
    fretch("/api/subscribe", { email })
      .then((data) => {
        if (data.error) {
          throw data.error.message;
        }
        localStorage.setItem("subscriberEmail", email);
        setSubmitted(true);
        props.setHasSubmitted(true);
        setEmail("");
      })
      .catch((err) => {
        makeInvalid(err);
        setLoading(false);
      });
  };

  const makeInvalid = (err) => {
    setError(err || "Please enter a valid email");
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const updateText = (e) => {
    setEmail(e.target.value.substring(0, 60));
    setLoading(false);
  };

  if (hasSubmitted) {
    return (
      <Card>
        <Text fontSize="lg" textAlign="center" margin={"0.5em"}>
          Thanks for subscribing! Stay Tuned!
        </Text>
      </Card>
    );
  }
  return (
    <FormControl id="email">
      <FormLabel fontSize="0.9em">
        Get notified when Docusearch becomes available.
      </FormLabel>
      <Flex justify="space-between">
        <InputGroup size="md" mr="0.5em">
          <Input
            pr="2.5rem"
            type="email"
            placeholder="interested@mail.com"
            isInvalid={error}
            onChange={updateText}
          />
        </InputGroup>
        <Button
          px={5}
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Submitting"
          minWidth={"10%"}
          bgColor="#0D6efd"
          color="#FFF"
        >
          Sign Up
        </Button>
      </Flex>
      {error ? (
        <FormHelperText color="#FF0000">{error}</FormHelperText>
      ) : (
        <FormHelperText>We'll never share your email.</FormHelperText>
      )}
    </FormControl>
  );
}
