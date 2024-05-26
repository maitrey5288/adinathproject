import React, { useContext } from 'react'
 
import { movieAPI} from "../../API/apis";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../API/apiconnector';
import Card from './Card';
import { ProgressContext } from '../../context/Context';
 
  
const Movies = () => {
    const navigate = useNavigate();
    const [theatres,setTheatres] =useState([]); 
    const [locations,setLocations] =useState([]); 
    const [selectedtheatre,setSelectedTheatre] = useState('');
    const [selectedlocation,setSelectedLocation] = useState('');
    const [query,setQuery] = useState('');
    const { GETTHEATRES_API,GETLOCATIONS_API,ADDLOCATION_API} = movieAPI;
   const [loading,setLoading] = useState(false)
    const [moviedata,setMoviedata] = useState([])
    const {GETMOVIES_API} = movieAPI
const {setProgress} = useContext(ProgressContext);
const [filtered,setFiltered] = useState(moviedata?.filter(movie => movie.name.toLowerCase().includes(query.toLowerCase())))
    async function getMoviesData(){
      setProgress(10)
      setLoading(true)
      const res = await apiConnector("POST" ,GETMOVIES_API,{location:selectedlocation,theatre:selectedtheatre} );
      setProgress(30)
      setMoviedata(res.data.data); 
      setProgress(50)
    
      setProgress(70)
      setLoading(false)
      setProgress(100)
    }
 
    function theatrechangehandler(e) {
        setSelectedTheatre(e.target.value);
        
    }
     function locationchangehandler(e) {
         
          setSelectedLocation(e.target.value);
        
       
        
        
    }

    async function getLocations(){
        setLoading(true)
        const res = await apiConnector("POST", GETLOCATIONS_API ,{});
 
        setLocations(res.data.data);
        
        
        setLoading(false)
    }
 

  function queryChanger(e){
   
    setQuery(e.target.value) ;
  
 

  }
useEffect(() => {
  setFiltered (moviedata?.filter(movie => movie.name.toLowerCase().includes(query.toLowerCase()))   )
}, [query,moviedata])

  useEffect(() => {
    locations.forEach(l => {
        if(l._id == selectedlocation){
            if(l.theatres)
            {setTheatres( l.theatres);}
        else
       { setTheatres([])}
          
        }
    });
  }, [selectedlocation])

  useEffect( () => {
    getMoviesData()
  }, [selectedlocation,selectedtheatre])
  
  useEffect(() => {
    getLocations();
    return () => {
      setMoviedata([])
    }
  }, [])
 
  return (
    loading ?  <div className='text-white'>Loading</div> : (<><div className="bg-bg-2 text-white  w-full  pt-11   px-32">
        <div className='text-3xl text-white w-full flex flex-col items-center my-2'>
                <p>All Movies</p>
                <div className={`h-1 w-36 mt-1 bg-textcolor`}></div>
        </div>
        <div className='w-full flex justify-evenly mt-4'>                    
            <div>
                <input onChange={queryChanger} value={query} className='w-44 h-8 bg-neutral-500/25 border-textcolor border rounded-md p-2' placeholder='Search'></input>
            </div>
          
        </div>
        <div className="w-[70%] p-3 mx-auto flex justify-between">
     
      
    <div className="flex justify-between items-center">
    
      <div className="flex gap-3 items-center">
        <p className="text-textcolor text-xl">Select Location</p>
        <select
          className="bg-bgcarousalcontent my-3 p-2 rounded-md text-white"
          onChange={locationchangehandler}
      
           value={selectedlocation}
        >
          <option value="">
           All
          </option>
    
          { 
            locations?.map((location, index) => {
            
            return (
              <option  value={location._id} key={index}>
                {location.name}
              </option>
            );
          })}
        </select>
      </div>
    
     
      </div>
    

    
<div>
   { selectedlocation != '' && <><div className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <p className="text-textcolor text-xl">Select Theatre</p>
        <select
          className="bg-bgcarousalcontent my-3 p-2 rounded-md text-white"
          onChange={theatrechangehandler}
          defaultValue={""}
          value={selectedtheatre}
        >
          <option value="">
            All
          </option>
          {theatres?.map((theatre, index) => {
            return (
              <option value={theatre._id} key={index}>
                {theatre.name}
              </option>
            );
          })}
        </select>
      </div>

     
    </div>
     
    </>  } </div>


      </div>
        

    </div>
    <div  className=' w-full flex-wrap bg-bg-1 py-3 justify-center mt-9 flex gap-4'>
        { filtered.length>0 ?
          filtered.map((movie)=>{
            
            return <Card key={movie._id} movie={movie}/>
        }): <div className='text-textcolor text-5xl'>No Movie Found</div> }
        </div></>)
  )
}

export default Movies