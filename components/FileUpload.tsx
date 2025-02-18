"use client"
import config from "@/lib/config";
import { IKImage, IKVideo, ImageKitProvider, IKUpload, ImageKitContext } from "imagekitio-next";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
    onFileChange: (filePath: string) => void;
    type: "image" | "video";
    accept: string;
    placeholder: string;
    folder: string;
    variant: "dark" | "light";
    value?: string;
}

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

const FileUpload = ({onFileChange, type, accept, placeholder, folder, variant, value}: Props) => {
    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{filePath: string | null}>({filePath: value || null});
    const [progress, setProgress] = useState(0);    

    const styles = {
        button: variant === "dark" ? "bg-dark-300" : "bg-light-600 border-gray-100 border",
        placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
        text: variant === "dark" ? "text-light-100" : "text-dark-400"
    }

    const onError = (error: any) => {
        console.log(error);
        toast({
            title: `Ngarkimi i ${type === "image" ? "imazhit" : "videos"} deshtoi!`,
            description: `${type === "image" ? "Imazhi" : "Video"} juaj nuk mundi te ngarkohet. Ju lutem provoni perseri!`,
            variant: "destructive"
        })
    }

    const onSuccess = (res: any) => {
        console.log(res);
        
        setFile(res)
        onFileChange(res.filePath)
        toast({
            title: `${type === "image" ? "Imazhi" : "Video"} u ngarkua me sukses!`,
            description: `${res.filePath} u ngarkua me sukses!`
        })
    }

    const onValidate = (file: File) => {
        if(type === "image"){
            if(file.size > 20 * 1024 * 1024) {
                toast({
                    title: "Madhesia e imazhit eshte shume e madhe",
                    description: "Ju lutem ngarkoni nje imazh qe eshte me i vogel se 20MB ne madhesi",
                    variant: "destructive"
                })
                return false
            }
        }else if(type === "video"){
            if(file.size > 50 * 1024 * 1024) {
                toast({
                    title: "Madhesia e videos eshte shum e madhe",
                    description: "Ju lutem ngarkoni nje video qe eshte me e vogel se 50MB ne madhesi",
                    variant: "destructive"
                })
                return false
            }
        }
        return true;
    }

  return (
    <ImageKitProvider publicKey={config.env.imagekit.publicKey} urlEndpoint={config.env.imagekit.urlEndpoint} authenticator={authenticator}>
        <IKUpload
            className="hidden"
            ref={ikUploadRef}
            onError={onError}
            onSuccess={onSuccess}
            useUniqueFileName={true}
            validateFile={onValidate}
            onUploadStart={() => setProgress(0)}
            onUploadProgress={({loaded, total}) => {
                const precent = Math.round((loaded / total) * 100)
                setProgress(precent);
            }}
            folder={folder}
            accept={accept}
            />
            
            <button className={cn("upload-btn bg-dark-300", styles.button)} onClick={(e) => {
                e.preventDefault();
                if(ikUploadRef.current){
                    //@ts-ignore
                    ikUploadRef.current?.click();
                }
            }}>
                <Image src={"/icons/upload.svg"} alt="upload-icon" width={20} height={20} className="object-contain"/>
                <p className={cn("text-base text-light-100", styles.placeholder)}>{placeholder}</p>
                
                {file && <p className={cn("upload-filename break-all max-w-40 mb-1 ml-4", styles.text)}>{file.filePath}</p>}
                </button>

                {progress > 0 && (
                    <div className="w-full rounded-full bg-green-200">
                        <div className="progress" style={{width: `${progress}%`}}>{progress}%</div>
                    </div>
                )}

                {file.filePath && (
                    (type === "image" ? (
                        <IKImage 
                            alt={file.filePath as string}
                            path={file.filePath as string}
                            width={500}
                            height={500}
                        />
                    ) : type === "video" ? (
                        <IKVideo 
                            path={file.filePath as string}
                            controls={true}
                            className="h-96 w-full rounded-xl"
                        />
                    ) : null) 
                )}
    </ImageKitProvider>
  )
}

export default FileUpload