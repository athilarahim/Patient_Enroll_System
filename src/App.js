import React, { useEffect } from "react";
import { useState } from "react";
import './App.css';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import firebaseExports from "./firebase";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import firebase from "firebase/app";
import "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Allpatients from "./Allpatients";




function App() {
  const [op,setOP] = useState();
  const [name,setName] = useState("");
  const [age,setAge] = useState();
  const [gender, setGender] = useState('');
  const [phone,setPhone] = useState();

  const [patientdata,setPatientdata] = useState([]);
  const [opsearch,setOpsearch] = useState('');
  const [namesearch,setNamesearch] = useState('');
  const [phonesearch,setPhonesearch] = useState('');
  const [open, setOpen] = useState(false);
  const [errortext,setErrortext] = useState("");

  const { firebaseConf, firestore } = firebaseExports;

  //fetching firestore database
  const db = firestore.collection('patientlist');  //change firestore DB name here
 

  useEffect(() => {
    
    db.orderBy('op_no')
    .get()
    .then((querySnapshot) => {
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setPatientdata( documents );
    });
   
  }, [])

///////////logout///////////////
const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      console.log('User logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  ////////////logout/////////////



  const AddPatients = async (e) =>{
       e.preventDefault();
       if(!op || !name || !age || !gender || !phone){
        setErrortext("Please enter all the fields!")
       }
       else{ 
        setErrortext("");
       try{
       await db.add({
        op_no: op,
        name: name.toLowerCase(),
        age: age,
        gender: gender,
        phone: phone 

      });
      console.log("Data entered of patient with OP: ",op);
       } catch (e) {
         console.error("Error adding document: ", e);
       }

       setOP('');
       setName('');
       setAge('');
       setGender('');
       setPhone('');
      }      
  }

  const searchByop = async () =>{
    
      try {
        const querySnapshot = await 
          db.where('op_no', '==' ,opsearch)
          .get();

          const results = [];
          querySnapshot.forEach((doc) => {
          results.push({data:doc.data(),id:doc.id});
        });

        setPatientdata(results);
      } catch (error) {
        console.error('Error searching document: ', error);
      }
    };


  const searchByname = async () =>{
    
    try {
      const querySnapshot = await
        db.where('name', '>=', namesearch.toLowerCase())
        .where('name', '<=', namesearch.toLowerCase() + '\uf8ff')
        .get();

        const results = [];
        querySnapshot.forEach((doc) => {
        results.push({data:doc.data(),id:doc.id});
      });

      setPatientdata(results);
    } catch (error) {
      console.error('Error searching document: ', error);
    }
  }

  const searchByphone = async () =>{
    
    try {
      const querySnapshot = await 
        db.where('phone', '==' ,phonesearch)
        .get();

        const results = [];
        querySnapshot.forEach((doc) => {
        results.push({data:doc.data(),id:doc.id});
      });

      setPatientdata(results);
    } catch (error) {
      console.error('Error searching document: ', error);
    }
  }

  const deleteDocument = async (documentId) =>{
   await 
    db.doc(documentId)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!',documentId);
    })
    .catch('error deleting document')
  
  }
  
  //Pagination content//////////////////////////////////////////
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the first and last items 
  const indexOfLastItem = currentPage * 3;
  const indexOfFirstItem = indexOfLastItem - 3;

  // Get the current page's items
  let currentItems = []; 
  currentItems = patientdata.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  ////Pagination content////////////////////////////////////




  return (
    <div className="App">
    <Button sx={{margin: 2}} variant="contained" onClick={handleLogout}>Logout</Button>
      <ToastContainer />
      <h2 className="heading">Pro Dent Care, Erattupetta</h2>
      <div className="row">
      <div className="column-one">
       <Paper className="maincard" elevation={3}>
        <h2 style={{color:"grey"}}>Add New Patient</h2>
        <TextField size="small" sx={{marginBottom: 0.3}} fullWidth id="filled-basic" label="OP Number" variant="filled" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
        value={op || ''} onChange={(e)=>setOP(e.target.value)}/><br/>

        <TextField size="small" sx={{marginBottom: 0.3}} fullWidth id="filled-basic" label="Name" variant="filled" 
        value={name || ''} onChange={(e)=>setName(e.target.value)}/><br/>
        <TextField size="small" sx={{marginBottom: 0.4}} fullWidth id="filled-basic" label="Phone Number" variant="filled" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        value={phone || ''} onChange={(e)=>setPhone(e.target.value)}/>
        <br/>
        <div className="ageandgender">
        <TextField size="small" id="filled-basic" label="Age" variant="filled" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
        value={age || ''} onChange={(e)=>setAge(e.target.value)}/> &nbsp;
        <FormControl sx={{minWidth: 200}} size="small" variant="filled">
        <InputLabel  id="demo-simple-select-standard-label">Gender</InputLabel>
        <Select 
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={gender || ''}
          onChange={(e)=>setGender(e.target.value)}
          label="Gender"
          
        >
        
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </Select>
       </FormControl>
       </div>
       <br/>
       <p style={{color: "red"}}>{errortext}</p>
       <Button variant="contained" onClick={AddPatients}>Add Patient</Button>
    
       </Paper>
      </div>
      <div className="column-two">
        {/* <div className="viewall-patients">
        <Button variant="contained" onClick={()=>setOpen(true)}>
          View all patients
        </Button> 
        </div> */}
      <div className="viewall-patients">
      <Allpatients />
      </div>

        {/* <div className="modal">
        <Modal className="modalOverlay"
        
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="modal-box">
          <button style={{marginLeft: 1190}} onClick={()=>setOpen(false)}>x</button>
          <Typography id="modal-modal-description" sx={{ mt: 2, mr: 1 }}>
          <div className="content-display-modal">
        

          </div>
          </Typography>
        </Box>
      </Modal>
        </div> */}
        <div className="searching">

      <TextField value={opsearch} onChange={(e)=>setOpsearch(e.target.value)} id="filled-basic" label="Search OP" variant="filled" />
      <Button onClick={searchByop} variant="outlined">Go</Button> &nbsp;

      <TextField value={namesearch} onChange={(e)=>setNamesearch(e.target.value)} id="filled-basic" label="Search Name" variant="filled" />
      <Button onClick={searchByname} variant="outlined">Go</Button> &nbsp;

      <TextField value={phonesearch} onChange={(e)=>setPhonesearch(e.target.value)} id="filled-basic" label="Search phone" variant="filled" />
      <Button onClick={searchByphone} variant="outlined">Go</Button>

      </div>
      <div className="content-display">
      {(patientdata.length !== 0) ? (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 680 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>OP Number</TableCell>
              <TableCell align="left">Patient Name</TableCell>
              <TableCell align="left">Age</TableCell>
              <TableCell align="left">Gender</TableCell>
              <TableCell align="left">Phone</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((row) => (
              
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                
                <TableCell component="th" scope="row">
                  {row.data.op_no}
                </TableCell>
                <TableCell align="left">{row.data.name.toUpperCase()}</TableCell>
                <TableCell align="left">{row.data.age}</TableCell>
                <TableCell align="left">{row.data.gender}</TableCell>
                <TableCell align="left">{row.data.phone}</TableCell>
      <TableCell align="left"><Button onClick={()=>deleteDocument(row.id).then(toast.success("Deleted successfully!"))} variant="outlined">Delete</Button></TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
        <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button> 
        <button className="btn-page" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>{currentPage-1}</button>     
        <button className="btn-page" style={{ backgroundColor: "lightblue"}}>{currentPage}</button>  
        <button className="btn-page" onClick={() => handlePageChange(currentPage +1)}  disabled={indexOfLastItem >= patientdata.length}>{currentPage+1}</button>
       
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastItem >= patientdata.length}
        >
          Next
        </Button>
      </div>
      </TableContainer> 
      
      ) : (
        
        <TableContainer component={Paper} className="no-record">
        <Table sx={{ minWidth: 680, minHeight: 155 }} aria-label="simple table">
         <TableBody>
          <TableCell align="center" style={{fontSize: 15, color: "grey", fontWeight: "bold"}}>No record found :|</TableCell>
         </TableBody>
        </Table>
        </TableContainer>
      )}
      </div>
      </div>
      </div>
    </div>
    
  );
      }

export default App;

