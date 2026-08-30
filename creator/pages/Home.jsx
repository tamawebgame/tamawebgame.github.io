import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper, Skeleton, TextField } from "@mui/material";

import ResourceReplacer from "./ResourceReplacer";
import GrowthChartMapper from "./GrowthChart";
import CharactersList from "./CharactersList";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box m={2}> {children} </Box>}
    </div>
  );
}

export default function Home() {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper square elevation={1}>
        <Tabs onChange={handleChange} value={selectedTab} variant="scrollable">
          <Tab label="Modify Resources" value={0} />
          <Tab label="Characters List" value={2} />
          <Tab label="Map Growth Chart" value={1} />
        </Tabs>
      </Paper>
      <CustomTabPanel value={selectedTab} index={0}>
        <ResourceReplacer />
      </CustomTabPanel>
      <CustomTabPanel value={selectedTab} index={1}>
        <GrowthChartMapper />
      </CustomTabPanel>
      <CustomTabPanel value={selectedTab} index={2}>
        <CharactersList />
      </CustomTabPanel>
    </Box>
  );
}

const ErrorFallback = () => {
  return (
    <Stack mt={8} justifyContent="center" alignItems="center">
      <Paper variant="outlined" elevation={2}>
        <Stack p={3} gap={2} alignItems="start">
          <Stack>
            <Stack
              bgcolor="mistyrose"
              color="red"
              borderRadius={2}
              p={1}
              px={2}
              gap={1}
              border={1}
              width="100%"
              flexGrow={1}
              direction="row"
              alignItems="start"
            >
              <ReportProblem />
              <Box>
                <Typography fontWeight="bold">Something went wrong!</Typography>
                <Typography>Looks like the app crashed.</Typography>
              </Box>
            </Stack>
          </Stack>
          <Stack>
            <Typography fontSize="small">
              Make sure you are uploading a file with the correct format
              (usually <b>.png</b>)
            </Typography>
            <Typography fontSize="small">
              If the error persist feel free to seek help on the Discord
              server's <Chip size="small" label={"#help-and-questions"} />{" "}
              channel.
            </Typography>
          </Stack>
          <Button
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};
