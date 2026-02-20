import { Alert, Box, Stack, Typography } from "@mui/material";

const ALL_STAGES = [
  { name: "Baby", list: PET_BABY_CHARACTERS, cellSize: 16 },
  { name: "Child", list: PET_CHILD_CHARACTERS, cellSize: 24 },
  { name: "Teen", list: PET_TEEN_CHARACTERS, cellSize: 24 },
  { name: "Adult", list: PET_ADULT_CHARACTERS, cellSize: 32 },
  { name: "Elder", list: PET_ELDER_CHARACTERS, cellSize: 32 },
];

export default function CharactersList() {
  const getNumber = (str) => {
    const regex = /\d+/;
    const match = str.match(regex);
    return match[0];
  };

  return (
    <Stack gap={2}>
      <Alert severity="info">
        <b>Characters Reference</b>
        <br />
        You can quickly find a character's # from the list below.
      </Alert>
      <Stack gap={4} flexWrap="wrap">
        {ALL_STAGES.map((stage) => (
          <Box key={stage.name}>
            <Typography fontWeight="bold" mb={1}>
              {stage.name}
            </Typography>

            <Stack
              direction="row"
              justifyContent="start"
              gap={1}
              flexWrap="wrap"
            >
              {stage.list.map((sprite) => (
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  direction="column"
                  key={sprite}
                  borderRadius={2}
                  border={1}
                  borderColor="lightgray"
                  p={1}
                >
                  <Box>
                    <c-sprite
                      src={`https://autosam.github.io/Tamaweb/${sprite}`}
                      width={stage.cellSize}
                      height={stage.cellSize}
                      index={0}
                    />
                  </Box>
                  <Typography>{getNumber(sprite)}</Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
