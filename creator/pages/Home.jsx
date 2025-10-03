import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";

import ResourceReplacer from "./ResourceReplacer";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorOutline, Refresh, ReportProblem } from "@mui/icons-material";

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Home() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box sx={{ width: "100%" }}>
        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Create" {...a11yProps(0)} />
                    <Tab disabled label="Soon" {...a11yProps(1)} />
                    <Tab disabled label="Soon" {...a11yProps(2)} />
                </Tabs>
            </Box> */}
        {/* <CustomTabPanel value={value} index={0}> */}
        <ResourceReplacer />
        {/* </CustomTabPanel> */}
      </Box>
    </ErrorBoundary>
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
