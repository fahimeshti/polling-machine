import { useState } from 'react';
import './App.css';
import ReactJson from 'react-json-view';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState('');
  const [enableClipboard, setEnableClipboard] = useState(false);
  const [displayDataTypes, setDisplayDataTypes] = useState(false);
  const [displayObjectSize, setDisplayObjectSize] = useState(false);

  async function callApi() {
    try {
      setLoading(true);
      setData(null); // Reset data on new request
      if (url === '') {
        window.alert('Please enter a valid URL');
        return;
      }
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const response = await axios.get(url, { headers: parsedHeaders });
      setData(response.data);
    } catch (error) {
      if (error?.response?.data) {
        setData(error.response.data);
        return;
      }
      window.alert("Failed to fetch data from the API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full flex items-center justify-center min-h-screen'>
      <div className="max-w-xl w-full">
        <h1 className='text-5xl font-bold -mt-16'>Start Polling</h1>
        <div className="w-full flex items-center mt-8">
          <input
            type="url"
            placeholder='Enter url'
            className='px-3 rounded-l-md py-2.5 w-full'
            value={url}
            onChange={e => setUrl(e.target.value)}
            disabled={loading}
          />
          <button onClick={callApi} disabled={loading} className='w-fit py-2.5 bg-teal-600 hover:bg-teal-700 transition-colors duration-150 font-medium px-4 rounded-r-md'>
            Poll
          </button>
        </div>

        <div className='w-full my-4'>
          <textarea
            type="text"
            placeholder='Enter headers'
            className='px-3 max-h-60 rounded-md py-2.5 w-full'
            value={headers}
            onChange={e => setHeaders(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className='w-full text-left border border-gray-700 rounded-md p-2'>
          <div className='flex items-center justify-between w-full mb-2'>
            <span className='block select-none'>Response:</span>
            <div className='flex items-center gap-2'>
              <label className="container-x">
                <span className="">Enable Clipboard</span>
                <input
                  type="checkbox"
                  className="enableClipboard"
                  checked={enableClipboard}
                  onChange={() => setEnableClipboard(!enableClipboard)}
                />
                <span className="checkmark"></span>
              </label>
              <label className="container-x">
                <span className="">
                  Display Data Types
                </span>
                <input
                  type="checkbox"
                  className="displayDataTypes"
                  checked={displayDataTypes}
                  onChange={() => setDisplayDataTypes(!displayDataTypes)}
                />
                <span className="checkmark"></span>
              </label>
              <label className="container-x">
                <span className="">
                  Display Object Size
                </span>
                <input
                  type="checkbox"
                  className="displayObjectSize"
                  checked={displayObjectSize}
                  onChange={() => setDisplayObjectSize(!displayObjectSize)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
          <div>
            {data ?
              <ReactJson
                src={data}
                enableClipboard={enableClipboard}
                displayDataTypes={displayDataTypes}
                displayObjectSize={displayObjectSize}
                theme={'monokai'}
              />
              :
              <div className='text-center text-gray-500 py-8'>No data</div>
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default App;
