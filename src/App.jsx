import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [datalink,setDatalink] = useState("github.com");
  const handleFetch= async ()=>{

    let reponame = datalink.split("/")[datalink.split("/").length-1];
    let username = datalink.split("/")[datalink.split("/").length-2];
    console.log(reponame);
    console.log(username);
    let a = await fetch("https://api.github.com/repos/"+username+"/"+reponame);
    let r = await a.json();
    console.log(r);

  }
  const handleChange = (e)=>{
    setDatalink(e.target.value);
  }

  useEffect(()=>{ 
    console.log(datalink)
  },[datalink])

  return (
   <>
   <div className='font-bold text-2xl'>Generate a readme File</div>

   <input onChange={(e)=>{handleChange(e)}} className='px-5 py-2'  type="text" placeholder='paste public repo link' name='link'/>
   <button onClick={()=>{handleFetch()}} className="bg-green-500">Generate</button>
   
   </>
  )
}

export default App
