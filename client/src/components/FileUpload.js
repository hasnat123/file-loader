import { useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";

const FileUpload = function()
{
    const [file, setFile] = useState("");
    const [filename, setFilename] = useState("Choose File");
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState("");
    const [uploadPercentage, setUploadPercentage] = useState(0);



    const onChange = function(event)
    {
        setFile(event.target.files[0]);
        setFilename(event.target.files[0].name);
    }

    const onSubmit = async function(event)
    {
        event.preventDefault();{/*Preventing page refresh when submitting*/}

        const formData = new FormData(); {/*Creating 'formData' object to hold file data*/}
        formData.append("file", file); {/*Appending file to 'formData' object with name 'file'*/}

        try 
        {
            const res = await axios.post("/upload", formData, 
            {
                headers:
                {
                    "Content-Type": "multipart/form-data"
                },
                //'progressEvent' function called as upload progresses
                onUploadProgress: progressEvent =>
                {
                    //Calculating and setting the upload progress percentage
                    setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
                }
            });
            
            //Clearing percentage after 5 seconds
            setTimeout(function(){ setUploadPercentage(0); }, 5000);

            const { fileName, filePath } = res.data; {/*Storing json object received from server into variables*/}

            setUploadedFile(res.data);

            setMessage("File Uploaded");

        }
        catch(err)
        {
            if(err.response.status === 500) setMessage("There was a problem with the server");
            else setMessage(err.response.data.msg); {/*Logging 'msg' object sent from server for 400 error*/}
            setUploadPercentage(0)
        }
    }

    return (
        <>
            { message ? <Message msg={ message } /> : null }
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-4">
                    <input className="form-control" type="file" id="formFile" onChange={onChange} />
                </div>

                <Progress percentage={ uploadPercentage } />

                {/*Need to put sumbit button inside div with display of 'grid'*/}
                <div className="d-grid">
                    <input type="submit" value="Upload" className="btn btn-primary mt-4" />
                </div>
            </form>

            { uploadedFile ? <div className="row mt-5">
              <div className="col-md-6 m-auto">
                <h3 className="text-center">{ uploadedFile.fileName } </h3>
                <img style={{ width: "100%" }} src={ uploadedFile.filePath } alt="" />
              </div>
            </div> : null}
        </>
    );
}

export default FileUpload;