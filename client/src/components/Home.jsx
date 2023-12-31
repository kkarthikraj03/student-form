import React, { useEffect, useState } from 'react'

const Home = () => {
  const [formData,SetFormData] = useState({
     id: '',
     name: '',
     age: '',
  });
  const [students,SetStudents] = useState([]);
  const handleInput = (e) => {
    const { name,value } = e.target;
    SetFormData({
        ...formData,
        [name] : value,
    });
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        const response = await fetch('http://localhost:3001/submit',{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(formData),
        })
        if(response.ok){
            console.log("Data Submitted Successfully");
            alert("Data submitted");
            fetchData();
        }
        else{
            console.log("Error in Sending data!");
        }
    }
    catch(error){
        console.log("Error in API -> ", error);
    }
  }
  const fetchData = async() => {
      fetch('http://localhost:3001/view')
        .then(response => {
          if(!response.ok)
            throw new Error(`Http Error! Status ${response.status}`);
          return response.json();
        })
        .then(data => SetStudents(data))
        .catch(error => console.error("Error Fetching ", error));
  }
  useEffect(() => {
    fetchData();
  },[]);
  return (
    <div className='home'>
      <h2>Registration Form</h2>
      <form className='formDiv'>
        <div className="txtDiv">
            <label htmlFor="id">Enter your ID </label>
            <input type="number" name='id' id='id' value={formData.id} onChange={handleInput}/>
        </div>
        <div className='txtDiv'>
            <label htmlFor="name">Enter your name </label>
            <input type='text' name='name' id='name' value={formData.name} onChange={handleInput}/>
        </div>
        <div className='txtDiv'>
            <label htmlFor="age">Enter your age </label>
            <input type="number" name='age' id='age' value={formData.age} onChange={handleInput}/>
        </div>
        <button className='btnDiv' onClick={handleSubmit}>Submit</button>
      </form>
      <div className="tableDiv">
        <table border={2}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Home
