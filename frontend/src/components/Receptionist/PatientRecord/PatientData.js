import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { Button, TextField, Grid, Dialog, DialogTitle } from "@mui/material";
import PatientForm from "./PatientForm";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function PatientData() {
  const [rows, setRows] = React.useState([]);
  const [url, setUrl] = React.useState("");
  const [method, setMethod] = React.useState("");
  const [show, setShow] = React.useState(false);

  const handleDelete = (id) => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(
      "http://localhost:8080/api/users/delete/" + parseInt(id),
      options
    ).then((response) => {
      if (!response.ok) {
        alert("Some error occur. Try again! ");
      }
      window.location.reload();
    });
  };

  const [rowData, setRowData] = React.useState();

  React.useEffect(() => {
    fetch("http://localhost:8080/api/users/all", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setRows(data);
      });
  }, []);
  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <Dialog onClose={handleClose} align="center" open={show}>
        <Button
          sx={{
            color: "white",
            align: "right",
            backgroundColor: "red",
            width: "2px",
          }}
          onClick={() => {
            setShow(false);
          }}
        >
          X
        </Button>
        <DialogTitle>Edit</DialogTitle>
        <PatientForm url={url} method={method} userData={rowData} />
      </Dialog>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Phone </StyledTableCell>
              <StyledTableCell align="center">Nationl Number</StyledTableCell>
              <StyledTableCell align="center">Role</StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
              <StyledTableCell align="center"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              if (row.role === "PATIENT") {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {row.firstName + " " + row.lastName}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.phoneNumber}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {row.nationalNumber}
                    </StyledTableCell>

                    <StyledTableCell align="center">{row.role}</StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                          color="primary"
                          variant="contained"
                        onClick={() => {
                          setShow(true);
                          setUrl(
                            "http://localhost:8080/api/users/update/" +
                              parseInt(row.id)
                          );
                          setMethod("PUT");
                          setRowData(row);
                        }}
                      >
                        Edit
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                          color="secondary"
                          variant="contained"
                        onClick={() => {
                          handleDelete(row.id);
                        }}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
