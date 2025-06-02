import { DeleteRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

const AdditionRow = ({ onDelete, index, rowData }) => {
  console.log({ rowData });
  const [image, setImage] = useState(rowData.image);
  const [name, setName] = useState(rowData.name);
  const [type, setType] = useState(rowData.type);

  useEffect(() => {
    rowData.image = image;
    rowData.name = name;
    rowData.type = type;
  }, [name, image, type]);

  const hiddenFilePicker = useRef(null);
  const targetImageRef = useRef(null);

  const uploadImageClick = (me) => hiddenFilePicker.current.click();

  const handleDelete = () => onDelete(index);

  const handleSetName = (e) => setName(e.target.value);
  const handleChangeType = (e) => setType(e.target.value);

  const onImageChange = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(hiddenFilePicker.current.files[0]);
  };

  return (
    // <Paper elevation={3}>
    <Box
      sx={{
        m: 2,
        p: 1,
        display: "flex",
        gap: 2,
        alignItems: "center",
        border: "1px solid lightgray",
        borderRadius: 2,
        justifyContent: "space-evenly",
      }}
    >
      <IconButton aria-label="delete" color="error" onClick={handleDelete}>
        <DeleteRounded />
      </IconButton>
      <Divider orientation="vertical" flexItem />
      <Stack>
        <TextField
          value={name}
          variant="outlined"
          label="Name"
          onChange={handleSetName}
        />
        <Select
          value={type || ""}
          onChange={handleChangeType}
          variant="outlined"
          label="type"
        >
          <MenuItem value="char_skin">Character Skin</MenuItem>
        </Select>
      </Stack>
      <Divider orientation="vertical" flexItem />
      <Stack>
        <img
          ref={targetImageRef}
          style={{
            width: "200px",
            height: "200px",
            imageRendering: "pixelated",
          }}
          src={image || "static/images/default.jpg"}
        ></img>
        <Button size="large" variant="text" onClick={uploadImageClick}>
          Upload Image
        </Button>
      </Stack>

      <input
        ref={hiddenFilePicker}
        onChange={onImageChange}
        hidden
        type="file"
      />
    </Box>
    // </Paper>
  );
};

export default AdditionRow;
