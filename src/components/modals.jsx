import React from "react";
import {
  Typography,
  Box,
  Modal,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { doc, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../database/firebase.config";
import { useDispatch } from "react-redux";
import { updateSubject } from "../redux/subjectSlice";
import { updateTopic } from "../redux/topicsSlice";
import { updateNote } from "../redux/notesSlice";

function Modals({ dataState, setModal }) {
  const { idURL, status, toEdit, type, field } = dataState;
  const [modalState, setModalState] = useState({
    editField: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (status) {
      setModalState({ ...modalState, editField: field });
    }
  }, [status, field]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!modalState?.editField) {
      return;
    }
    if (toEdit === "subject") {
      dispatch(updateSubject({ idURL, newValue: modalState?.editField }));
    } else if (toEdit === "topic") {
      dispatch(updateTopic({ idURL, newValue: modalState?.editField }));
    } else {
      dispatch(updateNote({ idURL, newValue: modalState?.editField }));
    }
    setModal({ ...dataState, status: false });
  };

  const handleDelete = async (e) => {
    await deleteDoc(doc(db, `${idURL}`));
    setModal({ ...dataState, status: false });
  };

  const handleClose = () => {
    setModal({ ...dataState, status: false });
  };

  return (
    <>
      <Modal
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        onClose={() => setModal({ ...dataState, status: false })}
        open={status}>
        <Card sx={{ maxWidth: "300px" }}>
          <CardContent>
            {type === "edit" ? (
              <Box sx={{ width: "100%" }}>
                <form onSubmit={(e) => handleEditSubmit(e)}>
                  <TextField
                    fullWidth
                    value={modalState?.editField}
                    autoComplete={"off"}
                    onChange={(e) =>
                      setModalState({
                        ...modalState,
                        editField: e.target.value,
                      })
                    }
                    margin={"dense"}
                    name={toEdit}
                    placeholder={`Add new ${toEdit}`}
                    label={toEdit}
                  />
                  <Button
                    variant={"contained"}
                    onClick={(e) => handleEditSubmit(e)}
                    color={"warning"}
                    type={"submit"}>
                    {"Edit"}
                  </Button>
                </form>
              </Box>
            ) : (
              <Box sx={{ width: "100%" }}>
                <Typography gutterBottom variant={"subtitle2"} color={"blue"}>
                  {"Are you sure you want to Delete!"}
                </Typography>
                <Button
                  onClick={(e) => handleDelete(e)}
                  variant={"outlined"}
                  color={"error"}>
                  {"Delete"}
                </Button>
              </Box>
            )}
            <Button
              onClick={() => handleClose()}
              variant={"contained"}
              color={"info"}>
              {"Cancel"}
            </Button>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}

export default Modals;
