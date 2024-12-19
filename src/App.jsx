import { useEffect, useRef, useState } from 'react';
import './App.css';
import ReactJson from 'react-json-view';
import axios from 'axios';
import clsx from 'clsx';
import ListBox from './components/Listbox';

const requestTypes = ['GET', 'POST', 'PUT', 'DELETE'];

function App() {
  const [requestType, setRequestType] = useState(requestTypes[0]);
  const [url, setUrl] = useState('');
  const [isurlError, setIsUrlError] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headers, setHeaders] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [enableClipboard, setEnableClipboard] = useState(false);
  const [displayDataTypes, setDisplayDataTypes] = useState(false);
  const [displayObjectSize, setDisplayObjectSize] = useState(false);
  const [enablePolling, setEnablePolling] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pollingTime, setPollingTime] = useState(100);
  const [pollCount, setPollCount] = useState(0);
  const urlRef = useRef(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const startPolling = (e) => {
    e.preventDefault();
    setEnablePolling(true);

    if (pollingTime < 50) {
      return window.alert('Polling time should be greater than 50ms');
    }

    toggleModal();
  }

  useEffect(() => {
    if (enablePolling) {
      const interval = setInterval(() => {
        callApi();
        setPollCount(prevCount => prevCount + 1);
      }, pollingTime);
      return () => {
        setLoading(false);
        clearInterval(interval);
      }
    }
  }, [enablePolling])


  async function callApi() {
    try {
      setLoading(true);
      // setData(null); // Reset data on new request
      if (url === '') {
        setIsUrlError(true);
        urlRef.current.focus();
        return;
      }
      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const response = await axios({
        method: requestType.toLowerCase(),
        url,
        headers: parsedHeaders,
        data: method === "post" || method === "put" ? requestBody : undefined, // include data only for applicable methods
      });
      setData(response.data);
    } catch (error) {
      if (error?.response?.data) {
        setData(error.response.data);
        return;
      }
      window.alert("Failed to fetch data from the API");
      throw new Error(error);
    } finally {
      !enablePolling && setLoading(false);
    }
  }

  return (
    <div className='w-full flex items-center justify-center min-h-screen'>
      <div className="max-w-xl w-full">
        <h1 className='text-5xl font-bold'>
          Send a request
        </h1>
        <div className="w-full flex items-center mt-8 relative">
          <input
            type="url"
            ref={urlRef}
            placeholder='Enter url'
            className={clsx('px-3 rounded-l-md py-2.5 w-full outline-none',
              isurlError ? "focus-visible:ring-1 focus-visible:ring-red-500" : "focus-visible:ring-2 focus-visible:ring-teal-600"
            )}
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              setIsUrlError(false);
            }}
            disabled={loading}
          />

          <button onClick={callApi} disabled={loading} className='w-fit py-2.5 bg-teal-600 transition-colors duration-150 font-medium px-4 font-mono'>
            {requestType}
          </button>
          <ListBox defaultValue={requestType} values={requestTypes} handleSetValue={setRequestType} />
        </div>
        <div className='py-2 text-sm text-gray-300 font-mono flex items-center justify-between mt-1'>
          <label className="container-x">
            <span className="">Enable Polling</span>
            <input
              type="checkbox"
              className="enablePolling checkbox"
              checked={enablePolling}
              onChange={(e) => {
                if (e.target.checked) {
                  if (url === '') {
                    urlRef.current.focus();
                    setIsUrlError(true);
                    return;
                  }
                  toggleModal();
                } else {
                  setEnablePolling(false);
                }
              }}
            />
            <span className="checkmark"></span>
          </label>
          <span className='ml-auto block'>Polled: {pollCount}times</span>
        </div>

        <div className='w-full my-4'>
          <textarea
            type="text"
            placeholder='Enter headers as JSON (optional)'
            className='px-3 max-h-60 rounded-md py-2.5 w-full'
            value={headers}
            onChange={e => setHeaders(e.target.value)}
            disabled={loading}
          />
        </div>
        {
          requestType === 'POST' || requestType === 'PUT' ?
            <div className='w-full my-4'>
              <textarea
                type="text"
                placeholder='Enter request body as JSON'
                className='px-3 max-h-60 rounded-md py-2.5 w-full'
                value={requestBody}
                onChange={e => setRequestBody(e.target.value)}
                disabled={loading}
              />
            </div>
            : null
        }

        <div className='w-full text-left border border-gray-700 rounded-md p-2 pt-0 max-h-80 overflow-y-auto relative'>
          <div className='flex items-center justify-between w-full sticky top-0 z-10 bg-[#242424] py-1'>
            <span className='block select-none'>Response:</span>
            <div className='flex items-center gap-2'>
              <label className="container-x">
                <span className="">Enable Clipboard</span>
                <input
                  type="checkbox"
                  className="enableClipboard checkbox"
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
                  className="displayDataTypes checkbox"
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
                  className="displayObjectSize checkbox"
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

      <div className={`modal fixed inset-0 bg-black/90 z-50 flex items-center justify-center ${modalOpen ? "opacity-100 visible" : "opacity-0 invisible"} transition-all duration-150`}>
        <form onSubmit={startPolling} className="modal-body bg-[#242424] text-gray-50 w-full max-w-md rounded-md p-16">
          <h4 className='font-semibold text-xl text-left mb-2'>Enter polling interval (ms)</h4>
          <input
            type="number"
            name="polling-time"
            value={pollingTime}
            onChange={(e) => setPollingTime(e.target.value)}
            id="poll"
            className='px-3 rounded-md outline-none py-2.5 w-full bg-transparent border border-gray-600'
            min={50}
          />

          <div className='flex justify-between mt-4 text-white'>
            <button
              type="submit"
              className='bg-teal-600 hover:bg-teal-700 transition-colors duration-200 font-medium px-4 py-2.5 rounded-md'
            >
              Start
            </button>
            <button
              type='button'
              onClick={() => {
                toggleModal();
                setEnablePolling(false);
              }}
              className='bg-red-600 hover:bg-red-700 transition-colors duration-200 font-medium px-4 py-2.5 rounded-md'>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App;
