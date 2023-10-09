// src/components/CampusForm.js
import React, { useState } from 'react';
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
import { useParams } from 'react-router-dom'
import { degreeOptions} from './list'; 
import sanityClient from '@sanity/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './webflow.css'

const client = sanityClient({
  projectId: 'vmbvp3ee',
  dataset: 'production',
  token:"sk8uMiyyzkuJ0SdrEwntH9s8rw1sdSC3SA9WKYgi9RNiyifBRF0i5JlmCEc59dpfVc0kaXWQZ7xTN3hZftEaixwckNYUPfpg5EwS76TbH7nYvlbhesl5U1xOP3Ekxwgk3ScpAlpqxsinwgZB6llPFG2BnTL7DPWEOFQJYUyOBWOBzdZVJSjD"
});




function CampusForm() {
  const [formData, setFormData] = useState({
    name:'',
    address: '',
    phone: '',
    description: '',
    degrees: [],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('')
  const [selectedDegrees, setSelectedDegrees] = useState([]);

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
    setSelectedDegrees([]);
    setSearchQuery('');
    setDialogOpen(false);
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
        degrees: selectedDegrees,
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
  
const {name}=useParams()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await client.create({
        _type: 'campus',
        name: name,
        address: formData.address,
        phone: formData.phone,
        description: formData.description,
        degrees: formData.degrees,
      });

      console.log('Data posted to Sanity:', result);

      setFormData({
        name: '',
        address: '',
        phone: '',
        description: '',
        degrees: [],
      });

      // Show success notification
      toast.success('Data submitted successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000, // 1 second
      });
    } catch (error) {
      console.error('Error posting data to Sanity:', error);
      // Show error notification
      toast.error('Error submitting data', {
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
            Add Department
          </Button>
        </div>
        <div>
          <Button type="submit" variant="contained" class="update create">
            Create 
          </Button>
        </div>
      </form>      <Dialog open={dialogOpen} onClose={handleDialogClose}>
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
        </DialogContent>
        <DialogActions>
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
      
      
      autoClose={1000} />
  
   
   </body>
     
   
  );
}

export default CampusForm;
