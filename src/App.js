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
//import SendIcon from '@mui/icons-material/Send';
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




function App() {
  const [op,setOP] = useState();
  const [name,setName] = useState("");
  const [age,setAge] = useState();
  const [gender, setGender] = useState('');
  const [phone,setPhone] = useState();

  const [patientdata,setPatientdata] = useState();
  const [allpatients,setAllPatientdata] = useState('');
  const [opsearch,setOpsearch] = useState('');
  const [namesearch,setNamesearch] = useState('');
  const [phonesearch,setPhonesearch] = useState('');
  const [open, setOpen] = useState(false);
  const [errortext,setErrortext] = useState("");

  const { firebaseConf, firestore } = firebaseExports;


  useEffect(() => {
   firestore
  .collection('patientlist')
  .get()
  .then((querySnapshot) => {
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setAllPatientdata( documents );
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
       await firestore.collection('patientlist').add({
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
        const querySnapshot = await firestore
          .collection('patientlist')
          .where('op_no', '==' ,opsearch)
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
      const querySnapshot = await firestore
        .collection('patientlist')
        .where('name', '>=', namesearch.toLowerCase())
        .where('name', '<=', namesearch.toLowerCase() + '\uf8ff')
        .get();

        const results = [];
        querySnapshot.forEach((doc) => {
          //console.log(doc.id);
        results.push({data:doc.data(),id:doc.id});
      });

      setPatientdata(results);
    } catch (error) {
      console.error('Error searching document: ', error);
    }
  }

  const searchByphone = async () =>{
    try {
      const querySnapshot = await firestore
        .collection('patientlist')
        .where('phone', '==' ,phonesearch)
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
   await firestore
    .collection('patientlist')
    .doc(documentId)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!',documentId);
    })
    .catch('error deleting document')
  
  }
  


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
        <div className="viewall-patients">
        {/* <Button variant="contained" endIcon={<SendIcon />} onClick={()=>setOpen(true)}>
          View all patients
        </Button> */}
        </div>
        <div className="modal">
        <Modal className="modalOverlay"
        
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="modal-box">
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <div className="content-display">
      {allpatients ? (
        <TableContainer component={Paper}  >
        <Table sx={{ minWidth: 680 }} aria-label="simple table">
        <TextField value={namesearch} onChange={(e)=>setNamesearch(e.target.value)} id="filled-basic" label="Search Name" variant="outlined" />
        &nbsp;<Button sx={{ minHeight:56 }} onClick={searchByname} variant="outlined">Go</Button>
          <TableHead>
            <TableRow>
              <TableCell>OP Number</TableCell>
              <TableCell align="right">Patient Name</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Phone</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="modalcontent">
            {allpatients.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.data.op_no}
                </TableCell>
                <TableCell align="right">{row.data.name.toUpperCase()}</TableCell>
                <TableCell align="right">{row.data.age}</TableCell>
                <TableCell align="right">{row.data.gender}</TableCell>
                <TableCell align="right">{row.data.phone}</TableCell>
    
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      ) : (
        null
      )}
      </div>
          </Typography>
        </Box>
      </Modal>
        </div>
        <div className="searching">

      <TextField value={opsearch} onChange={(e)=>setOpsearch(e.target.value)} id="filled-basic" label="Search OP" variant="filled" />
      <Button onClick={searchByop} variant="outlined">Go</Button> &nbsp;

      <TextField value={namesearch} onChange={(e)=>setNamesearch(e.target.value)} id="filled-basic" label="Search Name" variant="filled" />
      <Button onClick={searchByname} variant="outlined">Go</Button> &nbsp;

      <TextField value={phonesearch} onChange={(e)=>setPhonesearch(e.target.value)} id="filled-basic" label="Search phone" variant="filled" />
      <Button onClick={searchByphone} variant="outlined">Go</Button>

      </div>
      <div className="content-display">
      {patientdata ? (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 680 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>OP Number</TableCell>
              <TableCell align="right">Patient Name</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Gender</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientdata.map((row) => (
              
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                
                <TableCell component="th" scope="row">
                  {row.data.op_no}
                </TableCell>
                <TableCell align="right">{row.data.name.toUpperCase()}</TableCell>
                <TableCell align="right">{row.data.age}</TableCell>
                <TableCell align="right">{row.data.gender}</TableCell>
                <TableCell align="right">{row.data.phone}</TableCell>
      <TableCell align="right"><Button onClick={()=>deleteDocument(row.id).then(toast.success("Deleted successfully!"))} variant="outlined">Delete</Button></TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      ) : (
        null
      )}
      </div>
      </div>
      </div>

    </div>
  );
      }

export default App;

