"use client"
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getInitials } from '@/lib/utils'
import { signIn, useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import {Session} from "next-auth"

const ProfileImageUploads = () => {
    const {data: session, update} = useSession();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);    
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      if(file){
        handleUploads();
      }
    }, [file])

    if(!session) return null;
    

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return;
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    }

    const handleUploads = async () => {
        if(!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const res = await fetch(`/api/photoUpload/${session.user.id}`, {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            if(!res.ok){
                console.error(data);
                toast({
                    title: "Something went wrong.",
                    description: "Please try again, or contact us!",
                    variant: "destructive"
                })
            }

            toast({
                title: "Operation successfull",
                description: "Successfully changed profile picture!"
            })

            setImageUrl(data.imageUrl)
            
            await update({user: {...session.user, profileImage: data.imageUrl}})

        } catch (error) {
            console.error("Error in uploading photo");
            toast({
                title: "Something went wrong.",
                description: "Please try again, or contact us!",
                variant: "destructive"
            })
        } finally {
            setUploading(false);
        }
    }

  return (
    <>
    <Avatar onClick={() => inputRef.current ? inputRef.current.click() : {}} className="bg-white items-center justify-center h-20 w-20 cursor-pointer">
        <AvatarImage src={process.env.NEXT_PUBLIC_API_ENDPOINT + session.user.profileImage} alt={`profile-${session.user.name}`}/>
        <AvatarFallback>
            {getInitials(session.user.name || "USR")}
        </AvatarFallback>
    </Avatar>
    <input
        ref={inputRef}
        type="file"
        accept='image/*'
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
    />
    </>
  )
}

export default ProfileImageUploads