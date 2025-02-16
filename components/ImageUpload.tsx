"use client"
import config from "@/lib/config";
import { IKImage, IKVideo, ImageKitProvider, IKUpload, ImageKitContext } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
        if(!response.ok){
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`)
        }

        const data = await response.json();
        const {signature, expire, token} = data;

        return {token, expire, signature};
    } catch (error: any) {
        throw new Error(`authentication failed: ${error.message}`)
    }
}

const ImageUpload = ({onFileChange}: {onFileChange: (filePath: string) => void}) => {
    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<Record<string, string> | null>(null);

    const onError = (error: any) => {
        console.log(error);
        toast({
            title: "Ngarkimi i imazhit deshtoi!",
            description: `Imazhi juaj nuk mundi te ngarkohet. Ju lutem provoni perseri!`,
            variant: "destructive"
        })
    }

    const onSuccess = (res: any) => {
        console.log(res);
        
        setFile(res)
        onFileChange(res.filePath)
        toast({
            title: "Imazhi u ngarkua me sukses!",
            description: `${res.filePath} u ngarkua me sukses!`
        })
    }

  return (
    <ImageKitProvider publicKey={config.env.imagekit.publicKey} urlEndpoint={config.env.imagekit.urlEndpoint} authenticator={authenticator}>
        <IKUpload
            className="hidden"
            ref={ikUploadRef}
            onError={onError}
            onSuccess={onSuccess}
            fileName={file?.name}
            />
            
            <button className="upload-btn bg-dark-300" onClick={(e) => {
                e.preventDefault();
                if(ikUploadRef.current){
                    //@ts-ignore
                    ikUploadRef.current?.click();
                }
            }}>
                <Image src={"/icons/upload.svg"} alt="upload-icon" width={20} height={20} className="object-contain"/>
                <p className="text-base text-light-100">Ngarkoni nje fajll</p>
                {file && <p className="upload-filename">{file.filePath}</p>}
                </button>

                {file && (
                    <IKImage 
                        alt={file.filePath}
                        path={file.filePath}
                        width={500}
                        height={500}
                    />
                )}
    </ImageKitProvider>
  )
}

export default ImageUpload