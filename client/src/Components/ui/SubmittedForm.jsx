import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { CircleCheckBig } from "lucide-react";

export default function SubmittedForm() {
  const [isSubmit, setIsSubmit] = useState(false);
  useEffect(() => {
    const process = setTimeout(() => {
      setIsSubmit(true);
    }, 1500);
    return () => clearTimeout(process);
  });
  // Simulate a delay for the loading spinner
  return !isSubmit ? (
    <Stack
      sx={{ color: "#00e02d" }}
      spacing={2}
      direction="row"
      className="flex items-center justify-center"
    >
      <CircularProgress color="success" />
    </Stack>
  ) : (
    <div className="flex items-center justify-center gap-2 text-center">
      <CircleCheckBig color="#00e02d" size={50} />
      <span className=""> Form Submitted</span>
    </div>
  );
}
