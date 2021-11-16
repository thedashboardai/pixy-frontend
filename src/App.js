import { useEffect, useState } from 'react';
import logo from './logo.svg';
/* AWS S3 Client */
/* uploadFile.ts */
import ReactS3Client from 'react-aws-s3-typescript';
import { CopyBlock } from "react-code-blocks";

import { s3Config } from './s3config';
import './App.css'

let url = '';

function createObjectURL(object) {
  return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
}

function App() {
  const [upload, setUpload] = useState()
  const [loading, setLoading] = useState(false);
  const [imgUrl, setimgUrl] = useState('')
  const [shape, setShape] = useState(1)
  const [optimizedUrl, setoptimizedUrl] = useState('')
  
  const uploadImage = async () => {
    const s3 = new ReactS3Client({
      ...s3Config,
      dirName: '',
    });

    try {
      const res = await s3.uploadFile(upload);
      console.log(res.location);
      url = res.location
      setimgUrl(res.location)
    } catch (exception) {
      console.error(exception);
      /* handle the exception */
    }

  };

  const process = async() => {
    if(!upload) return
    setLoading(true);
    // const data = await res.json()
    setimgUrl('')
    setoptimizedUrl('')
    await uploadImage()
    try {
      console.log('&&&',imgUrl);
      const res = await fetch('https://pixy-sinatra.herokuapp.com/resize?url=' + url + '&shape=' + shape, {
      })
      console.log(res);
      const data = await res?.json()
      console.log(data?._meta?.Location);
      await fetch("tin")
      // let src = createObjectURL(data)
      setoptimizedUrl(data?._meta?.Location)
      // setoptimizedUrl(data)
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
    // setUpload(null)
  }

  useEffect(() => {
    console.log(shape);
  }, [shape])

  return (
    <div className="App">
      <h1>Pixy <small><em>by Sinatra</em></small></h1>

      <h3>Select File</h3>
      <input type="file" name="image" onChange={(e) => setUpload(e.target.files[0])} />
      <br />
      <br />
      <br />

      <h3>Select shape</h3>
      <label>Square: 
        <input type="radio" value="on" name="shape" onChange={e => {
        console.log(e.target.value);
        if(e.target.value==="on") setShape(1)}}/>
      </label>
      <br/>
      <label>Rectangle: 
        <input type="radio" value="on" name="shape" onChange={e => {
        console.log(e.target.value);
        if(e.target.value==="on") setShape(0)}}/>
      </label>
      
      <div>
        <button className="process" onClick={process}>{!loading ? 'Process' : 'Processing...'}</button>
        &nbsp;
        <button className="reset" onClick={() => {
window.location.reload()
        }}>Reset</button>
      </div>

      <hr />
      
      {optimizedUrl &&(
        <div>
          <h3>Optimized</h3>
          <CopyBlock
            text={optimizedUrl}
            language="html"
            // showLineNumbers={true}
            theme={'dracula'}
            // startingLineNumber={}
            wrapLines
            codeBlock
            />
          <img src={optimizedUrl} alt="optimized" />
        </div>
      )}
      {url &&(
        <div>
          <h3>Original</h3>
          <CopyBlock
            text={optimizedUrl}
            language="html"
            // showLineNumbers={true}
            theme={'dracula'}
            // startingLineNumber={}
            wrapLines
            codeBlock
            />
          <img src={url} alt="original"/>
        </div>
      )}
    </div>
  );

}

export default App;
