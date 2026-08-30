import { Badge, Chip } from "@mui/material";

export function NewBadge({ until }) {
  if (until && Date.now() > until?.getTime()) {
    return null;
  }

  return (
    <Chip
      size="small"
      color="error"
      label="New!"
      sx={{ position: "absolute", top: -4, left: -4 }}
    />
  );
}
