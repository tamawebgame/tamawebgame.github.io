import { useDraggable, useDroppable, DragDropProvider } from "@dnd-kit/react";
import {
  Circle,
  Delete,
  DockTwoTone,
  Download,
  FileCopy,
  Save,
  Upload,
} from "@mui/icons-material";
import { Box, Stack, Typography, Button, Divider, Alert, Link } from "@mui/material";
import { useMemo, useState } from "react";
import { saveFile } from "../utils";

/* ---------------------------------- */
/* ------------ STAGES -------------- */
/* ---------------------------------- */

const allStages = [
  { name: "Baby", list: PET_BABY_CHARACTERS, cellSize: 16 },
  { name: "Child", list: PET_CHILD_CHARACTERS, cellSize: 24 },
  { name: "Teen", list: PET_TEEN_CHARACTERS, cellSize: 24 },
  { name: "Adult", list: PET_ADULT_CHARACTERS, cellSize: 32 },
  { name: "Elder", list: PET_ELDER_CHARACTERS, cellSize: 32 },
];

const SLOT_DELIMITER = "^";

export default function GrowthChartMapper() {
  const [slots, setSlots] = useState({});

  /* ---------------------------------- */
  /* -------- STAGE LOOKUP MAP -------- */
  /* ---------------------------------- */

  const stageIndexMap = useMemo(() => {
    const map = {};
    allStages.forEach((stage, index) => {
      stage.list.forEach((sprite) => {
        map[sprite] = index;
      });
    });
    return map;
  }, []);

  /* ---------------------------------- */
  /* ----------- DRAG END ------------- */
  /* ---------------------------------- */

  const handleDragEnd = (event) => {
    if (!event.operation?.target) return;

    const { source, target } = event.operation;

    const draggedSprite = source.id;
    const slotId = target.id;

    const baseSprite = slotId.split(SLOT_DELIMITER)[1];

    const sourceStage = stageIndexMap[draggedSprite];
    const baseStage = stageIndexMap[baseSprite];

    // Enforce sequential growth only (Baby → Child → Teen → etc)
    // if (sourceStage !== baseStage + 1) {
    //   console.warn("Invalid evolution drop");
    //   return;
    // }

    setSlots((prev) => {
      const updated = { ...prev };

      //   // Remove sprite from any previous slot
      //   Object.keys(updated).forEach((key) => {
      //     if (updated[key] === draggedSprite) {
      //       delete updated[key];
      //     }
      //   });

      // Assign to new slot
      updated[slotId] = draggedSprite;

      return updated;
    });
  };

  /* ---------------------------------- */
  /* --------- EXPORT BUILDER --------- */
  /* ---------------------------------- */

  const buildGrowthTree = () => {
    const tree = {};

    console.log({ slots });

    Object.entries(slots).forEach(([slotId, spriteId]) => {
      // Split by "_" and take the second part, then remove the ^number suffix
      const baseWithSuffix = slotId.split("_")[1];
      const base = baseWithSuffix.split("^")[0]; // Remove the ^1, ^2, etc.
      console.log(base, slotId);

      if (!tree[base]) tree[base] = [];
      tree[base].push(spriteId);
    });

    return tree;
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
      setSlots(json.slots);
    } catch (e) {
      alert(`Error, ${e}`);
    }
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <Stack gap={4}>
        <Stack gap={1}>
          <Alert severity="warning">
            <b>Map Growth Chart</b> is a developer only tool and <u>CANNOT</u>{" "}
            be used to create custom growth chart mods yet.
          </Alert>
          <Alert severity="info">
            if you have ideas for improving the game's growth chart, 
            you can create them here and share the exported file in our <Link href="https://tamawebgame.github.io/discord" target="_blank">Discord</Link> server!
          </Alert>
        </Stack>
        <Stack
          direction="row"
          gap={1}
          position="sticky"
          top={20}
          flexWrap="wrap"
        >
          <Button
            startIcon={<Upload />}
            color="success"
            variant="contained"
            onClick={() => {
              const data = {
                slots,
                tree: buildGrowthTree(),
              };
              saveFile(JSON.stringify(data), `GrowthChart.json`);
            }}
          >
            Export
          </Button>
          <Button
            startIcon={<Download />}
            color="info"
            variant="contained"
            onClick={handleLoad}
          >
            Import
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setSlots({});
            }}
          >
            <Delete />
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              window.localStorage.setItem("gc_slots", JSON.stringify(slots));
            }}
          >
            <Save />
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              try {
                const data = JSON.parse(
                  window.localStorage.getItem("gc_slots")
                );
                setSlots(data);
              } catch (e) {
                alert(e);
              }
            }}
          >
            <FileCopy />
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => {
              const tree = buildGrowthTree();
              console.log("Growth Tree:", tree);
            }}
          >
            Export Growth Tree (console)
          </Button>
        </Stack>

        {/* <SourceSprites slots={slots} /> */}

        <Box>
          <Slots slots={slots} setSlots={setSlots} />
        </Box>
      </Stack>
    </DragDropProvider>
  );
}

/* ---------------------------------- */
/* -------- SOURCE SPRITES ---------- */
/* ---------------------------------- */

function SourceSprites({ stages = allStages, slots }) {
  const allSlottedSprites = Object.entries(slots).flatMap(
    ([_, sprite]) => sprite
  );
  const isSpriteInSlot = (sprite) => allSlottedSprites.includes(sprite);

  return (
    <Stack gap={4}>
      {stages.map((stage) => (
        <Box key={stage.name}>
          <Typography fontWeight="bold" mb={1}>
            {stage.name}
          </Typography>

          <Stack direction="row" gap={1} flexWrap="wrap">
            {stage.list.map((sprite) => (
              <DraggableItem key={sprite} id={sprite}>
                <Box
                  sx={{
                    opacity: isSpriteInSlot(sprite) ? 0.3 : 1,
                    // filter: isSpriteInSlot(sprite) ? "grayscale()" : "",
                    ":hover": {
                      opacity: 1,
                      filter: "unset",
                      transform: "scale(2);",
                      translate: "0px -20px",
                    },
                  }}
                >
                  <c-sprite
                    src={`https://autosam.github.io/Tamaweb/${sprite}`}
                    width={stage.cellSize}
                    height={stage.cellSize}
                    index={0}
                  />
                </Box>
              </DraggableItem>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

/* ---------------------------------- */
/* -------------- SLOTS ------------- */
/* ---------------------------------- */

function Slots({
  stages = [allStages[0], allStages[1], allStages[2], allStages[3]],
  slots,
  setSlots,
}) {
  return (
    <Stack gap={4}>
      {stages.map((stage, index) => (
        <Stack key={stage.name} direction="column" gap={1}>
          <SourceSprites stages={[allStages[index + 1]]} slots={slots} />
          {/* <Divider/> */}
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={3}
            sx={{ p: 1, border: "solid 1px lightgray", borderRadius: 2 }}
          >
            {stage.list.map((sprite) => (
              <Stack key={sprite} direction="row" gap={1} alignItems="center">
                <c-sprite
                  src={`https://autosam.github.io/Tamaweb/${sprite}`}
                  width={stage.cellSize}
                  height={stage.cellSize}
                  index={0}
                />

                <Typography>{`→`}</Typography>

                {[1, 2, 3].map((slotIndex) => {
                  const slotId = `target${SLOT_DELIMITER}${sprite}${SLOT_DELIMITER}${slotIndex}`;
                  return (
                    <Slot
                      key={slotId}
                      id={slotId}
                      spriteId={slots[slotId]}
                      setSlots={setSlots}
                      index={slotIndex}
                    />
                  );
                })}
              </Stack>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}

/* ---------------------------------- */
/* -------------- SLOT -------------- */
/* ---------------------------------- */

function Slot({ id, spriteId, setSlots, index }) {
  const { ref, isOver } = useDroppable({ id });

  const getSpriteSize = (sprite) => {
    const targetStage = allStages.find((stage) => stage.list.includes(sprite));
    return targetStage?.cellSize || 28;
  };

  const getColor = () => {
    if (index === 1) return "#ff000015";
    if (index === 2) return "#ffffff2e";
    return "#00ff1a15";
  };

  return (
    <Box
      ref={ref}
      width={40}
      height={40}
      border="2px dashed #aaa"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: getColor(),
        cursor: "pointer",
      }}
      onClick={(e) => {
        e.preventDefault();
        setSlots((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }}
    >
      {spriteId && (
        <c-sprite
          src={`https://autosam.github.io/Tamaweb/${spriteId}`}
          width={getSpriteSize(spriteId)}
          height={getSpriteSize(spriteId)}
          index={0}
        />
      )}
    </Box>
  );
}

/* ---------------------------------- */
/* ----------- DRAGGABLE ------------ */
/* ---------------------------------- */

function DraggableItem({ id, children }) {
  const { ref } = useDraggable({ id });
  return (
    <div ref={ref} style={{ cursor: "grab" }}>
      {children}
    </div>
  );
}
