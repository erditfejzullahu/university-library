"use client"
import { icons } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'

type Type = "Role" | "Status";

interface Props {
  type: Type;
  selected: string;
  selectable: string[];
  opened: boolean;
  onClose: () => void;
}



const ChangeStatus = ({type, selected, selectable, opened, onClose}: Props) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
        onClose();
      }
      console.log('ei');
      
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose, opened])

  const dropdownRef = useRef<HTMLDivElement>(null);

  if(!opened) return null
  return (
    <div ref={dropdownRef} className="absolute -top-2 left-0 right-0 mx-auto z-100 w-[130px]">
      <div className="flex flex-col bg-white shadow-[0px_0px_15px_rgba(0,0,0,0.20)] gap-1 rounded-lg w-full overflow-hidden">
        {selectable.map((item, index) => (
          <div key={item} className={cn("p-2 hover:bg-light-300 flex-1 flex flex-row justify-between items-center gap-2 cursor-pointer relative", index === 0 ? "after:content-[''] after:border-b after:absolute after:-bottom-0.5 after:w-[80%] after:left-0 after:right-0 after:mx-auto" : "")}>
            <div className="flex-1">
              <span className="block text-black font-normal text-sm flex-1">{item}</span>
            </div>
            {selected === item && <div className="cursor-pointer">
              <Image src={icons.tick} width={20} height={20} alt='tick'/>
            </div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChangeStatus