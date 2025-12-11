"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import axios from "axios";
import { useRouter } from "next/navigation";

interface AssetModel {
  assetID: number;
  name: string;
  code: string;
  owner: string;
  position: string;
  price: number;
  unit: string;
  status: string;
}

const AssetsPage = () => {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetModel[]>([]);

  // Modal state
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Load assets
  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      setAssets(res.data.data || []);
    } catch (err) {
      console.log(err);
      alert("Cannot load assets");
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Open confirm modal
  const handleOpenConfirm = (id: number) => {
    setSelectedId(id);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedId(null);
  };

  // DELETE
  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://lumbar-mora-uncoroneted.ngrok-free.dev/api/asset/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      alert("Asset deleted");
      handleCloseConfirm();
      fetchAssets();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // Edit
  const handleEdit = (id: number) => {
    router.push(`/EditAsset?id=${id}`);
  };

  return (
    <>
      <div style={{ padding: "24px" }}>
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ margin: 0 }}>Assets List</h2>

          {/* ADD ASSET BUTTON */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push("CreateAssets")}
          >
            Add Asset
          </Button>
        </div>

        {/* TABLE */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Unit</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {assets.map((item, index) => (
                <TableRow key={item.assetID}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.status}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(item.assetID)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleOpenConfirm(item.assetID)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* DELETE CONFIRM MODAL */}
        <Dialog open={openConfirm} onClose={handleCloseConfirm}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this asset?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default AssetsPage;
