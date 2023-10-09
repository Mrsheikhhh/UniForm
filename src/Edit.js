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
    degrees:[]
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  
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
               degrees: document.degrees || [],
          });
        }
      });
    }
  }, [id]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedDegrees([]);
    setDialogOpen(false);
    setSearchQuery('');
  };

  const handleDegreeToggle = (degree) => {
    setSelectedDegrees((prevDegrees) =>
      prevDegrees.includes(degree)
        ? prevDegrees.filter((d) => d !== degree)
        : [...prevDegrees, degree]
    );
  };

  const handleAddDegrees = () => {
    setDialogOpen(true);
  };

  const handleAddDegreesSubmit = () => {
    if (selectedDegrees.length > 0) {
      setFormData({
        ...formData,
        degrees: [...formData.degrees, ...selectedDegrees],
      });

      setSelectedDegrees([]);
      setDialogOpen(false);

      // Show success toast for "Add Degrees" button on the popup
      toast.success('Degrees added successfully!', {
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
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          description: formData.description,
          degrees: formData.degrees,
        })
        .commit();

      console.log('Data updated in Sanity:', result);

      // Show success notification
      toast.success('Data updated successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000, // 1 second
      });
    } catch (error) {
      console.error('Error updating data in Sanity:', error);
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
          <Button variant="outlined" onClick={handleAddDegrees}
          class="addDepart">
            Add Degrees
          </Button>
        </div>
        <div>
          <Button type="submit" variant="contained" class="update create">
            Update
          </Button>
        </div>
      </form>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Select Degrees</DialogTitle>
        <DialogContent>
           <div>
                             <TextField
        label="Search Degrees"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal" 
        />
            {degreeOptions
  .filter((degreeOption) =>
    degreeOption.text.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .map((degreeOption, index) => (
    <Chip
      key={degreeOption.value + index}
      label={degreeOption.text}
      clickable
      color={selectedDegrees.includes(degreeOption.value) ? 'primary' : 'default'}
      onClick={() => handleDegreeToggle(degreeOption.value)}
      style={{ marginRight: '8px', marginBottom: '8px' }}
    />
  ))}
          </div>
        </DialogContent>        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Close
          </Button>
          <Button onClick={handleAddDegreesSubmit} color="primary">
            Add Degrees
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
