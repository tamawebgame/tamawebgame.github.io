import { FileUploadRounded, SaveRounded } from "@mui/icons-material";
import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import Additions from "components/Additions";
import { useEffect, useState } from "react";
import { uid } from "uid";
import Overrides from "../components/Overrides";
import { saveFile } from "../utils";

export default function Main() {
  const [packageName, setPackageName] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [packageAuthor, setPackageAuthor] = useState("");
  const [packageId, setPackageId] = useState("");
  const [notValid, setNotValid] = useState(false);

  // resources main data
  const [resourceRows, setResourceRows] = useState([]); // [{ source: '', target: '', id: Date.now(), }]
  const [additionRows, setAdditionRows] = useState([]);

  useEffect(() => {
    setNotValid(false);
    if (!packageId && packageName) setPackageId(uid(24));
  }, [packageName]);

  const handleSave = () => {
    if (!packageName) return setNotValid(true);

    const packageData = {
      name: packageName,
      description: packageDescription,
      author: packageAuthor,
      id: packageId,
      replaced_resources: resourceRows.map(({ source, target }) => {
        return [source, target];
      }),
      additions: additionRows.map(({ image, type, name }) => ({
        image,
        type,
        name,
      })),
    };

    saveFile(JSON.stringify(packageData), `${packageName}.rop`);
    console.log(packageData, { additionRows });
  };
  const handleLoad = async () => {
    // if (typeof showOpenFilePicker === "undefined") {
    //     return alert('You need to use a chromium based browser to able to use this web application');
    // }
    const [fileHandle] = await showOpenFilePicker();
    const file = await fileHandle.getFile();
    const text = await file.text();
    try {
      const json = JSON.parse(text);
      setPackageName(json.name);
      setPackageDescription(json.description);
      setPackageAuthor(json.author);
      setPackageId(json.id);
      setResourceRows(
        json.replaced_resources.map(([source, target], index) => {
          return {
            id: Date.now() + index,
            source,
            target,
          };
        })
      );
      setAdditionRows(
        json.additions.map(({ image, name, type }, index) => ({
          id: Date.now() + index,
          name,
          image,
          type,
        }))
      );
    } catch (e) {
      alert(`Error, ${e}`);
    }
  };

  return (
    <Stack spacing={2} m={"15px"}>
      <Stack
        spacing={1}
        sx={{ p: 1, border: "solid 1px lightgray", borderRadius: 2 }}
      >
        <Typography>Package Metadata</Typography>
        <TextField
          error={notValid}
          value={packageName}
          onChange={(e) => setPackageName(e.target.value)}
          variant="outlined"
          label="Name"
        />
        <TextField
          value={packageDescription}
          onChange={(e) => setPackageDescription(e.target.value)}
          multiline
          variant="outlined"
          label="Description"
        />
        <TextField
          value={packageAuthor}
          onChange={(e) => setPackageAuthor(e.target.value)}
          variant="outlined"
          label="Author"
        />
        <TextField
          disabled
          InputProps={{ readOnly: true }}
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          variant="outlined"
          label="UUID"
        />
        <Box sx={{ display: "flex", gap: "5px" }}>
          <Button
            startIcon={<FileUploadRounded />}
            variant="contained"
            color="secondary"
            onClick={handleLoad}
            disabled={typeof showOpenFilePicker === "undefined"}
          >
            {" "}
            Load from file
          </Button>

          <Button
            startIcon={<SaveRounded />}
            variant="contained"
            color="success"
            onClick={handleSave}
          >
            {" "}
            Save
          </Button>

          <Link
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "flex-end",
            }}
            href="static/files/ExampleMod.rop"
            variant="body2"
          >
            Download Example Package
          </Link>
        </Box>
      </Stack>

      <Overrides setRows={setResourceRows} rows={resourceRows} />
      <Additions setRows={setAdditionRows} rows={additionRows} />
    </Stack>
  );
}
