import React from 'react'

export default function Search() {
  return (
    <div className='flex flex-col md:flex-row'>
      {/* left side search panel */}
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
        <form className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input type='text' id='searchTerm' placeholder='Search...' className='border rounded-lg p-3 w-full'></input>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='all'></input>
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent'></input>
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer'></input>
              <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Aminities:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking'></input>
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished'></input>
              <span>Furnished</span>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select id='sort_order' className='border rounded-lg p-3'>
              <option>Price high to low</option>
              <option>Price low to high</option>
              <option>Latest</option>
              <option>Oldest</option>
            </select>
          </div>

          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85'>Search</button>
        </form>
      </div>

      {/* right side result panel */}
      <div className=''>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
      </div>
    </div>
  )
}
