import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Grid,
} from "@mui/material";
import api from "../utils/api";

function AdminCategory() {
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/categories", {
        name,
        parent: parent || null,
      });

      setName("");
      setParent("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const mainCategories = categories.filter((cat) => !cat.parent);

  const getSubCategories = (parentId) =>
    categories.filter(
      (cat) =>
        cat.parent &&
        cat.parent.toString() === parentId.toString()
    );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2 }}>
      
      {/* ================= FORM CARD ================= */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          mb: 5,
          background: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: 600,
            color: "#1f2937",
          }}
        >
          Add Category / Subcategory
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            
            {/* Category Name */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Category Name"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            {/* Parent Category Dropdown */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Parent Category"
                value={parent}
                onChange={(e) => setParent(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    backgroundColor: "#ffffff",
                    "& fieldset": {
                      borderColor: "#10b981",
                    },
                    "&:hover fieldset": {
                      borderColor: "#10b981",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#10b981",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#10b981",
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        maxHeight: 280,
                        borderRadius: 3,
                        mt: 1,
                        boxShadow:
                          "0 10px 25px rgba(0,0,0,0.08)",
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  Main Category
                </MenuItem>

                {mainCategories.map((cat) => (
                  <MenuItem
                    key={cat._id}
                    value={cat._id}
                    sx={{ py: 1.5, fontWeight: 500 }}
                  >
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: "#10b981",
                  px: 4,
                  py: 1.3,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                Add Category
              </Button>
            </Grid>

          </Grid>
        </Box>
      </Paper>

      {/* ================= CATEGORY LIST ================= */}
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          background: "#ffffff",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, fontWeight: 600, color: "#111827" }}
        >
          All Categories
        </Typography>

        {mainCategories.length === 0 && (
          <Typography sx={{ color: "#6b7280" }}>
            No categories found.
          </Typography>
        )}

        {mainCategories.map((mainCat) => {
          const subCategories = getSubCategories(mainCat._id);

          return (
            <Box
              key={mainCat._id}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            >
              {/* Main Category */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#1f2937",
                    fontSize: "16px",
                  }}
                >
                  {mainCat.name}
                </Typography>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(mainCat._id)}
                >
                  Delete
                </Button>
              </Box>

              {/* Subcategories */}
              {subCategories.length > 0 && (
                <Box sx={{ mt: 2, ml: 2 }}>
                  {subCategories.map((sub) => (
                    <Box
                      key={sub._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#4b5563",
                          fontSize: "14px",
                        }}
                      >
                        • {sub.name}
                      </Typography>

                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(sub._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Paper>
    </Box>
  );
}

export default AdminCategory;