import React,{useState,useEffect,useRef} from 'react';
import axios from 'axios';

const uploadUrl = "http://localhost:8080/api/images/add-image";
const fetchUrl = "http://localhost:8080/api/images/get-image";

const Home = () => {

    const [postImage, setPostImage] = useState( { file : ""});
    const [data, setData] = useState([]);
    const fileInputRef = useRef(null);

    const [imageData, setImageData] = useState(null);

        useEffect(() => {
            axios
            .get(fetchUrl)
            .then((res) => {setData(res.data);})
            .catch((err) => console.log(err, "it has an error"));
        },);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
         setImageData(reader.result);
       };

        const base64 = await convertToBase64(file);
        setPostImage({ ...postImage, file : base64 })
      }

      const createPost = async (newImage) => {
        try{
          await axios.post(uploadUrl, newImage)
        }catch(error){
          console.log(error)
        }
      }
    
      const handleSubmit = (e) => {
        e.preventDefault();
        createPost(postImage);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setImageData(null);
        console.log("Uploaded")
      }

  return (
    <div>
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                type="file"
                lable="Image"
                name="myFile"
                id='file-upload'
                accept='.jpeg, .png, .jpg'
                onChange={(e) => handleFileUpload(e)}
                ref={fileInputRef}/>
                {imageData && <img src={imageData} alt="Uploaded Image" />}
                <button type='submit'>Submit</button>
            </form>
        </div>
        <div>
        {data.map((singleData) => {
        const base64String = singleData.file.split(',')[1];
        const dataURL = `data:image/jpeg;base64,${base64String}`;
         return <img src={dataURL} width="300" alt="Random pic" />;
      })}
        </div>
    </div>
  )
}

export default Home;

function convertToBase64(file){
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result)
      };
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }