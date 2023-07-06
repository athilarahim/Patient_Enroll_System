import React from "react";
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
import firestore from "./firebase";


function App() {
  const [op,setOP] = useState();
  const [name,setName] = useState("");
  const [age,setAge] = useState();
  const [gender, setGender] = useState('');
  const [phone,setPhone] = useState();

  const [patientdata,setPatientdata] = useState('');
  const [opsearch,setOpsearch] = useState('');
  const [namesearch,setNamesearch] = useState('');
  const [phonesearch,setPhonesearch] = useState('');



  const AddPatients = async (e) =>{
       e.preventDefault();

       try{
       await firestore.collection('op_no').add({
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

  const searchByop = async () =>{
  
      try {
        const querySnapshot = await firestore
          .collection('op_no')
          .where('op_no', '==' ,opsearch)
          .get();

          const results = [];
          querySnapshot.forEach((doc) => {
          results.push(doc.data());
        });

        setPatientdata(results);
      } catch (error) {
        console.error('Error searching document: ', error);
      }
    };


  const searchByname = async () =>{
    try {
      const querySnapshot = await firestore
        .collection('op_no')
        .where('name', '>=', namesearch.toLowerCase())
        .where('name', '<=', namesearch.toLowerCase() + '\uf8ff')
        .get();

        const results = [];
        querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      setPatientdata(results);
    } catch (error) {
      console.error('Error searching document: ', error);
    }
  }

  const searchByphone = async () =>{
    try {
      const querySnapshot = await firestore
        .collection('op_no')
        .where('phone', '==' ,phonesearch)
        .get();

        const results = [];
        querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });

      setPatientdata(results);
    } catch (error) {
      console.error('Error searching document: ', error);
    }
  }


  return (
    <div className="App">
      <h2 className="heading">Pro Dent Care, Erattupetta</h2>
      <div className="row">
      <div className="column-one">
      <Paper className="maincard" elevation={3} >
        <h2 style={{color:"grey"}}>Add New Patient</h2>
        <TextField fullWidth id="filled-basic" label="OP Number" variant="filled" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
        value={op || ''} onChange={(e)=>setOP(e.target.value)} /><br/>

        <TextField fullWidth id="filled-basic" label="Name" variant="filled" 
        value={name || ''} onChange={(e)=>setName(e.target.value)} /><br/>
        <TextField fullWidth id="filled-basic" label="Phone Number" variant="filled" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        value={phone || ''} onChange={(e)=>setPhone(e.target.value)}/>
        <br/>
        <div className="ageandgender">
        <TextField fullWidth id="filled-basic" label="Age" variant="filled" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
        value={age || ''} onChange={(e)=>setAge(e.target.value)} /> &nbsp;
        <FormControl variant="filled" sx={{ minWidth: 200 }}>
        <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
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

      <Button variant="contained" onClick={AddPatients}>Add Patient</Button>
    
      </Paper>
      </div>
      <div className="column-two">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {patientdata.map((row) => (
              <TableRow
                key={row.op_no}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.op_no}
                </TableCell>
                <TableCell align="right">{row.name.toUpperCase()}</TableCell>
                <TableCell align="right">{row.age}</TableCell>
                <TableCell align="right">{row.gender}</TableCell>
                <TableCell align="right">{row.phone}</TableCell>
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

