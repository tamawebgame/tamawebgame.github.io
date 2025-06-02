import { AddRounded } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";
import { ResourceRow } from "components/ResourceRow";

const Overrides = ({ rows, setRows }) => {
  const handleAddRow = () => {
    const newRow = {
      source: "",
      target: "",
      id: Date.now(),
    };

    setRows([newRow, ...rows]);
  };
  const handleDeleteRow = (index) => {
    const newResourceRows = rows.toSpliced(index, 1);
    setRows(newResourceRows);
  };

  return (
    <Stack
      spacing={1}
      sx={{ p: 2, border: "1px solid lightgray", borderRadius: 2 }}
    >
      <Button
        startIcon={<AddRounded />}
        variant="contained"
        onClick={handleAddRow}
      >
        {" "}
        Add Override
      </Button>
      {rows.length ? (
        rows.map((row, i) => (
          <ResourceRow
            key={row.id}
            index={i}
            rowData={row}
            onDelete={handleDeleteRow}
          />
        ))
      ) : (
        <Typography sx={{ opacity: 0.7 }} color="info">
          No overrides
        </Typography>
      )}
    </Stack>
  );
};

export default Overrides;
