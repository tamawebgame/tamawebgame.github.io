import {
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { LIFE_STAGES } from "../../utils";
import { useRef } from "react";
import { DeleteRounded } from "@mui/icons-material";

export function AdditionRow({ rowData, onDelete }) {
  const [characterId, setCharacterId] = useState(rowData.id);
  const [characterName, setCharacterName] = useState(rowData.name);
  const [characterLifeStage, setCharacterLifeStage] = useState(
    rowData.lifeStage,
  );
  const [characterImage, setCharacterImage] = useState(rowData.image);

  const hiddenFilePicker = useRef();

  useEffect(() => {
    rowData.name = characterName;
    rowData.id = characterId;
    rowData.lifeStage = characterLifeStage;
    rowData.image = characterImage;
  }, [characterName, characterId, characterLifeStage, characterImage]);

  const onImageChange = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCharacterImage(reader.result);
    };
    reader.readAsDataURL(hiddenFilePicker.current.files[0]);
  };

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      borderRadius={2}
      alignItems="center"
      m={2}
      p={1}
      gap={2}
      justifyContent="space-evenly"
      border={2}
      sx={{ border: "1px solid lightgray" }}
    >
      <IconButton aria-label="delete" color="error" onClick={onDelete}>
        <DeleteRounded />
      </IconButton>
      <Divider orientation="vertical" flexItem />
      <Stack flexGrow={1} gap={2}>
        <FormControl disabled>
          <InputLabel>Addition Resource Type</InputLabel>
          <Select label="Addition Resource Type" value="char">
            <MenuItem value="char">Character</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="UUID"
          value={characterId}
          onInput={(evt) => setCharacterId(evt.target.value)}
        />
        <TextField
          label="Character Name"
          value={characterName}
          onInput={(evt) => setCharacterName(evt.target.value)}
        />
        <FormControl>
          <InputLabel>Life Stage</InputLabel>
          <Select
            label="Life Stage"
            value={characterLifeStage}
            onChange={(evt) => setCharacterLifeStage(evt.target.value)}
          >
            {Object.keys(LIFE_STAGES).map((lifeStage) => (
              <MenuItem value={LIFE_STAGES[lifeStage]}>{lifeStage}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Stack gap={2}>
        <input
          ref={hiddenFilePicker}
          onChange={onImageChange}
          hidden
          type="file"
        />
        <img
          style={{
            width: "200px",
            height: "200px",
            imageRendering: "pixelated",
          }}
          src={characterImage || "static/images/default.jpg"}
        />
        <Button
          size="large"
          variant="text"
          onClick={() => hiddenFilePicker.current.click()}
        >
          Upload Target Image
        </Button>
      </Stack>
    </Stack>
  );
}
