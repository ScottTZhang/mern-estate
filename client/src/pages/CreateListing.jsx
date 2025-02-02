import {useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';

export default function CreateListing() {
  const [files, setFiles] = useState([]); //[] for multiple images
  //console.log(files);
  const [formData, setFormData] = useState({
    imageUrls : [],

  }); //initaial value
  //console.log(formData);
const [imageUploadError, setImageUploadError] = useState(false);
const [uploading, setUploading] = useState(false);
  
  const handleImageSubmit = (e) => {
    //e.preventDefault(); because we are not submitting the form
    if (files.length > 0 && files.length  + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)}); //avoid duplicate upload
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('Image upload failed (2MB max per image)');
        setUploading(false);
      });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);

    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log((`Upload is ${progress} done`));
          
        },
        (error)=>{
          reject(error);
        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
          });
        },
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i != index),
    })
  };
  //_ means never change url

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="test-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          ></input>
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          ></input>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5"></input>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5"></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"></input>
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5"></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"></input>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              ></input>
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              ></input>
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
              ></input>
              <div className="flex flex-col items-center">
                <p>Rgular price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountedPrice"
                required
                className="p-3 border border-gray-300 rounded-lg"
              ></input>
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-2">
          <p className="font-semibold">Images:
            <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input onChange={(e)=>setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type='file' id="images" accept="image/*" multiple></input>
            <button type='button' disabled={uploading} onClick={handleImageSubmit} className="p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-sm">{imageUploadError}</p>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between p-3 border items-center">
                <img src={url} alt='listing image' className="w-20 h-20 object-contain rounded-lg"></img>
                <button type='button' onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 round-lg uppercase hover:opacity-70">Delete</button>
              </div>
            ))
          }
          <button className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 uppercase disabled:opacity-80">Create Listing</button>
        </div>

        
      </form>
    </main>
  );
}
