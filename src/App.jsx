import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [datalink, setDatalink] = useState("github.com");
  const [readmetemp, setReadmetemp] = useState("");
  const handleFetch = async () => {

    let reponame = datalink.split("/")[datalink.split("/").length - 1];
    let username = datalink.split("/")[datalink.split("/").length - 2];
    console.log(reponame);
    console.log(username);


    let Content = await fetch(`https://api.github.com/repos/${username}/${reponame}/contents`);
    let c = await Content.json();
    console.log(c);

    console.log(c[8].git_url);
    let tree = await fetch(c[8].git_url);
    let t = await tree.json();

    let code = await fetch(t.tree[1].url);
    let code_content = await code.json();
    const decoded = atob(code_content.content);

    let langRes = await fetch(`https://api.github.com/repos/${username}/${reponame}/languages`);
    let langData = await langRes.json();
    console.log(langData);

    let readme = await handleGeneration(decoded, langData, c,t);
    console.log(readme);
  }
  const handleGeneration = async (code, langData,repodata,fileStruc) => {
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: (`You are an expert technical writer.

Given the following project metadata and additional information, generate a complete, professional README.md file suitable for a public GitHub repository. Follow best practices for open source documentation.

Format the README using GitHub-flavored Markdown, and include the following sections if applicable:

Project Title

Description

Features

Installation

Usage

API (if available)

Contributing

License

Acknowledgments (if relevant)

Here is the project data:`)
      ,data:{code,langData,repodata,fileStruc}}),
    });
    const data = await res.json();
    // console.log(data.result);
    return data.result;
  };

  const handleChange = (e) => {
    setDatalink(e.target.value);
  }

  useEffect(() => {
    console.log(datalink)
  }, [datalink])

  return (
    <>
      <div className='font-bold text-2xl'>Generate a readme File</div>

      <input onChange={(e) => { handleChange(e) }} className='px-5 py-2' type="text" placeholder='paste public repo link' name='link' />
      <button onClick={() => { handleFetch() }} className="bg-green-500">Generate</button>

    </>
  )
}

export default App
