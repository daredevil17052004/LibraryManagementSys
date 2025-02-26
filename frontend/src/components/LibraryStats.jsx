'use client'
import React, { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

const LibraryStats = () => {
    const [libraryData, setLibraryData] = useState({
        never_borrowed: [],
        outstanding_books: [],
        top_borrowed: [],
        pending_returns: []
    });
    const [date, setDate] = useState(new Date());
    
    const API_BASE_URL = "http://13.48.55.79:5000/api"; 

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateForAPI = (date) => {
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };

    const formatDateForDisplay = (date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const fetchOutstandingBooks = async (selectedDate) => {
        try {
            const formattedDate = formatDateForAPI(selectedDate);
            const response = await fetch(`${API_BASE_URL}/library-stats/pending-returns/${formattedDate}`, {
                headers: {
                    "x-api-key": 'secureapikey123',
                    "Content-Type": 'application/json'
                }
            });
            const data = await response.json();
            setLibraryData(prevData => ({
                ...prevData,
                outstanding_books: data.pending_returns
            }));
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const getLibraryData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/library-stats`, {
                    headers: {
                        "x-api-key": 'secureapikey123',
                        "Content-Type": 'application/json'
                    }
                });
                const data = await response.json();
                setLibraryData(data);
            } catch (error) {
                console.log(error.message);
            }
        }

        getLibraryData();
    }, []);

    useEffect(() => {
        fetchOutstandingBooks(date);
    }, [date]);


    console.log(libraryData)

    return (
        <div className="p-8 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Never Borrowed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {libraryData.never_borrowed?.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Books</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Outstanding Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {libraryData.outstanding_books?.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Currently Borrowed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Top Borrowed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {libraryData.top_borrowed?.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Most Popular Books</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Pending Returns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {libraryData.pending_returns?.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Due Today</p>
                    </CardContent>
                </Card>
            </div>

            {/* Outstanding Books Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Outstanding Books</CardTitle>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formatDateForDisplay(date)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => newDate && setDate(newDate)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-lg border">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-medium">Member Name</th>
                                    <th scope="col" className="px-6 py-3 font-medium">Book Name</th>
                                    <th scope="col" className="px-6 py-3 font-medium">Issued Date</th>
                                    <th scope="col" className="px-6 py-3 font-medium">Target Return Date</th>
                                    <th scope="col" className="px-6 py-3 font-medium">Author</th>
                                </tr>
                            </thead>
                            <tbody>
                                {libraryData.outstanding_books?.map((book, index) => (
                                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">
                                            {book.mem_name}
                                        </td>
                                        <td className="px-6 py-4">{book.book_name}</td>
                                        <td className="px-6 py-4">{formatDate(book.issuance_date)}</td>
                                        <td className="px-6 py-4">{formatDate(book.target_return_date)}</td>
                                        <td className="px-6 py-4">{book.Author}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Top Borrowed Books Carousel */}
            <Card>
                <CardHeader>
                    <CardTitle>Most Borrowed Books</CardTitle>
                </CardHeader>
                <CardContent>
                    <Carousel className="w-full">
                        <CarouselContent>
                            {libraryData.top_borrowed?.map((book, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <Card>
                                        <CardContent className="p-4">
                                            <p className="font-semibold">{book.book_name}</p>
                                            <p className="text-sm">Borrowed {book.times_borrowed} times</p>
                                            <p className="text-sm text-muted-foreground">
                                                By {book.unique_members_borrowed} members
                                            </p>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </CardContent>
            </Card>

            {/* Never Borrowed Books */}
            <Card>
                <CardHeader>
                    <CardTitle>Never Borrowed Books</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {libraryData.never_borrowed?.map((book, index) => (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    <p className="font-semibold">{book.book_name}</p>
                                    <p className="text-sm text-muted-foreground">Author: {book.Author}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LibraryStats