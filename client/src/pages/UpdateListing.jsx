import {useEffect, useState} from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase';
import React from 'react';
import { useSelector } from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';

export default function UpdateListing() {
  const {currentUser} = useSelector((state) => state.user.user);
  //console.log(currentUser);
  
  const [files, setFiles] = useState([]); //[] for multiple images
  //console.log(files);
  const [formData, setFormData] = useState({
    imageURLs: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  }); //initaial value
  //console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  //for handleSubmit
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      //The second "listingId" match the param in App.jsx <Route>
      
      //console.log(listingId);
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      //console.log(data);

      if(data.success === false) {
        console.log((data.message));
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    //e.preventDefault(); because we are not submitting the form
    if (files.length > 0 && files.length  + formData.imageURLs.length < 7) {
      setUploading(true);
      setImageUploadError(false);

      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({...formData, imageURLs: formData.imageURLs.concat(urls)}); //avoid duplicate upload
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
      imageURLs: formData.imageURLs.filter((_, i) => i != index),
    })
  };
  //_ means never change url

  const handleChange = (e) => {
    if (e.target.id == 'rent' || e.target.id == 'sale') {
      setFormData({...formData, type: e.target.id});
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData, 
        [e.target.id]: e.target.checked
      });
    }

    if (e.target.type === 'number' || e.target.type == 'text' || e.target.type === 'textarea') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent refresh
    try {
      if (formData.imageURLs.length < 1) return setError('You must upload at least one image.');
      if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');

      setLoading (true);
      setError(null);
      //console.log(formData);

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id})
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="test-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          ></input>
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          ></textarea>
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          ></input>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="sale" className="w-5"
                onChange={handleChange}
                checked={formData.type === 'sale'}
              ></input>
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="checkbox" 
                id="rent" className="w-5"
                onChange={handleChange}
                checked={formData.type === 'rent'}
              ></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              ></input>
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              ></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              ></input>
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
                onChange={handleChange}
                value={formData.bedrooms}
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
                onChange={handleChange}
                value={formData.bathrooms}
              ></input>
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min='50'
                max='99999'
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              ></input>
              <div className="flex flex-col items-center">
                <p>Rgular price</p>
                  {formData.type==='rent' && <span className="text-xs">($/month)</span>}
                  {formData.type==='sale' && <span className="text-xs">($)</span>}
              </div>
            </div>
            {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min='0'
                max='99999'
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.discountPrice}
              ></input>
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                  {formData.type==='rent' && <span className="text-xs">($/month)</span>}
                  {formData.type==='sale' && <span className="text-xs">($)</span>}
              </div>
            </div>
            )}
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
            formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => (
              <div key={url} className="flex justify-between p-3 border items-center">
                <img src={url} alt='listing image' className="w-20 h-20 object-contain rounded-lg"></img>
                <button type='button' onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 round-lg uppercase hover:opacity-70">Delete</button>
              </div>
            ))
          }
          <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg hover:opacity-95 uppercase disabled:opacity-80">{loading ? 'Updating...' : 'Update Listing'}</button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>

        
      </form>
    </main>
  );
}
