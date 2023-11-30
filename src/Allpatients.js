import { useState, useEffect } from "react";
import firebaseExports from "./firebase";
import './App.css';
//import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';



const Allpatients = () => {
 
  const { firebaseConf, firestore } = firebaseExports;
  
  //fetching firestore database
  const db = firestore.collection('patientlist');  //change firestore DB name here
  
  const [allpatients,setAllPatientdata] = useState([]);
  const [open, setOpen] = useState(false);



  useEffect(() => {
    
   db.orderBy('name')
   .get()
   .then((querySnapshot) => {
     const documents = querySnapshot.docs.map((doc) => ({
       id: doc.id,
       data: doc.data(),
     }));
     setAllPatientdata( documents );
   });
  
 }, [])

 ////////////////Export to excel////////////////

//  const exportToExcel = () => {
//   const ws = XLSX.utils.json_to_sheet(allpatients);
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
//   XLSX.writeFile(wb, 'patients-data.xlsx');
// };


return (

  <div className="main-modal">
    <div className="modal">
        <Modal className="modal-overlay"
        
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="modal-box">
          <button style={{marginLeft: 1190}} onClick={()=>setOpen(false)}>x</button>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
          <div className="modal-content">
          <table cellSpacing={1} cellPadding={5} border={1} style={{marginLeft: 100}}>
                <tr style={{textAlign: "left", columnSpan: 10}}>
                    <th>OP Number</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                </tr>
                {allpatients.map((val, key) => {
                    return (
                        <tr key={key}>
                            <td>{val.data.op_no}</td>
                            <td>{val.data.name}</td>
                            <td>{val.data.age}</td>
                            <td>{val.data.gender}</td>
                            <td>{val.data.phone}</td>
                        </tr>
                    )
                })}
          </table>

          </div>
          </Typography>
        </Box>
      </Modal>
        </div>

        <Button variant="contained" onClick={()=>setOpen(true)}>
          View all patients
      </Button>
  </div>
 

  
);

 
};

export default Allpatients;


