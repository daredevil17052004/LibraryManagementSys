'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const LibraryStats = () => {

    const [libraryData, setLibraryData] = useState(null);
    
    const API_BASE_URL = "http://localhost:5000/api"; 

    useEffect(()=>{
        const getLibraryData = async ()=>{
            try{
                const response = await axios.get(`${API_BASE_URL}/library-stats`,{
                    headers:{
                        "x-api-key" : 'secureapikey123',
                        "Content-Type" : 'application/json'
                    }
                });
                setLibraryData(response.data);
            }catch(error){
                console.log(error.message)
            }
        }

        getLibraryData();
    },{})

    console.log(libraryData)
  return (
  <div className="px-10 mt-10">
    {/* books details */}
    <div className="flex justify-between items-center h-40">


      <div className="h-40 w-60 border rounded-md px-5 flex flex-col items-start pt-4">

        <div > 
          <p>Total Books Due</p>
        </div>

        <div>
          <p>{libraryData?.total_books_due}</p>
        </div>
      </div>

      <div className="h-40 w-60 border rounded-md px-5 flex flex-col items-start pt-4">
        <div>
          <p>Members with Books</p>
        </div>

        <div>
          <p>{libraryData?.members_with_books}</p>
        </div>
      </div>

      <div className="h-40 w-60 border rounded-md px-5 flex flex-col items-start pt-4">
        <div>
          <p>Overdue Books</p>
        </div>

        <div>
          <p>{libraryData?.overdue_books}</p>
        </div>
      </div>

      <div className="h-40 w-60 border rounded-md px-5 flex flex-col items-start pt-4">
        <div>
          <p>Members with Books</p>
        </div>

        <div>
          <p>{libraryData?.members_with_books}</p>
        </div>
      </div>
      
    </div>


    <div className='pt-10'>
      <div>
        <p>Books Never Borrowed </p>
      </div>

      <div>
        <p>{libraryData?.never_borrowed_books.map((item,index)=>{
          return <li key={index}>{item}</li>
        })}</p>
      </div>
    </div>



    <div className='w-full pt-10'>
      <div>
        <p>Most Borrowed Books</p>
      </div>
      <Carousel className="w-[1500px] ">
        <CarouselContent className="">
          {libraryData?.mostBorrowedBooksResult.map((item, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/6">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <div className='flex flex-col items-center justify-center'>
                      <p className="text-xl font-semibold">{item.book_name}</p>
                      <p>Number of times borrowed: {item.borrow_count}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  </div>

  )
}

export default LibraryStats