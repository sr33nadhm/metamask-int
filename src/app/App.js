import "./App.css";
import { ethers } from "ethers";
import { useState } from "react";
import { Alert, Avatar, Box, Button, Card, Divider, Skeleton, Snackbar, Stack, Typography } from "@mui/material";
import AddLinkIcon from "@mui/icons-material/AddLink";
import AssignmentIcon from "@mui/icons-material/Assignment";
import bops from "bops";
import NavBar from "../components/navbar/NavBar";

function App() {
  const [data, setdata] = useState({
    address: "",
    Balance: null,
  });

  const [warn, setWarn] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("error");

  const btnhandler = () => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => accountChangeHandler(res));
    } else {
      setSeverity("error");
      setMessage("Please install metamask extension!!");
      setWarn(true);
    }
  };

  const getbalance = (address) => {
    window.ethereum
      .request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      .then((balance) => {
        setdata({
          Balance: ethers.utils.formatEther(balance),
          address: address,
        });
      });
  };

  const sign = () => {
    if (data.address.length > 0) {
      let msg = `0x${bops.from("Thank you for checking out my portfolio - Sreenadh", "utf8").toString("hex")}`;
      window.ethereum
        .request({
          method: "personal_sign",
          params: ["Thank you for checking out my portfolio - Sreenadh", data.address, msg],
        })
        .then((data) => {
          if (data["code"]) {
            setSeverity("error");
            setMessage("Message not signed!!");
            setWarn(true);
          } else {
            setSeverity("success");
            setMessage("Message signed successfully!!");
            setWarn(true);
          }
        });
    } else {
      setSeverity("error");
      setMessage("Please connect your account!!");
      setWarn(true);
    }
  };

  const accountChangeHandler = (account) => {
    console.log(account);
    setdata({
      address: account[0],
    });
    getbalance(account[0]);
  };

  return (
    <div className="App">
      <NavBar />
      <Snackbar open={warn} autoHideDuration={6000} onClose={() => setWarn(false)}>
        <Alert onClose={() => setWarn(false)} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <header className="App-header">
        <Card className="app-card">
          <Box className="card-box">
            <Avatar
              variant="rounded"
              src="data:image/png;base64,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"
            />
            <Stack spacing={1}>
              <Typography fontWeight={200} className="address-row">
                {data.address ? data.address : <Skeleton variant="text" sx={{ fontSize: "15px", width: 250 }} />}
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{ marginLeft: 8 }}>
                {data.Balance ? data.Balance + " ETH" : <Skeleton variant="text" sx={{ fontSize: "15px" }} />}
              </Typography>
              <Divider />
              <Typography variant="body2" color="text.secondary" className="card-desc">
                Welcome! This is an example for metamask integration. A wallet like Metamask can be used to store and
                retrieve your coins and tokens. It can even be used to sign a transaction. Give it a try! <br />
                <br />
                <b>Please click on connect to start!</b>
              </Typography>
            </Stack>
          </Box>
          <Divider />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 1, bgcolor: "background.default" }}
          >
            <Button variant="contained" color="success" startIcon={<AddLinkIcon />} onClick={btnhandler}>
              Connect
            </Button>
            <Button variant="contained" startIcon={<AssignmentIcon />} onClick={sign}>
              Sign
            </Button>
          </Stack>
        </Card>
      </header>
    </div>
  );
}

export default App;
