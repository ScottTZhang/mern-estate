import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from "../components/ListingItem";



export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  console.log(saleListings);
  
  useEffect(() => {
    const fetchOfferListings = async() => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
        
      }
    }

    const fetchRentListings = async() => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings()
      } catch (error) {
        console.log(error);
        
      }
    }

    const fetchSaleListings = async() => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
        
      }
    }
    fetchOfferListings(); //get the offer, rent, sale date one by one
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-18 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span> 
          <br />
          place with ease
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Ting Estate is the best plave to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
          Let's get started...
        </Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {
          offerListings && offerListings.length > 0 && 
          offerListings.map((listing) =>(
            <SwiperSlide>
              <div 
                style={{
                  background: `url(${listing.imageURLs[0]}) center no-repeat`, 
                  backgroundSize: 'cover'}} 
                className='h-[500px]' 
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))
        }
      </Swiper>
    
      {/* listin results for offer */}
      <div className='max-w mx-auto p-4 flex flex-col gap-7 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link to={'/search?offer=true'} className='text-sm text-blue-800 hover:underline'>
                Show more offers
              </Link>
            </div>
            <div className='flex flex-wrap gap-3'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key = {listing._id}></ListingItem>
              ))}
            </div>
          </div>
          )
        }
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link to={'/search?type=rent'} className='text-sm text-blue-800 hover:underline'>
                Show more places for rent
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key = {listing._id}></ListingItem>
              ))}
            </div>
          </div>
          )
        }
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link to={'/search?type=sale'} className='text-sm text-blue-800 hover:underline'>
              Show more places for sale
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key = {listing._id}></ListingItem>
              ))}
            </div>
          </div>
          )
        }
      </div>
    </div>
  )
}
