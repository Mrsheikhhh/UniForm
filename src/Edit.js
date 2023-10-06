import React, { useState, useEffect } from 'react';
import { departmentOptions, degreeOptions } from './list'; // .wgZB6llPFG2BnTL7DPWEOFQJYUyOBWOBzdZVJSjD
import { useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';


import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Chip,
  Box,
} from '@mui/material';
import sanityClient from '@sanity/client';
import { ToastContainer, toast } from 'react-toastify';


const client = sanityClient({
  projectId: 'vmbvp3ee',
  dataset: 'production',
  token: 'sk8uMiyyzkuJ0SdrEwntH9s8rw1sdSC3SA9WKYgi9RNiyifBRF0i5JlmCEc59dpfVc0kaXWQZ7xTN3hZftEaixwckNYUPfpg5EwS76TbH7nYvlbhesl5U1xOP3Ekxwgk3ScpAlpqxsinwgZB6llPFG2BnTL7DPWEOFQJYUyOBWOBzdZVJSjD',
});



function EditDepartment() {
  const { id } = useParams();
  const {name} =useParams()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    departments: [],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDegrees, setSelectedDegrees] = useState([]);
  const [editingDocument, setEditingDocument] = useState(null);

  useEffect(() => {
    // Fetch the document data based on the provided id
    if (id) {
      // Use sanityClient to fetch the document
      const query = `*[_type == "campus" && _id == "${id}"][0]`;
      console.log(id)
      client.fetch(query).then((document) => {
        if (document) {
          setEditingDocument(document);
          console.log(document)
          // Set the form data based on the fetched document
          setFormData({
            
            address: document.address,
            phone: document.phone,
            description: document.description,
            departments: document.departments || [],
          });
        }
      });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    // Clear selected department and degrees on close
    setSelectedDepartment('');
    setSelectedDegrees([]);
    setDialogOpen(false);
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
  };

  const handleDegreeToggle = (degree) => {
    setSelectedDegrees((prevDegrees) =>
      prevDegrees.includes(degree)
        ? prevDegrees.filter((d) => d !== degree)
        : [...prevDegrees, degree]
    );
  };

  const handleAddDepartment = () => {
    setDialogOpen(true);
  };

  const handleAddDepartmentSubmit = () => {
    if (selectedDepartment) {
      setFormData({
        ...formData,
        departments: [
          ...formData.departments,
          {
            department: selectedDepartment,
            degrees: selectedDegrees,
          },
        ],
      });

      setSelectedDepartment('');
      setSelectedDegrees([]);
      setDialogOpen(false);

      // Show success toast for "Add Department" button on the popup
      toast.success('Department added successfully!', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000, // 1 second
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await client
        .patch(id) // Use the provided id to update the existing document
        .set({
          _type: 'campus',
          name: name,
          
          description: formData.description,
          departments: formData.departments,
        })
        .commit();

     // console.log('Data updated in Sanity:', result);

      // Show success notification
      toast.success('Data updated successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000, // 1 second
      });
    } catch (error) {
    //  console.error('Error updating data in Sanity:', error);
      // Show error notification
      toast.error('Error updating data', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000, // 1 second
      });
    }
  };

  return (
  
    <body class="body"><div class="div-block-4"><h1 class="heading-5">YOUR VIEWS ARE MUCH APPRECIATED </h1></div> <form onSubmit={handleSubmit}>
        <div>
          <Button variant="outlined" onClick={handleAddDepartment}
          class="addDepart">
            Add Department
          </Button>
        </div>
        <div>
          <Button type="submit" variant="contained" class="update create">
            Update
          </Button>
        </div>
      </form>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Select Department and Degrees</DialogTitle>
        <DialogContent>
          <div>
            <Select
              label="Department"
              value={selectedDepartment}
              onChange={(e) => handleDepartmentSelect(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Select Department</MenuItem>
              {departmentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <h4>Select Degrees</h4>
            {degreeOptions[selectedDepartment] &&
              degreeOptions[selectedDepartment].map((degreeOption) => (
                <Chip
                  key={degreeOption.value}
                  label={degreeOption.text}
                  clickable
                  color={selectedDegrees.includes(degreeOption.value) ? 'primary' : 'default'}
                  onClick={() => handleDegreeToggle(degreeOption.value)}
                  style={{ marginRight: '8px', marginBottom: '8px',
                  overflowX: 'scroll',
        width: '200px'}}
                />
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Close
          </Button>
          <Button onClick={handleAddDepartmentSubmit} color="primary">
            Add Department
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer style={
        {
          
          'font-size':'20px'
        }
      }
      
      
      autoClose={1000} /></body>
  );
}

export default EditDepartment;
