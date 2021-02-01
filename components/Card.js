import { Box } from "@chakra-ui/react";

export default function Card({ children, ...props }) {
  return (
    <Box borderWidth="1px" borderRadius="lg" {...props}>
      {children}
    </Box>
  );
}
